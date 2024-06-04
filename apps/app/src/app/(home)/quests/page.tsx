"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TRPCClientError } from "@trpc/client";
import toast from "react-hot-toast";
import { QuestStatus } from "~/server/api/routers/quests/services/QuestStatus";
import { api } from "../../../trpc/react";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { CurrentPoint } from "./CurrentPoint";
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
