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
      },
      primaryIndex: { hashKey: "id" },
    });

    const api = new sst.aws.ApiGatewayV2("MyApi");

    api.route("GET /", {
      handler: "src/randomNumber.generate",
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
