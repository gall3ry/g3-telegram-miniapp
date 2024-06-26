import { Button, Drawer, DrawerContent } from '@gall3ry/g3-miniapp-ui';
import { IMAGES } from '@gall3ry/shared-constants';
import { useUtils } from '@tma.js/sdk-react';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { IconMarketplace } from './IconMarketplace';
import { useHelpDrawer } from './useHelpDrawer';

export const HelpDrawer = (props: ComponentProps<typeof Drawer>) => {
  return (
    <Drawer {...props}>
      <DrawerContent>
        <div className="max-h-[90vh] overflow-scroll px-5">
          <Top />
          <GetToKnow />
          <HowToEarnXP />

          <div className="h-10"></div>
          <Buttons />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const Top = () => {
  return (
    <>
      <div className="aspect-square w-full relative">
        <Image src={IMAGES.create.fairy_gold} alt="fairy" fill />
      </div>

      <div className="mt-5 text-center text-green-400 text-[40px] font-bold leading-[56px]">
        EPIC Fairy
      </div>
      <div className="text-center text-slate-900 text-xl font-bold leading-7">
        Issued by EPIC
      </div>

      <div className="mt-6 flex gap-2 *:flex-1">
        <div className="w-[106px] min-h-[164px] relative bg-[#B8FFD3] p-2 rounded-xl">
          <div className="w-full aspect-square rounded-lg relative">
            <Image src={IMAGES.create.help[2]} alt="icon" fill />
          </div>

          <div className="mt-2">
            <div className="text-center text-green-600 text-sm font-semibold leading-tight tracking-tight">
              Share
            </div>
            <div className="text-center text-slate-900 text-2xl font-bold leading-9">
              GM
            </div>
          </div>
        </div>

        <div className="w-[106px] min-h-[164px] relative bg-[#B8FFD3] p-2 rounded-xl">
          <div className="w-full aspect-square rounded-lg relative">
            <Image src={IMAGES.create.help[3]} alt="icon" fill />
          </div>

          <div className="mt-2">
            <div className="text-center text-green-600 text-sm font-semibold leading-tight tracking-tight">
              Share
            </div>
            <div className="text-center text-slate-900 text-2xl font-bold leading-9">
              PNL
            </div>
          </div>
        </div>

        <div className="w-[106px] min-h-[164px] relative p-2 rounded-xl flex items-center flex-col justify-center">
          <Image fill src={IMAGES.create.help[1]} alt="icon" />

          <div className="relative">
            <div className="w-10 h-10 relative mx-auto">
              <Image fill src={IMAGES.create.help.timer} alt="icon" />
            </div>

            <div className="mt-3">
              <div className="text-center text-white text-sm font-semibold leading-tight tracking-tight">
                Reveal at
              </div>
              <div className="text-center text-blue-400 text-2xl font-bold leading-9">
                Level 3
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const GetToKnow = () => {
  const texts = [
    {
      elem: (
        <>
          <span>
            Create your own Telegram stickers with Epic Fairy and earn $EPIC
            points
          </span>
          <span role="img" aria-label="star">
            🌟
          </span>
        </>
      ),
    },
    {
      elem: (
        <>
          <span>
            Share stickers with Epic Fairy to gain XP and watch your fairy grow
          </span>
          <span role="img" aria-label="seedling">
            🌱
          </span>
        </>
      ),
    },
    {
      elem: (
        <>
          <span>
            The more you grow your Epic Fairy, the more stickers and effects you
            can create on Telegram, and the more $EPIC points you can collect
          </span>
          <span role="img" aria-label="chart increasing">
            📈
          </span>
        </>
      ),
    },
  ] as const;

  return (
    <div className="mt-6">
      <div className="w-[335px] text-slate-900 text-xl font-bold leading-7">
        Get to know
      </div>

      <div className="mt-2">
        <div className="text-slate-500 text-sm font-light leading-tight tracking-tight space-y-2">
          {texts.map((text, index) => (
            <div className="justify-start items-start inline-flex" key={index}>
              <div className="w-5 h-5 pl-[3.33px] pr-2.5 py-[6.67px] justify-start items-center flex">
                <div className="w-[6.67px] h-[6.67px] bg-slate-500 rounded-full" />
              </div>

              <div>{text.elem}</div>
            </div>
          ))}
        </div>
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
    <div className="mt-4">
      <div className="w-[335px] text-slate-900 text-xl font-bold leading-7">
        How to earn XP
      </div>
      <div className="mt-2 space-y-2">
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
    </div>
  );
};

const Buttons = () => {
  const { openLink } = useUtils();
  const [, setHelpDrawer] = useHelpDrawer();

  return (
    <div className="sticky bottom-0 flex flex-col gap-2 bg-white pb-3">
      <Button
        size="big"
        onClick={() => {
          openLink('https://getgems.io/');
        }}
      >
        <IconMarketplace />
        Go to marketplace
      </Button>
      <Button
        variant="secondary"
        size="big"
        onClick={() => {
          void setHelpDrawer(false);
        }}
      >
        Close
      </Button>
    </div>
  );
};
