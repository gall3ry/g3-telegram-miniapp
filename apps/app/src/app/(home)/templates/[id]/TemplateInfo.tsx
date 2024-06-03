"use client";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./TemplateInfo.module.scss";

export const TemplateInfo = () => {
  const images = Array.from({ length: 5 }, (_, i) => i + 1).map(
    (v) => `https://picsum.photos/id/${v}/800/800`,
  );

  return (
    <div className={styles.swiper}>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        modules={[Navigation, Pagination, Mousewheel]}
        mousewheel={{
          enabled: true,
        }}
        pagination={{
          enabled: true,
          clickable: true,
          bulletElement: "div",
          bulletClass: "w-8 h-1.5 opacity-40 bg-white rounded cursor-pointer",
          bulletActiveClass: "!opacity-100",
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="rounded-xl bg-neutral-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="aspect-square rounded-xl"
              src={image}
              alt="Template Image"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-4 text-center text-4xl font-bold leading-[44px] text-slate-900">
        GM!
      </div>

      <div className="mt-2">
        <div className="text-center text-sm font-light leading-tight tracking-tight text-slate-700">
          Create unlimited GM with your TON assets.
          <br />
          Mint and unlock GM Epic Template. Epic template description and
          instruction details goes here.
        </div>
      </div>

      <div className="mt-4">
        <div className="text-center text-xl font-bold leading-7 text-slate-900">
          Create a GM with my asset:
        </div>

        <div className="mt-2">
          <div className="text-center text-sm font-light leading-tight tracking-tight text-slate-700">
            Mint and say GM! with your assets
          </div>
        </div>
      </div>

      <div className="mt-4">
        <img src="https://i.imgur.com/BsrevFO.png" alt="TON Crystal" />
      </div>
    </div>
  );
};
