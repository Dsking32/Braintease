import { PrismaClient } from "@prisma/client";
import { createApiServer } from "./app.ts";
import { PrismaStore } from "./prisma-store.ts";

const appEnv = process.env.APP_ENV ?? "development";
const jwtSecret = process.env.JWT_SECRET ?? "";
const otpSecret = process.env.OTP_SECRET ?? jwtSecret;
const prisma = new PrismaClient();
const store = new PrismaStore(prisma);

const otpDelivery = {
  async send(msisdn: string, code: string) {
    const providerUrl = process.env.OTP_DELIVERY_URL;
    const providerToken = process.env.OTP_DELIVERY_TOKEN;
    if (providerUrl) {
      const response = await fetch(providerUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(providerToken ? { authorization: `Bearer ${providerToken}` } : {}),
        },
        body: JSON.stringify({
          to: msisdn,
          message: `Your BrainTease verification code is ${code}`,
        }),
      });
      if (!response.ok) throw new Error("OTP provider rejected the delivery request");
      return;
    }
    if (appEnv === "production") throw new Error("OTP_DELIVERY_URL must be configured in production");
    console.info(`Development OTP for ...${msisdn.slice(-4)}: ${code}`);
  },
};

const server = createApiServer({
  store,
  otpDelivery,
  jwtSecret,
  otpSecret,
  challengeQuestionCount: Number(process.env.CHALLENGE_QUESTION_COUNT ?? "10"),
  challengeTimeZone: process.env.CHALLENGE_TIME_ZONE ?? "UTC",
});

const port = Number(process.env.API_PORT ?? "4000");
server.listen(port, () => console.info(`BrainTease API listening on ${port}`));

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(() => {
      void store.disconnect().finally(() => process.exit(0));
    });
  });
}