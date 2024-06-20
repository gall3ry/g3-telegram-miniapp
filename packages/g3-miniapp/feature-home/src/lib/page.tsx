import { env } from '@gall3ry/g3-miniapp-env';
import { Link } from '@radix-ui/themes';
import { Leaderboard } from './_components/Leaderboard';
import { MyCurrentPosition } from './_components/MyCurrentPosition';
import { Top } from './_components/Top';

function Home() {
  return (
    <div>
      {env.NEXT_PUBLIC_G3_ENV !== 'production' && (
        <div className="bg-yellow-100 p-4 text-center">
          <Link href="/providers">Login with other wallets</Link>
        </div>
      )}

      <Top />

      <MyCurrentPosition />

      <div className="mt-4">
        <Leaderboard />
      </div>
    </div>
  );
}

export { Home };
