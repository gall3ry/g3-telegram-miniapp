import { cn } from '@g3-miniapp/utils';
import { IMAGES } from '@gall3ry/shared-constants';
import { Spinner } from '@radix-ui/themes';
import Image from 'next/image';
import { Suspense } from 'react';
import { LoggedUserOnly } from '../_components/LoggedUserOnly';
import { MintOCC } from './MintOcc';

const Page = () => {
  const items = [
    {
      name: 'GM',
      imageUrl: IMAGES.create.gm,
    },
    {
      name: 'PNL',
      imageUrl: IMAGES.create.pnl,
      isDisabled: true,
    },
    {
      name: 'IDCard',
      imageUrl: IMAGES.create.card,
      isDisabled: true,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2">
          {items.map((items, key) => {
            const { name, imageUrl, isDisabled } = items;

            return (
              <div
                className={cn(
                  'relative flex h-[106px] w-20 cursor-pointer flex-col items-center rounded-xl bg-green-400 p-1',
                  {
                    'cursor-not-allowed border border-slate-300 bg-gray-200':
                      isDisabled,
                  }
                )}
                key={key}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  className="rounded-lg"
                  src={imageUrl}
                  alt="Occ"
                  width={72}
                  height={72}
                />

                <div className="mt-0.5 text-center text-base font-bold leading-normal text-slate-900">
                  {name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MintOCC />
    </div>
  );
};

export default function PageWrapper() {
  return (
    <LoggedUserOnly>
      <Suspense fallback={<Spinner mx="auto" />}>
        <Page />
      </Suspense>
    </LoggedUserOnly>
  );
}
