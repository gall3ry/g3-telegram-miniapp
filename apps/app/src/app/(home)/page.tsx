"use client";
import { Leaderboard } from "./Leaderboard";
import { Top } from "./_components/Top";

export default function Home() {
  return (
    <div>
      <Top />

      <div className="mt-4">
        <Leaderboard />
      </div>

      {/* <MintOCC /> */}
    </div>
  );
}
