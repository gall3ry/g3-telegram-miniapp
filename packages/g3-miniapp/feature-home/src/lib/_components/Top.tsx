import { IMAGES } from '@gall3ry/shared-constants';
import Image from 'next/image';
import { IconPoints } from '../_icons/IconPoints';
import { TopSwiper } from './TopSwiper';

export const Top = () => {
  return (
    <div>
      <section className="relative">
        <div
          className="aspect-[375/411] absolute w-full top-0 left-0 bg-cover"
          style={{
            backgroundImage: `url(${IMAGES.home.home_bg})`,
          }}
        ></div>

        <div className="relative">
          <div className="text-center text-slate-900 text-xl font-medium leading-7">
            Join GM challenge!
          </div>

          <div className="mt-1">
            <div className="h-11 justify-center items-center gap-2 flex">
              <div className="text-center text-slate-900 text-[32px] font-bold leading-[44px]">
                Send GM stickers
              </div>

              <div className="justify-start items-center flex">
                <Image
                  width={40}
                  height={40}
                  className="rounded-[48px] border border-green-400"
                  src={IMAGES.MOCK_AVATAR[1]}
                  alt="placeholder"
                />
                <Image
                  width={40}
                  height={40}
                  className="rounded-[40px] border border-green-400 -ml-4"
                  src={IMAGES.MOCK_AVATAR[2]}
                  alt="placeholder"
                />
              </div>
            </div>

            <div className="h-11 justify-center items-center gap-2 flex">
              <div className="w-9 h-9 relative">
                <IconPoints />
              </div>
              <div className="text-center text-slate-900 text-[32px] font-bold leading-[44px]">
                Get $EPIC
              </div>
            </div>
          </div>

          <div className="flex justify-evenly items-center mt-[18px]">
            <div className="flex justify-center items-center gap-[7px]">
              <div
                className="h-7 bg-gradient-to-r from-green-300 to-green-500 rounded-lg flex justify-center items-center px-1.5"
                style={{
                  background:
                    'linear-gradient(100deg, #87FFB5 0%, #14DB60 100%)',
                }}
              >
                <div className="text-center text-slate-900 text-base font-bold leading-normal">
                  10 EPIC
                </div>
              </div>

              <div className="text-slate-900 text-base font-medium leading-normal tracking-tight">
                Creator
              </div>
            </div>

            <div className="w-3 h-3 bg-green-500 rounded-full" />

            <div className="flex justify-center items-center gap-[7px]">
              <div className="h-7 bg-slate-900 rounded-lg px-[6px] items-center flex">
                <div className="text-center text-green-400 text-base font-bold leading-normal">
                  10 EPIC
                </div>
              </div>
              <div className="text-slate-900 text-base font-medium leading-normal tracking-tight">
                Sharer
              </div>
            </div>
          </div>

          <TopSwiper />
        </div>
      </section>

      <div className="mt-6">
        <div className="text-center text-xl font-bold leading-7 text-slate-900">
          Hall of EPICs
        </div>
      </div>

      <div className="my-4">
        <div className="relative h-[120px] rounded-xl bg-[#87FFB5] px-5 py-2.5">
          <div className="text-4xl font-bold leading-[44px] text-slate-900">
            1,000 $TON
          </div>
          <div className="text-base font-medium leading-normal tracking-tight text-slate-900">
            FOR THE CHAMPIONS
          </div>
          <div className="inline-flex items-center justify-start gap-1.5">
            <div className="h-2 w-2 rounded-full bg-lime-700" />
            <div className="text-xs font-medium leading-[18px] tracking-tight text-[#005320]">
              The leaders take it all
            </div>
          </div>

          <Image
            src={IMAGES.banner_right_image}
            alt="banner_right_image"
            width={117}
            height={106}
            className="absolute bottom-1.5 right-[14px]"
          />
        </div>
      </div>
    </div>
  );
};

Top.displayName = 'Top';
