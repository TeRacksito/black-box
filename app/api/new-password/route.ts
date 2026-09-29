import db, { UserRow } from "@/lib/db";
import { ApiError } from "@/types/api/returns/error";
import { ApiSuccess } from "@/types/api/returns/success";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookiesStore = await cookies();
    const body = await request.json();
    const { username, password } = body;

    const token = cookiesStore.get("change_pass_token")?.value;

    if (!password) {
      return NextResponse.json<ApiError>(
        { error: "La nueva contraseña es requerida" },
        { status: 400 },
      );
    }

    if (!username || !token) {
      return NextResponse.json<ApiError>(
        {
          error:
            "Faltan datos críticos para establecer la nueva contraseña. Esto podría deberse a un error al cargar la página. Intente iniciar sesión de nuevo.",
          technical_error: "Missing username or token in request body",
        },
        { status: 400 },
      );
    }

    const [rows] = await db.execute<UserRow[]>(
      "SELECT id, username, change_pass_token, change_pass_token_expires_at FROM users WHERE username = ? LIMIT 1",
      [username],
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json<ApiError>(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    if (
      user.change_pass_token !== token ||
      !user.change_pass_token_expires_at ||
      new Date() > new Date(user.change_pass_token_expires_at)
    ) {
      return NextResponse.json<ApiError>(
        {
          error:
            "La acción de cambio de contraseña ha expirado. Por favor, intente iniciar sesión de nuevo.",
          technical_error: "Token expired or invalid",
        },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.execute(
      "UPDATE users SET password_hash = ?, change_pass_token = NULL, change_pass_token_expires_at = NULL WHERE id = ?",
      [passwordHash, user.id],
    );

    return NextResponse.json<ApiSuccess>(
      { message: "Contraseña actualizada exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in /api/new-password:", error);
    return NextResponse.json<ApiError>(
      {
        error:
          "Ocurrió un error al intentar establecer la nueva contraseña. Por favor, inténtalo de nuevo.",
      },
      { status: 500 },
    );
  }
}
