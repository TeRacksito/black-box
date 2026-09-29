import db, { UserRow } from "@/lib/db";
import { ApiError } from "@/types/api/returns/error";
import {
  ApiAuthorizedRedirect,
  ApiLoginSuccess,
} from "@/types/api/returns/login";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json<ApiError>(
        { error: "Nombre de usuario y contraseña son requeridos" },
        { status: 400 },
      );
    }

    const [rows] = await db.execute<UserRow[]>(
      "SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1",
      [username],
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json<ApiError>(
        { error: "Nombre de usuario o contraseña incorrectos" },
        { status: 401 },
      );
    }

    if (!user.password_hash) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 10 * 1000);

      await db.execute(
        "UPDATE users SET change_pass_token = ?, change_pass_token_expires_at = ? WHERE id = ?",
        [token, expiresAt, user.id],
      );

      return NextResponse.json<ApiAuthorizedRedirect>(
        {
          redirect_to: "/new-password",
          token,
        },
        { status: 200 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json<ApiError>(
        { error: "Nombre de usuario o contraseña incorrectos" },
        { status: 401 },
      );
    }

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    session.user_id = user.id.toString();
    session.username = user.username;
    session.is_logged_in = true;
    session.last_seen = Date.now();
    await session.save();

    return NextResponse.json<ApiLoginSuccess>(
      {
        message: "Inicio de sesión exitoso",
        user_id: user.id,
        username: user.username,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fatal error in /api/login:", error);
    return NextResponse.json(
      {
        error:
          "Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.",
      },
      { status: 500 },
    );
  }
}
