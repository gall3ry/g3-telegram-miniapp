"use client";
import { Avatar, DropdownMenu } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { api } from "../../../../trpc/react";
import { IMAGES } from "../../../_constants/image";
import { useIsAuthenticated } from "../../../_providers/useAuth";
import { IconPoints } from "../../_icons/IconPoints";

function UserMenu() {
  const { isAuthenticated } = useIsAuthenticated();
  const { data: user } = api.auth.getCurrentUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const router = useRouter();
  const posthog = usePostHog();

  return (
    user?.displayName && (
      <DropdownMenu.Root>
        <Link
          onMouseEnter={() => {
            router.prefetch("/profile");
          }}
          href="/profile"
          className="flex cursor-pointer items-center gap-3"
          onClick={() => {
            posthog.capture("profile_click", {
              user: user.displayName,
            });
          }}
        >
          <div className="flex items-center gap-3">
            <div className="5 flex items-center gap-1">
              <div className="size-6">
                <IconPoints />
              </div>

              <div className="text-right text-xl font-bold leading-7 text-slate-900">
                {user.point}
              </div>
            </div>
            <Avatar
              className="h-10 w-10 rounded-[40px] border-2 border-[#14DB60]"
              // src={user.avatarUrl ?? undefined}
              src={IMAGES.avatar}
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
  return (
    <div className="flex items-center gap-3">
      <UserMenu />
    </div>
  );
}
