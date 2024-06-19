import { Leaderboard } from './_components/Leaderboard';
import { MyCurrentPosition } from './_components/MyCurrentPosition';
import { Top } from './_components/Top';

function Home() {
  return (
    <div>
      <Top />

      <MyCurrentPosition />

      <div className="mt-4">
        <Leaderboard />
      </div>
    </div>
  );
}

export { Home };
