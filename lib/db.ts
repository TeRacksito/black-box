import mysql, { Pool, RowDataPacket } from "mysql2/promise";

declare global {
  var mysqlPool: Pool | undefined;
}

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "no_user",
  password: process.env.DB_PASSWORD || "no_password",
  database: process.env.DB_NAME || "no_database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const db = globalThis.mysqlPool || mysql.createPool(dbConfig);

if (process.env.NODE_ENV === "development") {
  globalThis.mysqlPool = db;
}

export interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
}

export default db;
