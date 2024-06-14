// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import input from 'input';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

(async () => {
  const apiId = 25258261;
  const apiHash = 'ecdcb0e838175aee63d57acdbf9c76b0';
  const stringSession = new StringSession('');

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    autoReconnect: true,
  });

  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () =>
      await input.text('Please enter the code you received: '),
    onError: (err) => console.log(err),
  });

  console.log('String session:', stringSession.save());

  await client.disconnect();
})();
