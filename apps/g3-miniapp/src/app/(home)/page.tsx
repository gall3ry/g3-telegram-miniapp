import { Top } from './_components/Top';
import { Leaderboard } from './Leaderboard';
import { MyCurrentPosition } from './MyCurrentPosition';

export default function Home() {
  return (
    <div>
      <Top />

      <MyCurrentPosition />

      <div className="mt-4">
        <Leaderboard />
      </div>

      {/* <MintOCC /> */}
    </div>
  );
}
