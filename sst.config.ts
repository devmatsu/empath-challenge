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
    const api = new sst.aws.ApiGatewayV2("MyApi");

    api.route("GET /", {
      handler: "src/randomNumber.generate",
    });

    return {
      url: api.url,
    };
  },
});
