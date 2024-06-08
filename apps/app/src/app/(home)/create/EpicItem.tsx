import { Avatar, Button } from "@radix-ui/themes";
import { cn } from "@repo/utils";
import Link from "next/link";

type Participant = {
  id: number;
  name: string;
  avatar: string | null;
};

export const EpicItem = ({
  name,
  description,
  occMinted,
  hasYouMinted,
  href,
  participants,
}: {
  name: string;
  description?: string | null;
  occMinted: number;
  hasYouMinted: boolean;
  href: string;
  participants: Participant[];
}) => {
  return (
    <Link
      className={cn(
        "relative flex h-[132px] gap-4 rounded-xl p-4 transition hover:bg-opacity-70",
        "bg-[#F2F6F9]",
        {
          "bg-[#F8FFB7]": hasYouMinted,
        },
      )}
      href={href}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-[100px] w-[100px] rounded-lg"
        src="https://fastly.picsum.photos/id/947/200/200.jpg?hmac=Nso8kNr17S_Y5Rr6XXnifQUmzulyyA29wQXwgsJmb8A"
        alt="epic"
      />

      <div className="flex grow flex-col">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold leading-7 text-slate-900">
            {name}
          </div>

          {hasYouMinted && <Button>Minted</Button>}
        </div>

        {description && (
          <div className="mt-1.5">
            <div className="text-sm font-light leading-tight tracking-tight text-slate-500">
              {description}
            </div>
          </div>
        )}

        <div className="flex-1"></div>

        <div className="mt-2.5">
          <div className="flex h-6 items-center gap-2">
            <div className="flex">
              {participants.slice(0, 4).map((p, i) => (
                <Avatar
                  className="-ml-2 first:ml-0"
                  key={i}
                  src={p.avatar ?? undefined}
                  fallback={p.name.charAt(0)}
                  size="1"
                />
              ))}
            </div>

            <div className="text-base font-medium leading-normal tracking-tight text-slate-900">
              {Intl.NumberFormat().format(occMinted)} minted
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
