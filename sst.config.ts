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
    const vpc = new sst.aws.Vpc("MyVpc", { nat: "managed" });
    const postgres = new sst.aws.Postgres("MyPostgres", {
      vpc,
      dev: {
        username: "postgres",
        password: "password",
        database: "local",
        port: 5432,
      },
    });

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

    const { USE_CUSTOM_DOMAIN } = process.env;
    const altConfig = USE_CUSTOM_DOMAIN ? { domain: process.env.DOMAIN } : {};
    const api = new sst.aws.ApiGatewayV2("MyApi", altConfig);
    
    api.route("GET /random", {
      handler: "src/functions/randomNumber.generate",
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
      handler: "src/functions/randomNumber.getLogs",
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

    api.route("POST /data", {
      handler: "src/functions/dataHandler.postData",
      environment: {
        DATABASE_NAME: postgres.database,
        DATABASE_HOST: postgres.host,
        DATABASE_PORT: postgres.port.toString(),
        DATABASE_USER: postgres.username,
        DATABASE_PASSWORD: postgres.password,
      },
      vpc,
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
      postgres: postgres.database,
    };
  },
});
