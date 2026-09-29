"use client";

import { ApiError } from "@/types/api/returns/error";
import { ApiSuccess } from "@/types/api/returns/success";
import {
  Button,
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NewPasswordForm = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultUsername, setDefaultUsername] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectSecondsRemaining, setRedirectSecondsRemaining] = useState(3);

  const deferredRedirectToLogin = () => {
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  const startRedirectTimer = () => {
    const interval = setInterval(() => {
      setRedirectSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          deferredRedirectToLogin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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
      const response = await fetch("/api/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      const data = (await response.json()) as ApiError | ApiSuccess;

      console.log("Response data:", data);

      if ("error" in data) {
        setApiError(data.error);
        return;
      }

      setMessage(data.message);
      setIsSuccess(true);
      startRedirectTimer();
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
      className="flex w-00 flex-col gap-4"
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
        onChange={setPassword}
        validate={(value) =>
          value.length > 0 ? null : "Introduce una contraseña"
        }
      >
        <Label>Contraseña</Label>
        <Input placeholder="Introduce la nueva contraseña" />
        <FieldError />
      </TextField>

      <TextField
        isRequired
        name="password_confirm"
        type="password"
        validate={(value) => {
          if (value.length === 0) {
            return "Introduce una contraseña";
          }
          if (value !== password) {
            return "Las contraseñas no coinciden";
          }
          return null;
        }}
      >
        <Label>Confirmar contraseña</Label>
        <Input placeholder="Introduce la nueva contraseña de nuevo" />
        <FieldError />
      </TextField>

      {apiError && <ErrorMessage>{apiError}</ErrorMessage>}
      {message && (
        <p className="text-sm text-muted-foreground text-success" role="status">
          {message}
        </p>
      )}
      {isSuccess && (
        <p className="text-sm text-muted-foreground text-success" role="status">
          Redirigiendo a la página de inicio de sesión en{" "}
          {redirectSecondsRemaining} segundos...
        </p>
      )}

      <div className="flex justify-between gap-2">
        <Button type="submit" isPending={isSubmitting} isDisabled={isSuccess}>
          Cambiar contraseña
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/login")}
        >
          Ir a Inicio de sesión
        </Button>
      </div>
    </Form>
  );
};

export default NewPasswordForm;
