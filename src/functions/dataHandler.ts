import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Client } from "pg";

import { createTableIfNotExists } from "../util/dbSetup";

export const postData = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  const client = new Client({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    database: process.env.DATABASE_NAME || "local",
    user: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "password",
    ssl: process.env.USE_SSL === "true" ? { rejectUnauthorized: false } : false,
  });

  try {
    const body = JSON.parse(event.body || "{}");

    await client.connect();
    await createTableIfNotExists();

    const query = "INSERT INTO data_table (data) VALUES ($1) RETURNING id";
    const values = [body];
    const res = await client.query(query, values);

    return {
      statusCode: 201,
      body: JSON.stringify({ id: res.rows[0].id, data: body }),
    };
  } catch (error) {
    console.error("Error inserting data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  } finally {
    await client.end();
  }
};
