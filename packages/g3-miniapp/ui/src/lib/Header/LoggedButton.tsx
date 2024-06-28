'use client';
import { formatNumber } from '@g3-miniapp/utils';
import { useUser } from '@gall3ry/g3-miniapp-authentication';
import { IconPoints } from '@gall3ry/g3-miniapp-icon';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { IMAGES } from '@gall3ry/shared-constants';
import { Avatar, DropdownMenu, Text } from '@radix-ui/themes';
import { useIsMutating } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

function UserMenu() {
  const { data: user } = useUser();
  const isMutating =
    useIsMutating({
      mutationKey: getQueryKey(api.auth.signIn),
    }) > 0;
  const router = useRouter();
  const posthog = usePostHog();

  return (
    <div>
      {isMutating ? (
        <Text size="2" color="gray">
          Logging in...
        </Text>
      ) : (
        user?.displayName && (
          <DropdownMenu.Root>
            <Link
              onMouseEnter={() => {
                router.prefetch('/profile');
              }}
              href="/profile"
              className="flex cursor-pointer items-center gap-3"
              onClick={() => {
                posthog.capture('profile_click', {
                  user: user.displayName,
                });
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div>
                    <div className="text-right text-slate-900 text-xl font-bold leading-7">
                      {user.displayName}
                    </div>
                    <div className="text-right text-slate-500 text-sm font-semibold leading-tight tracking-tight flex items-center justify-end">
                      <span className="w-3.5 h-3.5">
                        <IconPoints />
                      </span>
                      <span className="inline-block ml-[3px]">
                        {formatNumber(user.point)}
                      </span>
                    </div>
                  </div>
                </div>
                <Avatar
                  className="h-10 w-10 rounded-[40px] border-2 border-[#14DB60]"
                  // src={user.avatarUrl ?? undefined}
                  src={IMAGES.avatar}
                  fallback={user.displayName?.[0] ?? '?'}
                  alt="avatar"
                />
              </div>
            </Link>
          </DropdownMenu.Root>
        )
      )}
    </div>
  );
}

export function LoggedButton() {
  return (
    <div className="flex items-center gap-3">
      <UserMenu />
    </div>
  );
}
