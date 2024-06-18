'use client';
import { formatTonAddress } from '@g3-miniapp/utils';
import { IMAGES } from '@gall3ry/shared-constants';
import { Avatar, Button, IconButton, Skeleton } from '@radix-ui/themes';
import { toUserFriendlyAddress } from '@tonconnect/sdk';
import { memo, useMemo, useState } from 'react';
import { api } from '../../../trpc/react';
import { Drawer, DrawerContent, DrawerFooter } from '../_components/Drawer';
import { LoggedUserOnly } from '../_components/LoggedUserOnly';
import { useUser } from '../useUser';
import { IconMore } from './IconMore';
import { IconSignOut } from './IconSignOut';
import { ProfileDrawer } from './ProfileDrawer';
import { useEditQueryState } from './useEditQueryState';
import { useLogout } from './useLogout';

const Page = () => {
  const { data: user } = useUser();
  const { data: stats, isSuccess } = api.auth.getMyStats.useQuery();
  const { setEditProfileOpen } = useEditQueryState();
  const [signOutDrawerOpen, setSignOutDrawerOpen] = useState(false);

  const tonProvider = user?.tonProvider;

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
      <div className="flex h-[92px] items-center justify-between gap-4 rounded-xl bg-[#F0FFF5] p-4">
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

            <Skeleton loading={!tonProvider}>
              <div className="mt-0.5 text-sm font-medium leading-tight tracking-tight text-[#717D00]">
                {tonProvider?.value &&
                  formatTonAddress(toUserFriendlyAddress(tonProvider.value))}
              </div>
            </Skeleton>
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
        <Button
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
        </Button>
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

export default PageWrapper;
