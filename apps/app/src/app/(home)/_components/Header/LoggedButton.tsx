"use client";
import { Avatar, DropdownMenu } from "@radix-ui/themes";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { z } from "zod";
import { api } from "../../../../trpc/react";
import { useIsAuthenticated } from "../../../_providers/useAuth";

const pointSchema = z.number().nonnegative();

function UserMenu() {
  const { isAuthenticated } = useIsAuthenticated();
  const { data: user } = api.auth.getCurrentUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const posthog = usePostHog();

  return (
    user?.displayName && (
      <DropdownMenu.Root>
        <Link
          href="/profile"
          className="flex cursor-pointer items-center gap-3"
          onClick={() => {
            posthog.capture("profile_click", {
              user: user.displayName,
            });
          }}
        >
          <div className="flex items-center gap-3">
            <div className="text-right text-xl font-bold text-slate-900">
              {user.displayName}
            </div>
            <Avatar
              className="h-10 w-10 rounded-[40px] border-2 border-[#DAF200]"
              src={user.avatarUrl ?? undefined}
              fallback={user.displayName?.[0] ?? "?"}
              alt="avatar"
            />
          </div>
        </Link>
      </DropdownMenu.Root>
    )
  );
}

export function LoggedButton() {
  const { isAuthenticated } = useIsAuthenticated();
  const { data } = api.auth.getCurrentUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { success, data: point } = pointSchema.safeParse(data?.point);

  return (
    <div className="flex items-center gap-3">
      {/* <div className="flex items-center gap-1.5">
        <div className="size-6">
          <IconPoints />
        </div>

        <Skeleton loading={!success} width="40" height="20">
          <div className="text-right text-xl font-bold leading-7 text-slate-900">
            {success && Intl.NumberFormat("en-US").format(point)}
          </div>
        </Skeleton>
      </div> */}

      <UserMenu />
    </div>
  );
}
