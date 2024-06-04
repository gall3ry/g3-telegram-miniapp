"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { IconButton } from "@radix-ui/themes";
import { TRPCClientError } from "@trpc/client";
import toast from "react-hot-toast";
import { QuestStatus } from "~/server/api/routers/quests/services/QuestStatus";
import { api } from "../../../trpc/react";
import { IMAGES } from "../../_constants/image";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { IconPoints } from "../_icons/IconPoints";
import { IconTime } from "./IconTime";
import { QuestItem } from "./QuestItem";

const Page = () => {
  const { data: items, isSuccess } = api.quests.getQuests.useQuery({
    type: QuestStatus.ALL,
  });
  const [parent] = useAutoAnimate();
  const utils = api.useUtils();
  const { mutateAsync: completeTask } = api.quests.completeTask.useMutation({
    onSuccess: () => {
      void utils.quests.getQuests.invalidate();
    },
  });

  return (
    <div>
      <CurrentPoint />

      <div className="mt-4 space-y-3" ref={parent}>
        {isSuccess &&
          items.map((item) => (
            <QuestItem
              key={item.id}
              title={item.title}
              description={item.description}
              points={item.points}
              text={item.text}
              isClaimable={item.isClaimable}
              onClick={() => {
                void toast.promise(completeTask({ taskId: item.id }), {
                  loading: "Completing task...",
                  success: "Task completed!",
                  error: (error) => {
                    if (error instanceof TRPCClientError) {
                      return error.message;
                    }
                    return "An error occurred";
                  },
                });
              }}
            />
          ))}
      </div>
    </div>
  );
};

function PageWrapper() {
  return (
    <LoggedUserOnly>
      <Page />
    </LoggedUserOnly>
  );
}

export default PageWrapper;

export const CurrentPoint = () => {
  return (
    <div
      className="relative rounded-xl bg-red-400 px-4 pb-[22px] pt-4"
      style={{
        backgroundImage: `url(${IMAGES.balance_bg})`,
        backgroundSize: "cover",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-base font-medium leading-normal tracking-tight text-white opacity-80">
          CURRENT POINTS
        </div>
        <IconButton
          variant="soft"
          radius="large"
          onClick={() => {
            toast("Coming soon!");
          }}
        >
          <div className="size-5">
            <IconTime />
          </div>
        </IconButton>
      </div>

      <div className="flex items-center">
        <div className="h-10 w-10">
          <IconPoints />
        </div>
        <div className="ml-4 text-5xl font-bold leading-[64px] text-white">
          6,789
        </div>
        <div className="mb-4 ml-3 text-right text-2xl font-medium leading-9 tracking-tight text-white opacity-80">
          EPIC
        </div>
      </div>
    </div>
  );
};
