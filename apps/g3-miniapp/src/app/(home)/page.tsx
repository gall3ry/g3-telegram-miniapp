"use client";
import { useIsAuthenticated } from "../_providers/useAuth";
import { Top } from "./_components/Top";
import { Leaderboard } from "./Leaderboard";
import { MyCurrentPosition } from "./MyCurrentPosition";

export default function Home() {
  const { isAuthenticated } = useIsAuthenticated();

  return (
    <div>
      <Top />

      {isAuthenticated && <MyCurrentPosition />}

      <div className="mt-4">
        <Leaderboard />
      </div>

      {/* <MintOCC /> */}
    </div>
  );
}
