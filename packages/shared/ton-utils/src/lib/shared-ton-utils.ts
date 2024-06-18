import { Address, Cell, TonClient, beginCell, storeMessage } from '@ton/ton';
import TonWeb from 'tonweb';
import { schema as tonApiTraceSchema } from './ton/schema';
// Docs: https://docs.ton.org/develop/dapps/cookbook#how-to-find-transaction-for-a-certain-ton-connect-result
const client = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  apiKey: 'a77f15fa1b421eb9bb04a9bb39fe20fb8b91dea8356fd230d0c8a7d75bda00b8', // https://t.me/tonapibot
});

export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay: number }
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof Error) {
        lastError = e;
      }
      await new Promise((resolve) => setTimeout(resolve, options.delay));
    }
  }
  throw lastError;
}

function reject(arg0: Error) {
  throw new Error('Function not implemented.');
}
function hexToBase64(hexString: string): string {
  // Step 1: Convert hex string to byte array
  const byteArray = new Uint8Array(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  // Step 2: Convert byte array to base64 string
  let binaryString = '';
  byteArray.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });
  return btoa(binaryString);
}

export async function getTxByBOC(
  exBoc: string,
  address: string
): Promise<string> {
  // const myAddress = Address.parse('UQBspb3KvCNthTIC98iIxVtHcve4T-kq36_EZry8c9TeOYDo'); // Address to fetch transactions from
  const myAddress = Address.parse(address); // Address to fetch transactions from
  console.log(exBoc);
  return retry(
    async () => {
      console.log('My Address:', myAddress.toString());
      const transactions = await client.getTransactions(myAddress, {
        limit: 5,
      });
      for (const tx of transactions) {
        const inMsg = tx.inMessage;
        if (inMsg?.info.type === 'external-in') {
          const inBOC = inMsg?.body;
          if (typeof inBOC === 'undefined') {
            reject(new Error('Invalid external'));
            continue;
          }
          const extHash = Cell.fromBase64(exBoc).hash().toString('hex');
          const inHash = beginCell()
            .store(storeMessage(inMsg))
            .endCell()
            .hash()
            .toString('hex');

          // console.log(inMsg);
          console.log('hash BOC', extHash);
          console.log('inMsg hash', inHash);
          // console.log('checking the tx', tx, tx.hash().toString('hex'));

          // Assuming `inBOC.hash()` is synchronous and returns a hash object with a `toString` method
          if (extHash === inHash) {
            console.log('Tx match');
            const txHash = tx.hash().toString('hex');
            const txLt = tx.lt;
            console.log(`Transaction Hash: ${txHash}`);
            console.log(`Transaction Hash base64: ${hexToBase64(txHash)}`);
            console.log(`Transaction LT: ${txLt}`);
            return txHash;
          }
        }
      }
      throw new Error('Transaction not found');
    },
    { retries: 300, delay: 1000 }
  );
}

export async function getNFTIdAndOwnerFromTx(
  txhash: string,
  apiKey: string
): Promise<{ owner: string; nftAddress: string }> {
  const resp = await fetch(`https://tonapi.io/v2/traces/${txhash}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });

  const { success, data, error } = tonApiTraceSchema.safeParse(resp);

  if (!success) {
    throw error;
  }

  const { transaction, children } = data;

  const owner = transaction.account.address;
  const nftAddress = children[0]!.children[0]!.transaction.account.address;

  const result = {
    owner,
    nftAddress,
  };

  return result;
}

export const toBounceable = (address: string, unbounceAble?: boolean) => {
  const _address = new TonWeb.utils.Address(address);

  return _address.toString(true, true, !unbounceAble, false);
};
