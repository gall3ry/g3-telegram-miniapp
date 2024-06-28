'use client';
import { formatTonAddress } from '@g3-miniapp/utils';
import { LoggedUserOnly, useUser } from '@gall3ry/g3-miniapp-authentication';
import { env } from '@gall3ry/g3-miniapp-env';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Drawer, DrawerContent, DrawerFooter } from '@gall3ry/g3-miniapp-ui';
import { IMAGES } from '@gall3ry/shared-constants';
import { OccType } from '@gall3ry/types';
import { Avatar, Button, IconButton } from '@radix-ui/themes';
import { toUserFriendlyAddress } from '@tonconnect/sdk';
import { memo, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IconMore } from './_components/IconMore';
import { IconSignOut } from './_components/IconSignOut';
import { ProfileDrawer } from './_components/ProfileDrawer';
import { ResetAccount } from './_components/ResetAccount';
import { useEditQueryState } from './_components/useEditQueryState';
import { useLogout } from './_components/useLogout';
import { CurrentPoint } from './CurrentPoint';

const Page = () => {
  const { data: user, tonProvider } = useUser();
  const { data: stats, isSuccess } = api.auth.getMyStats.useQuery();
  const { setEditProfileOpen } = useEditQueryState();
  const [signOutDrawerOpen, setSignOutDrawerOpen] = useState(false);

  const items = useMemo(() => {
    return isSuccess
      ? [
          {
            title: 'Shares',
            value: Intl.NumberFormat().format(stats.totalShare),
          },
          {
            title: 'Reactions',
            value: Intl.NumberFormat().format(stats.totalReaction),
          },
          {
            title: 'Minted',
            value: Intl.NumberFormat().format(stats.totalMinted),
          },
        ]
      : [];
  }, [isSuccess, stats]);

  return (
    <>
      <div className="rounded-xl bg-[#F0FFF5] p-4">
        <div className="flex h-[92px] items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user?.displayName && (
              <Avatar
                fallback={user.displayName[0] ?? ''}
                className="h-[60px] w-[60px] rounded-xl"
                // src={user?.avatarUrl ?? ""}
                src={IMAGES.avatar}
                alt=""
              />
            )}

            <div>
              <div className="text-2xl font-bold text-[#171B36]">
                {user?.displayName ?? 'Loading...'}
              </div>

              {tonProvider?.value && (
                <div className="mt-0.5 text-sm font-medium leading-tight tracking-tight text-[#717D00]">
                  {formatTonAddress(toUserFriendlyAddress(tonProvider.value))}
                </div>
              )}
            </div>
          </div>

          <IconButton
            className="size-8"
            variant="ghost"
            onClick={() => {
              void setEditProfileOpen(true);
            }}
          >
            <IconMore />
          </IconButton>
        </div>

        <CurrentPoint />
      </div>

      <div className="mt-5">
        <div className="text-center text-xl font-bold leading-7 text-slate-900">
          Achievements
        </div>
      </div>

      <div className="mt-1 flex *:flex-1">
        {items.map((item) => (
          <div className="flex flex-col items-center" key={item.title}>
            <div className="w-28 text-center text-4xl font-bold leading-[44px] text-slate-900">
              {item.value}
            </div>

            <div className="inline-flex h-5 items-center justify-start gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#14DB60]" />
              <div className="text-center text-sm font-medium leading-tight tracking-tight text-[#717D00]">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1"></div>

      <ProfileDrawer />

      <SignOutDrawer
        open={signOutDrawerOpen}
        onOpenChange={setSignOutDrawerOpen}
      />

      <div className="mt-4">
        {env.NEXT_PUBLIC_G3_ENV !== 'production' && (
          <>
            <ResetAccount />

            <ManuallyEnterTransactionHash />
          </>
        )}

        {/* <Button
          onClick={() => {
            setSignOutDrawerOpen(true);
          }}
          className="w-full bg-[#14DB60]"
          size="4"
        >
          <div className="text-xl font-bold leading-7 text-slate-900">
            Sign out
          </div>
          <div className="size-5">
            <IconSignOut />
          </div>
        </Button> */}
      </div>
    </>
  );
};

const SignOutDrawer = memo(
  ({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => {
    const { logout } = useLogout();

    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="text-center text-2xl font-bold leading-9 text-slate-900">
            You are about to sign out
          </div>

          <DrawerFooter>
            <Button
              radius="full"
              size="4"
              onClick={() => {
                void logout();
              }}
            >
              <div className="text-xl font-bold leading-7 text-slate-900">
                Sign out
              </div>

              <div className="size-6">
                <IconSignOut />
              </div>
            </Button>

            <Button
              radius="full"
              color="gray"
              variant="soft"
              size="4"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              <div className="text-xl font-bold leading-7 text-slate-900">
                Cancel
              </div>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
);

SignOutDrawer.displayName = 'SignOutDrawer';

const PageWrapper = () => {
  return (
    <LoggedUserOnly>
      <Page />
    </LoggedUserOnly>
  );
};

export { PageWrapper as Page };

export const ManuallyEnterTransactionHash = () => {
  const { mutateAsync } = api.occ.createOCC.useMutation();
  const ref = useRef<HTMLInputElement>(null);

  // input and a butotn
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Enter transaction hash"
        className="w-full p-2 border border-gray-300 rounded-lg"
        ref={ref}
      />
      <Button
        variant="surface"
        size="3"
        className="w-full"
        color="red"
        onClick={() => {
          // send the transaction hash to the server

          // HQL4AiO+qfyOZNccS0ka9AP5IaDrof5pRjj8bhVhgbM=
          const hash = ref.current?.value;

          if (!hash) {
            return;
          }

          toast.promise(
            mutateAsync({
              txHash: hash,
              type: OccType.GMSymbolOCC,
            }),
            {
              loading: 'Creating OCC...',
              success: 'OCC created successfully',
              error: (e) => {
                console.error(e);

                return 'Failed to create OCC';
              },
            }
          );
        }}
      >
        Submit
      </Button>
    </div>
  );
};
