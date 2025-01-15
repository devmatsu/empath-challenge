import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export async function saveItem(tableName: string, item: Record<string, any>): Promise<void> {
  try {
    await ddb.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      })
    );
  } catch (error) {
    console.error("Error saving item to DynamoDB:", error);
    throw error;
  }
}
