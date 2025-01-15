import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

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

export async function getLastLogs(tableName: string, limit: number = 5): Promise<any[]> {
  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: "TimestampIndex",
        KeyConditionExpression: "#itemType = :itemTypeValue",
        ExpressionAttributeNames: {
          "#itemType": "itemType",
        },
        ExpressionAttributeValues: {
          ":itemTypeValue": "logs",
        },
        Limit: limit,
        ScanIndexForward: false,
      })
    );

    return result.Items || [];
  } catch (error) {
    console.error("Error retrieving logs from DynamoDB:", error);
    throw error;
  }
}
