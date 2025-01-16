import { Client } from "pg";

export const createTableIfNotExists = async () => {
  const client = new Client({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    database: process.env.DATABASE_NAME || "local",
    user: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "password",
    ssl: process.env.USE_SSL === "true" ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();

    const query = `
      CREATE TABLE IF NOT EXISTS data_table (
          id SERIAL PRIMARY KEY,
          data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(query);

  } catch (err) {
    console.error("Error ensuring table existence:", err);
    throw err;
  } finally {
    await client.end();
  }
};
