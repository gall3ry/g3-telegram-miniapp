"use client";
import { Leaderboard } from "./Leaderboard";
import { MintOCC } from "./_components/MintOCC";
import { Top } from "./_components/Top";

export default function Home() {
  return (
    <div>
      <Top />

      <div className="mt-4">
        <Leaderboard />
      </div>

      <MintOCC />
    </div>
  );
}
