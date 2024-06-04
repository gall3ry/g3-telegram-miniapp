"use client";
import { Avatar, Button, IconButton, Skeleton } from "@radix-ui/themes";
import { formatTonAddress } from "@repo/utils";
import { toUserFriendlyAddress } from "@tonconnect/sdk";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { useUser } from "../useUser";
import { IconMore } from "./IconMore";
import { useLogout } from "./useLogout";

const Page = () => {
  const { logout } = useLogout();
  const { data: user, tonProvider } = useUser();

  const items = [
    {
      title: "Shares",
      value: 40,
    },
    {
      title: "Reactions",
      value: 20,
    },
    {
      title: "Minted",
      value: 10,
    },
  ];

  return (
    <>
      <div className="flex h-[92px] items-center justify-between gap-4 rounded-xl bg-[#F8FFB7] p-4">
        <div className="flex items-center gap-4">
          {user?.displayName && (
            <Avatar
              fallback={user.displayName[0] ?? ""}
              className="h-[60px] w-[60px] rounded-xl"
              src={user?.avatarUrl ?? ""}
              alt=""
            />
          )}

          <div>
            <div className="text-2xl font-bold text-[#171B36]">
              {user?.displayName ?? "Loading..."}
            </div>

            <Skeleton loading={!tonProvider}>
              <div className="mt-0.5 text-sm font-medium leading-tight tracking-tight text-[#717D00]">
                {tonProvider?.value &&
                  formatTonAddress(toUserFriendlyAddress(tonProvider.value))}
              </div>
            </Skeleton>
          </div>
        </div>

        <IconButton className="size-8" variant="ghost">
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
              <div className="h-3 w-3 rounded-full bg-[#DAF200]" />
              <div className="text-center text-sm font-medium leading-tight tracking-tight text-[#717D00]">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1"></div>

      <div className="mt-4">
        <Button color="red" onClick={logout} className="w-full" size="4">
          Logout
        </Button>
      </div>
    </>
  );
};

const PageWrapper = () => {
  return (
    <LoggedUserOnly>
      <Page />
    </LoggedUserOnly>
  );
};

export default PageWrapper;
