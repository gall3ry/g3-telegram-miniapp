import axios, { AxiosStatic } from 'axios';
import TonWeb from 'tonweb';
type GetTokensPayload = {
  walletAddress: string;
  limit?: number;
  page?: number;
};

type JettonsByOwnerRes = {
  balances: {
    jetton: {
      address: string;
      name: string;
      symbol: string;
      decimals: number;
      image: string;
    };
    balance: string;
    price: {
      prices: {
        USD: number;
      };
      diff_24h: {
        USD: string;
      };
    };
  }[];
};

type Token = {
  symbol: string;
  name: string;
  showingDecimals: number;
  twentyFourHourChangePercent: number;
};

type GetTokensResponse = {
  total: number;
  items: Token[];
};

type GetTokensResponseWithOwner = GetTokensResponse & {
  walletAddress: string;
};

export class TonTokenApi {
  private TonConsoleApiKey: string;
  constructor(api_key: string) {
    if (!api_key) throw new Error('TONCONSOLE_API_KEY is not set');
    this.TonConsoleApiKey = api_key;
  }
  /*
   * @param walletAddress - user wallet address
   * @param limit - number of tokens to fetch
   * @param offset - skip N rows for pagination
   * Note: Including Balance and Price fields in response
   */
  public async getTokensByOwner(payload: GetTokensPayload): Promise<{
    total: number;
    items: Token[];
  }> {
    const { walletAddress } = payload;
    const { limit, page } = payload ?? {
      limit: 10,
      page: 1,
    };
    const noBounceWalletAddress = new TonWeb.utils.Address(
      walletAddress
    ).toString(true, true, false, false);
    const res = await axios
      .get<JettonsByOwnerRes>(
        `https://tonapi.io/v2/accounts/${noBounceWalletAddress}/jettons`,
        {
          params: {
            currencies: 'usd',
          },
          headers: {
            'x-api-key': this.TonConsoleApiKey,
            Accept: 'application/json',
          },
        }
      )
      .then((res) => res.data)
      .catch((e) => {
        throw e;
      });
    if (!res.balances) {
      return {
        total: 0,
        items: [],
      };
    }
    const items: Token[] = res.balances.map((balance) => {
      const percentage = Number(
        balance.price.diff_24h.USD.replace('%', '').replace('−', '-')
      );

      return {
        symbol: balance.jetton.symbol,
        name: balance.jetton.name,
        showingDecimals: balance.jetton.decimals,
        twentyFourHourChangePercent: percentage === 0 ? 0 : percentage / 100,
      };
    });
    if (page * limit > items.length) {
      return {
        total: items.length,
        items: items.slice((page - 1) * limit),
      };
    }
    return {
      total: items.length,
      items: items.slice((page - 1) * limit, page * limit),
    };
  }
  retryWrapper = (
    axios: AxiosStatic,
    options: {
      retry_time: number;
    }
  ) => {
    const max_time = options.retry_time;
    let counter = 0;
    axios.interceptors.response.use(null, (error) => {
      /** @type {import("axios").AxiosRequestConfig} */
      const config = error.config;
      if (counter < max_time) {
        counter++;
        return new Promise((resolve) => {
          resolve(axios(config));
        });
      }
      return Promise.reject(error);
    });
  };

  async getTokensByOwnerBatch(
    payloads: GetTokensPayload[]
  ): Promise<GetTokensResponseWithOwner[]> {
    this.retryWrapper(axios, { retry_time: 3 });
    const res = await axios.all(
      payloads.map((payload) => this.getTokensByOwner(payload))
    );

    return res.map((r, i) => {
      return {
        ...r,
        walletAddress: payloads[i].walletAddress,
      };
    });
  }
}
