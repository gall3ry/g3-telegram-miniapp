'use client';
import Image from 'next/image';
import { useMemo } from 'react';
import { IMAGES } from '../../../../shared/constants/src';
import { cn } from '../../../utils/src';

export function TopSection() {
  const items = useMemo(
    () => [
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
    ],
    []
  );
  return (
    <div className="mb-4">
      <div className="flex items-center justify-center gap-2">
        {items.map((items, key) => {
          const { name, imageUrl, isDisabled } = items;
          return (
            <div
              className={cn(
                'relative flex h-[106px] w-20 cursor-pointer flex-col items-center rounded-xl bg-[#22F573] p-1',
                {
                  'cursor-not-allowed border border-slate-300 bg-gray-200':
                    isDisabled,
                }
              )}
              key={key}
            >
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
  );
}
