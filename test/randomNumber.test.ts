import { generate, getLogs } from "../src/functions/randomNumber";
import { saveItem, getLastLogs } from "../src/db/dynamo";

jest.mock("../src/db/dynamo");

describe("randomNumber", () => {
  describe("generate", () => {
    it("should generate and return a random number", async () => {
      (saveItem as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await generate();
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.randomNumber).toBeGreaterThanOrEqual(0);
      expect(body.randomNumber).toBeLessThanOrEqual(10000);
    });

    it("should return 500 if saveItem fails", async () => {
      (saveItem as jest.Mock).mockRejectedValueOnce(new Error("DynamoDB error"));

      const response = await generate();

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body).message).toBe("Internal Server Error");
    });
  });

  describe("getLogs", () => {
    it("should retrieve the last 5 logs", async () => {
      const mockLogs = [
        { id: "1", randomNumber: 1234, timestamp: 1641004800000 },
        { id: "2", randomNumber: 5678, timestamp: 1641008400000 },
      ];
      (getLastLogs as jest.Mock).mockResolvedValueOnce(mockLogs);

      const response = await getLogs();
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body).toEqual(mockLogs);
    });

    it("should return 500 if getLastLogs fails", async () => {
      (getLastLogs as jest.Mock).mockRejectedValueOnce(new Error("DynamoDB error"));

      const response = await getLogs();

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body).message).toBe("Internal Server Error");
    });
  });
});
