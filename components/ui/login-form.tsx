"use client";

import {
  Button,
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ApiError } from "@/types/api/returns/error";
import {
  ApiAuthorizedRedirect,
  ApiLoginSuccess,
} from "@/types/api/returns/login";
import { ApiSuccess } from "@/types/api/returns/success";
import Cookies from "js-cookie";
import { useAuth } from "../providers/auth-provider";

const LoginForm = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultUsername, setDefaultUsername] = useState<string | null>(null);

  useEffect(() => {
    const getUsernameFromCookie = () => {
      const username = Cookies.get("username");
      if (username) {
        setDefaultUsername(username);
      }
    };
    getUsernameFromCookie();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      const data = (await response.json()) as
        | ApiError
        | ApiAuthorizedRedirect
        | ApiLoginSuccess
        | ApiSuccess;

      if ("error" in data) {
        setApiError(data.error);
        return;
      }

      if ("redirect_to" in data) {
        const redirectUrl = new URL(data.redirect_to, window.location.origin);
        Cookies.set("change_pass_token", data.token, {
          expires: 1 / 24 / 6,
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("username", formData.get("username") as string, {
          expires: 1 / 24 / 6,
          secure: true,
          sameSite: "strict",
        });
        router.push(`${redirectUrl.pathname}${redirectUrl.search}`);
        return;
      }

      setMessage(data.message);

      if ("user_id" in data && "username" in data) {
        setUser({ user_id: data.user_id.toString(), username: data.username });
      }
    } catch {
      setApiError(
        "No se pudo conectar con el servidor. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form
      className="flex w-100 flex-col gap-4"
      onSubmit={handleSubmit}
      data-invalid={apiError ? true : undefined}
    >
      <TextField
        key={defaultUsername || "empty"}
        isRequired
        name="username"
        type="text"
        defaultValue={defaultUsername || undefined}
        validate={(value) => {
          if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
            return "Introduce un nombre de usuario válido";
          }
          return null;
        }}
      >
        <Label>Nombre de usuario</Label>
        <Input placeholder="Introduce tu nombre de usuario" />
        <FieldError />
      </TextField>

      <TextField
        isRequired
        name="password"
        type="password"
        validate={(value) =>
          value.length > 0 ? null : "Introduce una contraseña"
        }
      >
        <Label>Contraseña</Label>
        <Input placeholder="Introduce tu contraseña" />
        <FieldError />
      </TextField>
      {apiError && <ErrorMessage>{apiError}</ErrorMessage>}
      {message && (
        <p className="text-sm text-muted-foreground text-success" role="status">
          {message}
        </p>
      )}

      <div className="flex justify-between gap-2">
        <Button type="submit" isPending={isSubmitting}>
          Iniciar sesión
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/private-app")}
        >
          ¿No tienes cuenta?
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
