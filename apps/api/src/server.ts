import { PrismaClient } from "@prisma/client";
import { createApiServer } from "./app.ts";
import { createOtpDelivery } from "./otp-delivery.ts";
import { PrismaStore } from "./prisma-store.ts";

const appEnv = process.env.APP_ENV ?? "development";
const jwtSecret = process.env.JWT_SECRET ?? "";
const otpSecret = process.env.OTP_SECRET ?? jwtSecret;
const prisma = new PrismaClient();
const store = new PrismaStore(prisma);

const otpDelivery = createOtpDelivery({
  appEnv,
  providerUrl: process.env.OTP_DELIVERY_URL,
  providerToken: process.env.OTP_DELIVERY_TOKEN,
});

const server = createApiServer({
  store,
  otpDelivery,
  jwtSecret,
  otpSecret,
  challengeQuestionCount: Number(process.env.CHALLENGE_QUESTION_COUNT ?? "10"),
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