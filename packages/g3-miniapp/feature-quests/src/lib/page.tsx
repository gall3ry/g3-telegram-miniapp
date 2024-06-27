'use client';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { LoggedUserOnly } from '@gall3ry/g3-miniapp-authentication';
import { CurrentPoint } from '@gall3ry/g3-miniapp-feature-profile';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Button } from '@gall3ry/g3-miniapp-ui';
import { QuestId, QuestStatus } from '@gall3ry/types';
import { Spinner } from '@radix-ui/themes';
import { TRPCClientError } from '@trpc/client';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { AllQuestsCompleted } from './AllQuestsCompleted';
import { QuestItem } from './QuestItem';

type NonNullable<T> = Exclude<T, null | undefined>;

enum Tab {
  DAILY = 'daily',
  BASIC = 'basic',
}

const Page = () => {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringEnum<Tab>(Object.values(Tab)).withDefault(Tab.DAILY)
  );
  return (
    <div>
      <CurrentPoint />

      <div className="flex mt-6">
        <Button
          rounded="big"
          onClick={() => setTab(Tab.DAILY)}
          variant={tab === Tab.DAILY ? 'primary' : 'outline'}
        >
          Daily quest
        </Button>
        <Button
          rounded="big"
          className="ml-2"
          onClick={() => setTab(Tab.BASIC)}
          variant={tab === Tab.BASIC ? 'primary' : 'outline'}
        >
          Basic quest
        </Button>
      </div>

      {tab === Tab.DAILY ? <DailyQuests /> : <BasicQuests />}
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

export { PageWrapper as Page };

const BasicQuests = () => {
  const {
    data: items,
    isSuccess,
    isPending,
  } = api.quests.getQuests.useQuery(
    {
      type: QuestStatus.INCOMPLETE,
    },
    {
      refetchOnWindowFocus: true,
    }
  );
  const { data: completedQuests, isSuccess: isCompletedQuestsSuccess } =
    api.quests.getQuests.useQuery(
      {
        type: QuestStatus.COMPLETED,
      },
      {
        refetchOnWindowFocus: true,
      }
    );
  const [parent] = useAutoAnimate();
  const [parent2] = useAutoAnimate();
  const utils = api.useUtils();
  const { mutateAsync: completeTask } = api.quests.completeTask.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.quests.getQuests.invalidate(),
        utils.auth.getCurrentUser.invalidate(),
      ]);
    },
  });

  const renderItem = useCallback(
    (item: NonNullable<typeof items>[number]) => {
      switch (item.id) {
        case QuestId.JOIN_COMMUNITY: {
          const { success, data } = z
            .object({ chatId: z.string() })
            .safeParse(item.metadata);

          if (!success) {
            console.error('Invalid metadata', item.metadata);
            return null;
          }

          const { chatId } = data;

          return (
            <QuestItem
              key={item.id}
              title={item.title}
              description={item.description}
              points={item.points}
              text={item.text}
              isClaimable={!item.isClaimed && item.isFinishedQuest}
              disabled={item.isClaimed}
              onClick={() => {
                if (!item.isFinishedQuest) {
                  const a = document.createElement('a');
                  // Telegram
                  a.href = `tg://resolve?domain=${chatId}`;
                  a.click();

                  return;
                }

                void toast.promise(completeTask({ taskId: item.id }), {
                  loading: 'Completing task...',
                  success: 'Task completed!',
                  error: (error) => {
                    if (error instanceof TRPCClientError) {
                      return error.message;
                    }
                    return 'An error occurred';
                  },
                });
              }}
              isCompleted={item.isClaimed}
            />
          );
        }

        case QuestId.MINT_GM_EPIC_QUEST: {
          return (
            <QuestItem
              key={item.id}
              title={item.title}
              description={item.description}
              points={item.points}
              text={item.text}
              isClaimable={!item.isClaimed && item.isFinishedQuest}
              disabled={item.isClaimed}
              onClick={async () => {
                if (!item.isFinishedQuest) {
                  const a = document.createElement('a');
                  a.href = '/create';
                  a.click();

                  return;
                }

                void toast.promise(completeTask({ taskId: item.id }), {
                  loading: 'Completing task...',
                  success: 'Task completed!',
                  error: (error) => {
                    if (error instanceof TRPCClientError) {
                      return error.message;
                    }
                    return 'An error occurred';
                  },
                });
              }}
              isCompleted={item.isClaimed}
            />
          );
        }

        default:
          return (
            <QuestItem
              key={item.id}
              title={item.title}
              description={item.description}
              points={item.points}
              text={item.text}
              isClaimable={item.isFinishedQuest && !item.isClaimed}
              disabled={item.isClaimed || !item.isFinishedQuest}
              onClick={() => {
                void toast.promise(completeTask({ taskId: item.id }), {
                  loading: 'Completing task...',
                  success: 'Task completed!',
                  error: (error) => {
                    if (error instanceof TRPCClientError) {
                      return error.message;
                    }
                    return 'An error occurred';
                  },
                });
              }}
              isCompleted={item.isClaimed}
            />
          );
      }
    },
    [completeTask]
  );
  return (
    <>
      <div className="mt-6 space-y-3" ref={parent}>
        <div className="text-xl font-bold leading-7 text-slate-900">
          Incomplete quests
        </div>

        <Spinner loading={isPending} size="3" className="mx-auto mt-8">
          {isSuccess && items.length === 0 ? (
            <AllQuestsCompleted />
          ) : (
            items?.map((item) => renderItem(item))
          )}
        </Spinner>
      </div>

      <div className="mt-6 space-y-3" ref={parent2}>
        <div className="text-xl font-bold leading-7 text-slate-900">
          Completed quests
        </div>

        <Spinner loading={!isCompletedQuestsSuccess} size="3" className="mt-8">
          {isCompletedQuestsSuccess && completedQuests.map(renderItem)}
        </Spinner>
      </div>
    </>
  );
};

const DailyQuests = () => {
  const utils = api.useUtils();
  const [data] = api.dailyQuest.getDailyQuestsInfo.useSuspenseQuery();
  const { mutateAsync: completeDailyLogin, isPending: isCompletingDailyLogin } =
    api.dailyQuest.completeDailyLogin.useMutation({
      onSuccess: async () => {
        await utils.dailyQuest.getDailyQuestsInfo.invalidate();
        await utils.auth.getCurrentUser.invalidate();
      },
    });
  const { mutateAsync: completeDailyShare, isPending: isCompletingDailyShare } =
    api.dailyQuest.completeDailyShare.useMutation({
      onSuccess: async () => {
        await utils.dailyQuest.getDailyQuestsInfo.invalidate();
        await utils.auth.getCurrentUser.invalidate();
      },
    });

  const [todayShare] = api.dailyQuest.getTodayShare.useSuspenseQuery(
    undefined,
    {
      initialData: {
        dailyShareCount: 0,
      },
    }
  );

  return (
    <div>
      <div className="bg-red-400 p-2">
        Today share: {todayShare.dailyShareCount}
      </div>

      {data.map((quest) => {
        const { isPassed, isClaimed, point, type } = quest;

        return (
          <div key={type} className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold leading-7 text-slate-900">
                {type}
              </div>
              <div className="text-sm leading-5 text-slate-500">{type}</div>
            </div>
            <div className="flex items-center">
              <div className="text-lg font-bold leading-7 text-slate-900">
                {point}
              </div>
              <Button
                rounded="big"
                className="ml-2"
                disabled={isClaimed}
                isLoading={isCompletingDailyLogin || isCompletingDailyShare}
                onClick={() => {
                  const func = async () => {
                    switch (type) {
                      case 'DAILY_LOGIN':
                        return completeDailyLogin();
                      case 'DAILY_SHARE_LEVEL_1':
                      case 'DAILY_SHARE_LEVEL_2':
                      case 'DAILY_SHARE_LEVEL_3':
                      case 'DAILY_SHARE_LEVEL_4':
                      case 'DAILY_SHARE_LEVEL_5':
                      case 'DAILY_SHARE_LEVEL_6':
                      default:
                        return completeDailyShare({
                          type,
                        });
                    }
                  };

                  toast.promise(func(), {
                    loading: 'Completing task...',
                    success: 'Task completed!',
                    error: (error) => {
                      if (error instanceof TRPCClientError) {
                        return error.message;
                      }
                      return 'An error occurred';
                    },
                  });
                }}
              >
                {isClaimed ? 'Claimed' : 'Claim'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
