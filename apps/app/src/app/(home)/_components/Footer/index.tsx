"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCreate } from "./IconCreate";
import { IconQuests } from "./IconQuest";
import { IconTrending } from "./IconTrending";

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

  return (
    <div className="absolute inset-x-0 bottom-0 z-50 flex h-20 bg-white shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.url}
            className="flex flex-1 flex-col items-center justify-center"
            href={item.url}
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
    </div>
  );
};
