"use client";
import { cn } from "@repo/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { create } from "zustand";
import { IconCreate } from "./IconCreate";
import { IconQuests } from "./IconQuest";
import { IconTrending } from "./IconTrending";

type Footer = {
  footer: React.ReactNode;
  setFooter: (footer: React.ReactNode) => void;
};

export const useFooter = create<Footer>()((set) => ({
  footer: null,
  setFooter: (footer) => set({ footer }),
}));

export const Footer = () => {
  const pathname = usePathname();
  const items = [
    {
      icon: IconTrending,
      title: "Trending",
      pattern: /^\/$/,
      url: "/",
    },
    {
      icon: IconCreate,
      title: "Create",
      pattern: /^\/create/,
      url: "/create",
    },
    {
      icon: IconQuests,
      title: "Quests",
      pattern: /^\/quests/,
      url: "/quests",
    },
  ];
  const { footer } = useFooter();
  const posthog = usePostHog();

  return (
    footer ?? (
      <footer
        className={cn(
          "sticky inset-x-0 bottom-0 z-50 flex h-20 bg-white shadow-2xl",
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.url}
              className="flex flex-1 flex-col items-center justify-center"
              href={item.url}
              onClick={() => {
                posthog.capture("footer_click", {
                  title: item.title,
                  url: item.url,
                });
              }}
            >
              <div className="size-8">
                <Icon isActive={!!pathname.match(item.pattern)} />
              </div>
              <div className="mt-0.5">
                <div className="w-[72px] text-center text-xs font-bold leading-[18px] text-slate-700">
                  {item.title}
                </div>
              </div>
            </Link>
          );
        })}
      </footer>
    )
  );
};
