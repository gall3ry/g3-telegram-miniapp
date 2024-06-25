import { validate } from '@tma.js/init-data-node';
const TOKEN = '7162609772:AAEM7x3Kfeta5CBesezv5gdD5youN6CsnBI';

describe('Check telegram login', () => {
  it('should login with telegram', () => {
    const _initData = `user=%7B%22id%22%3A1216103870%2C%22first_name%22%3A%22Tin%20Nguyen%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22pnpminstall%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8466138492746567038&chat_type=private&auth_date=1719290949&hash=4cc190ca41d42fa85b72bb5f23f320d5191a9c88291f43024e9c3cace3f2e157`;

    validate(_initData, TOKEN, {
      expiresIn: 0,
    });
  });
});
