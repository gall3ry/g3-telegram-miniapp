"use client";
import { Avatar, Skeleton } from "@radix-ui/themes";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { api } from "../../../../trpc/react";
import styles from "./TemplateInfo.module.scss";
import { IconTime } from "./_components/IconTime";
import { IconUser } from "./_components/IconUser";

export const TemplateInfo = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: occ,
    isSuccess,
    isPending,
  } = api.occ.getOcc.useQuery(
    {
      id: parseInt(id),
    },
    {
      enabled: isFinite(parseInt(id)),
    },
  );

  const images = Array.from({ length: 5 }, (_, i) => i + 1).map(
    (v, index) => `https://api.dicebear.com/8.x/micah/svg?seed=${index}`,
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
              className="aspect-square w-full rounded-xl"
              src={image}
              alt="Template Image"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-4 text-center text-4xl font-bold leading-[44px] text-slate-900">
        #GM{id}
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5">
        <div className="size-5">
          <IconUser />
        </div>
        <div className="text-base font-light leading-normal tracking-tight text-slate-500">
          Created by:
        </div>
        <Avatar
          fallback={occ?.user.displayName ?? ""}
          alt="User"
          className="h-6 w-6 rounded"
          src={`https://api.dicebear.com/8.x/micah/svg?seed=${occ?.user.id}`}
        />

        <Skeleton loading={isPending} width="100px" height="20px">
          <div className="text-base font-medium leading-normal tracking-tight text-slate-700">
            {isSuccess && occ.user.displayName}
          </div>
        </Skeleton>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1.5">
        <div className="size-5">
          <IconTime />
        </div>
        <div className="text-base font-light leading-normal tracking-tight text-slate-500">
          Created on:
        </div>
        <Skeleton loading={isPending} width="100px" height="20px">
          <div className="text-base font-medium leading-normal tracking-tight text-slate-700">
            {/* May 30, 2024 */}
            {isSuccess && format(new Date(occ.createdAt), "MMM dd, yyyy")}
          </div>
        </Skeleton>
      </div>

      <div className="mt-5 text-center text-xl font-bold leading-7 text-slate-900">
        Achievements
      </div>

      <div className="mt-1 flex *:flex-1">
        <div className="flex flex-col items-center">
          <Skeleton loading={isPending} width="100px" height="44px">
            <div className="text-center text-4xl font-bold leading-[44px] text-slate-900">
              {isSuccess && Intl.NumberFormat().format(occ._count.Share)}
            </div>
          </Skeleton>

          <div className="flex h-5 items-center justify-start gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#DAF200]" />
            <div className="text-center text-sm font-medium leading-tight tracking-tight text-[#717D00]">
              Shares
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-center text-4xl font-bold leading-[44px] text-slate-900">
            {isSuccess && Intl.NumberFormat().format(occ.totalReaction)}
          </div>

          <div className="flex h-5 items-center justify-start gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#DAF200]" />
            <div className="text-center text-sm font-medium leading-tight tracking-tight text-[#717D00]">
              Reactions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
