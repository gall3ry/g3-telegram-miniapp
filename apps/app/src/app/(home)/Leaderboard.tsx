"use client";
import { usePostHog } from "posthog-js/react";
import { IMAGES } from "../_constants/image";
import { LeaderboardItem } from "./LeaderboardItem";

export const Leaderboard = () => {
  const { featureFlags } = usePostHog();

  const leaderboardEnabled = featureFlags.isFeatureEnabled("leaderboard", {
    send_event: false,
  });

  if (leaderboardEnabled === false) {
    return null;
  }

  return Array.from({ length: 10 }).map((_, index) => (
    <LeaderboardItem
      key={index}
      rank={index + 1}
      occImageUrl={(IMAGES.MOCK_OCC as any)[(index % 5) + 1]}
      avatarUrl="https://via.placeholder.com/32x32"
      username="RonasFrank"
      shareCount={2078}
      address="0:"
    />
  ));
};
