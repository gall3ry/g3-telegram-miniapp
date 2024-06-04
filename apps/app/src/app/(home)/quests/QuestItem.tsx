import { Button } from "@radix-ui/themes";
import { cn } from "@repo/utils";
import Link from "next/link";
import { useMemo } from "react";
import { IconPoints } from "../_icons/IconPoints";

type QuestItemProps = {
  title: string;
  description: string;
  points: number;
  text?: string;
  isClaimable?: boolean;
  onClick?: () => void;
};

export const QuestItem = ({
  description,
  points,
  text,
  title,
  isClaimable,
  onClick,
}: QuestItemProps) => {
  const _text = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (isClaimable || !text) {
      return "Claim";
    }

    return text;
  }, [isClaimable, text]);

  return (
    <Link
      className={cn(
        "relative flex h-[132px] flex-col rounded-xl bg-[#F2F6F9] p-4 pt-3 transition hover:bg-opacity-70",
        isClaimable && "bg-[#F8FFB7]",
      )}
      href="#"
    >
      <div className="text-xl font-bold leading-7 text-slate-900">{title}</div>
      <div className="mt-0.5 text-sm font-light leading-tight tracking-tight text-slate-500">
        {description}
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="size-7">
            <IconPoints />
          </div>

          <span className="text-right text-2xl font-bold leading-9 text-slate-900">
            {Intl.NumberFormat().format(points)}
          </span>
        </div>

        <Button size="2" onClick={onClick} disabled={!isClaimable}>
          {_text}
        </Button>
      </div>
    </Link>
  );
};
