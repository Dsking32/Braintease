export type OtpDeliveryOptions = {
  appEnv: string;
  providerUrl?: string;
  providerToken?: string;
  fetcher?: typeof fetch;
  logInfo?: (message: string) => void;
};

export function createOtpDelivery(options: OtpDeliveryOptions) {
  const fetcher = options.fetcher ?? fetch;
  const logInfo = options.logInfo ?? ((message) => console.info(message));

  return {
    async send(msisdn: string, code: string): Promise<void> {
      if (options.providerUrl) {
        const response = await fetcher(options.providerUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(options.providerToken ? { authorization: `Bearer ${options.providerToken}` } : {}),
          },
          body: JSON.stringify({ to: msisdn, message: `Your BrainTease verification code is ${code}` }),
        });
        if (!response.ok) throw new Error("OTP provider rejected the delivery request");
        return;
      }
      if (options.appEnv === "production") throw new Error("OTP_DELIVERY_URL must be configured in production");
      logInfo(`Development OTP for ...${msisdn.slice(-4)}: ${code}`);
    },
  };
}