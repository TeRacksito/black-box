// lib/session.ts
import { SessionOptions } from "iron-session";

export interface SessionData {
  user_id?: string;
  last_seen?: number;
  username?: string;
  is_logged_in?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "no_password",
  cookieName: "black_box_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
};
