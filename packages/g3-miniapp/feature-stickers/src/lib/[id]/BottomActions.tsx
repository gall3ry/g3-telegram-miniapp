'use client';
import { useWebAppSwitchInlineQuery } from '@gall3ry/g3-miniapp-telegram-miniapp-utils';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Button } from '@radix-ui/themes';
import { useParams, useRouter } from 'next/navigation';
import { useFooter } from 'packages/g3-miniapp/ui/src/lib/Footer/useFooter';
import { useEffect } from 'react';
import { FaTelegram } from 'react-icons/fa6';

export const BottomActions = () => {
  const { setFooter } = useFooter();
  useEffect(
    () => {
      setFooter(<Footer />);

      return () => {
        setFooter(null);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return null;
};

const Footer = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: sticker } = api.sticker.getSticker.useQuery(
    {
      id: +id,
    },
    {
      enabled: isFinite(+id),
    }
  );
  const { postSwitchInlineQuery } = useWebAppSwitchInlineQuery();

  return (
    <div className="sticky inset-x-0 bottom-0 z-50 flex h-20 items-center gap-3 bg-white px-5 shadow-2xl">
      <Button
        radius="large"
        variant="outline"
        size="4"
        onClick={() => {
          router.back();
        }}
      >
        Close
      </Button>

      <Button
        radius="large"
        size="4"
        className="flex-1"
        onClick={() => {
          if (!sticker) return;
          postSwitchInlineQuery({
            query: `${sticker.id}`,
            chatTypes: ['channels', 'groups', 'users'],
          });
        }}
      >
        <FaTelegram size="22px" />
        <div className="text-xl font-bold leading-7 text-slate-900">
          Share this Epic
        </div>
      </Button>
    </div>
  );
};
