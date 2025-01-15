import { v4 as uuidv4 } from "uuid";
import { saveItem, getLastLogs } from "./db/dynamo";

type LambdaResponse = {
  statusCode: number;
  body: string;
};

function generateRandomNumber(): number {
  const MIN_NUMBER = 0;
  const MAX_NUMBER = 10000;
  return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
}

export async function generate(): Promise<LambdaResponse> {
  try {
    const randomNumber: number = generateRandomNumber();
    const tableName = process.env.GENERATED_NUMBERS_TABLE;
    const item = {
      id: uuidv4(),
      randomNumber,
      timestamp: Date.now(),
      itemType: "logs",
    };

    await saveItem(tableName, item);

    return {
      statusCode: 200,
      body: JSON.stringify({ randomNumber }),
    };
  } catch (error) {
    console.error("Error generating random number:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}

export async function getLogs(): Promise<LambdaResponse> {
  try {
    const tableName = process.env.GENERATED_NUMBERS_TABLE;
    const last5Numbers = await getLastLogs(tableName, 5);

    return {
      statusCode: 200,
      body: JSON.stringify(last5Numbers),
    };
  } catch (error) {
    console.error("Error retrieving logs:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}
