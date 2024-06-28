import { cn } from '@g3-miniapp/utils';
import { IconPoints } from '@gall3ry/g3-miniapp-icon';
import { Button } from '@gall3ry/g3-miniapp-ui';
import Link from 'next/link';
import { useMemo } from 'react';
import { IconCheck } from './_icon/IconCheck';

type QuestItemProps = {
  title: string;
  description: string;
  points: number;
  text?: string;
  isClaimable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isCompleted?: boolean;
};

export const QuestItem = ({
  description,
  points,
  text,
  title,
  isClaimable,
  onClick,
  disabled,
  isCompleted,
}: QuestItemProps) => {
  const _button = useMemo(() => {
    const _text = _getText();

    if (isCompleted) {
      return (
        <Button
          size="medium"
          onClick={(e) => {
            e.preventDefault();

            onClick?.();
          }}
          disabled={disabled}
          className="bg-white"
        >
          <IconCheck width={16} height={16} />
          <div className="text-base font-bold leading-normal text-[#54D669]">
            Completed
          </div>
        </Button>
      );
    }

    return wrapText(_text);

    function wrapText(text: string) {
      return (
        <Button size="medium" onClick={onClick} disabled={disabled}>
          {text}
        </Button>
      );
    }
    function _getText() {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      if (isClaimable || !text) {
        return 'Claim';
      }

      return text;
    }
  }, [disabled, isClaimable, isCompleted, onClick, text]);

  return (
    <Link
      className={cn(
        'relative flex h-[132px] flex-col rounded-xl bg-[#F2F6F9] p-4 pt-3 transition hover:bg-opacity-70',
        isClaimable && 'bg-[#F8FFB7]'
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

        {_button}
      </div>
    </Link>
  );
};
