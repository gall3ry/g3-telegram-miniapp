// @ts-ignore
import input from "input";
import { TelegramClient } from "telegram/index.js";
import { StringSession } from "telegram/sessions/index.js";

(async () => {
  const apiId = 25258261;
  const apiHash = "ecdcb0e838175aee63d57acdbf9c76b0";
  const stringSession = new StringSession("");

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    autoReconnect: true,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("String session:", stringSession.save());

  await client.disconnect();
})();
