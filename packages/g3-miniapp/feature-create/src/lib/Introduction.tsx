import { IMAGES } from '@gall3ry/shared-constants';
import Image from 'next/image';
import Link from 'next/link';

export const Introduction = () => {
  return (
    <div className="px-5">
      <div className="w-full aspect-square rounded-xl relative">
        <Image src={IMAGES.create.fairy} fill alt="fairy" />
      </div>

      <div className="mt-6">
        <div className="text-center text-green-400 text-[32px] font-bold leading-[44px]">
          EPIC Fairy
        </div>

        <div className="mt-2 text-slate-900 text-xl font-bold leading-7">
          Get to know
        </div>

        <div className="mt-2 h-[156px] flex-col justify-start items-start gap-2 inline-flex">
          <div className="justify-start items-start inline-flex">
            <div className="w-5 h-5 pl-[3.33px] pr-2.5 py-[6.67px] justify-start items-center flex">
              <div className="w-[6.67px] h-[6.67px] bg-slate-500 rounded-full" />
            </div>
            <div className="text-slate-500 text-sm font-light leading-tight tracking-tight">
              Create your own Telegram stickers with Epic Fairy and earn $EPIC
              points{' '}
              <span role="img" aria-label="star">
                🌟
              </span>{' '}
            </div>
          </div>
          <div className="justify-start items-start inline-flex">
            <div className="w-5 h-5 pl-[3.33px] pr-2.5 py-[6.67px] justify-start items-center flex">
              <div className="w-[6.67px] h-[6.67px] bg-slate-500 rounded-full" />
            </div>
            <div className="text-slate-500 text-sm font-light leading-tight tracking-tight">
              Share stickers with Epic Fairy to gain XP and watch your fairy
              grow{' '}
              <span role="img" aria-label="seedling">
                🌱
              </span>
            </div>
          </div>
          <div className="justify-start items-start inline-flex">
            <div className="w-5 h-5 pl-[3.33px] pr-2.5 py-[6.67px] justify-start items-center flex">
              <div className="w-[6.67px] h-[6.67px] bg-slate-500 rounded-full" />
            </div>
            <div className="text-slate-500 text-sm font-light leading-tight tracking-tight">
              The more you grow your Epic Fairy, the more stickers and effects
              you can create on Telegram, and the more $EPIC points you can
              collect{' '}
              <span role="img" aria-label="chart-increasing">
                📈
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-slate-900 text-xl font-bold leading-7">
          How to earn XP
        </div>

        <HowToEarnXP />
      </div>
    </div>
  );
};

const HowToEarnXP = () => {
  type Item = {
    icon: string;
    boldText: string;
    lightText?: React.ReactNode;
  };
  const items = [
    {
      icon: '📩',
      boldText: 'Earn 5XP:',
      lightText: (
        <>
          <span className="text-slate-500 text-sm font-light leading-tight tracking-tight">
            Every sticker share with{' '}
          </span>
          <Link
            href="https://t.me/epic_bot"
            className="text-blue-400 text-sm font-light leading-tight tracking-tight"
          >
            @epic_bot
          </Link>
        </>
      ),
    },
    {
      icon: '👍',
      boldText: 'Earn 1XP:',
      lightText: (
        <>
          {/* Every sticker reaction */}
          <span className="text-slate-500 text-sm font-light leading-tight tracking-tight ml-0.5 inline-block">
            Every sticker reaction
          </span>
        </>
      ),
    },
    {
      icon: '🌟',
      boldText: 'Earn 1XP:',
      lightText: (
        <span className="text-slate-500 text-sm font-light leading-tight tracking-tight inline-block ml-0.5">
          Every Epic sticker sets usage
        </span>
      ),
    },
    {
      icon: '🎯',
      boldText: 'Finish daily quests for bonus XP',
    },
  ] satisfies Item[];

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const icon = item.icon;
        const boldText = item.boldText;
        const lightText = item?.lightText;

        return (
          <div className="h-5 items-center flex">
            <div className="w-5 h-5 px-[3.33px] py-[6.67px] justify-start items-center flex">
              <div className="size-[6.67px] bg-slate-500 rounded-full" />
            </div>

            <div className="text-slate-700 text-sm font-semibold leading-none tracking-tight flex items-center">
              <span role="img" aria-label="star">
                {icon}
              </span>{' '}
              <span className="inline-block ml-1">{boldText}</span>
              <div className="grow shrink basis-0 ml-1">{lightText}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
