"use client";
import { Avatar, Button, Skeleton } from "@radix-ui/themes";
import { format } from "date-fns";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useParams } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { api } from "../../../../trpc/react";
import { Drawer, DrawerContent, DrawerFooter } from "../../_components/Drawer";
import { TestOccTemplate } from "../../rive/TestOccTemplate";
import styles from "./TemplateInfo.module.scss";
import { IconTime } from "./_components/IconTime";
import { IconUser } from "./_components/IconUser";

export const TemplateInfo = () => {
  const [shouldRecord] = useQueryState(
    "record",
    parseAsBoolean.withDefault(false),
  );
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
  const [reactionOpen, setReactionOpen] = useQueryState(
    "reactionOpen",
    parseAsBoolean.withDefault(false),
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
            {/* <img
              className="aspect-square w-full rounded-xl"
              src={image}
              alt="Template Image"
            /> */}
            <TestOccTemplate shouldRecord={shouldRecord} />
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
          fallback={occ?.Provider.User.displayName?.[0] ?? "?"}
          alt="User"
          className="h-6 w-6 rounded"
          src={occ?.Provider.User.avatarUrl ?? undefined}
        />

        <Skeleton loading={isPending} width="100px" height="20px">
          <div className="text-base font-medium leading-normal tracking-tight text-slate-700">
            {isSuccess && occ.Provider.User.displayName}
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

      <div className="mt-5 flex justify-between">
        <div className="text-center text-xl font-bold leading-7 text-slate-900">
          Achievements
        </div>
        <Button
          className="text-right text-base font-medium leading-normal tracking-tight text-blue-500"
          variant="ghost"
          color="blue"
          onClick={() => {
            void setReactionOpen(true);
          }}
        >
          View details
        </Button>
      </div>

      <Drawer open={reactionOpen} onOpenChange={setReactionOpen}>
        <DrawerContent>
          <DrawerFooter>
            <div className="text-center text-2xl font-bold leading-9 text-slate-900">
              Reactions received
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center justify-items-center gap-2">
              {isSuccess &&
                occ.reactions.map((reaction) => (
                  <div
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[32px] bg-slate-100 px-4 pb-[7px] pt-[5px]"
                    key={reaction.unifiedCode}
                  >
                    <div className="text-center text-xl font-medium leading-7 text-slate-900">
                      <Emoji
                        unified={reaction.unifiedCode}
                        size={20}
                        emojiStyle={EmojiStyle.APPLE}
                      />
                    </div>
                    <div className="text-center text-xl font-medium leading-7 text-slate-900">
                      {reaction._count.count}
                    </div>
                  </div>
                ))}
            </div>

            <Button
              mt="32px"
              radius="full"
              color="gray"
              variant="soft"
              size="4"
              className="bg-[#E5E7EC]"
              onClick={() => {
                void setReactionOpen(false);
              }}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="mt-1 flex *:flex-1">
        <div className="flex flex-col items-center">
          <Skeleton loading={isPending} width="100px" height="44px">
            <div className="text-center text-4xl font-bold leading-[44px] text-slate-900">
              {isSuccess && Intl.NumberFormat().format(occ.totalShare)}
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
