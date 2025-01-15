/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "empath-challenge",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const table = new sst.aws.Dynamo("GeneratedNumbers", {
      fields: {
        id: "string",
        itemType: "string",
        timestamp: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        TimestampIndex: {
          hashKey: "itemType",
          rangeKey: "timestamp",
          projection: "all",
        },
      },
    });

    const api = new sst.aws.ApiGatewayV2("MyApi");
    
    api.route("GET /random", {
      handler: "src/randomNumber.generate",
      environment: {
        GENERATED_NUMBERS_TABLE: table.name,
      },
      permissions: [
        {
          actions: ["dynamodb:PutItem"],
          resources: [table.arn]
        },
      ]
    });
    
    api.route("GET /random/logs", {
      handler: "src/randomNumber.getLogs",
      environment: {
        GENERATED_NUMBERS_TABLE: table.name,
      },
      permissions: [
        {
          actions: ["*"],
          resources: ["*"]
        },
      ]
    });

    return {
      url: api.url,
      table: table.name,
    };
  },
});
