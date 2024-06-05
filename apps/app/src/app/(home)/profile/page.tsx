"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Button,
  IconButton,
  Skeleton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { cn, formatTonAddress } from "@repo/utils";
import { toUserFriendlyAddress } from "@tonconnect/sdk";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Drawer as VauleDrawer } from "vaul";
import { z } from "zod";
import { updateInputNameSchema } from "../../../server/api/routers/auth/_shared/updateInputNameSchema";
import { api } from "../../../trpc/react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from "../_components/Drawer";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { useUser } from "../useUser";
import { IconMore } from "./IconMore";
import { IconSignOut } from "./IconSignOut";
import { IconEdit } from "./_icon/IconEdit";
import { IconPicture } from "./_icon/IconPicture";
import { useLogout } from "./useLogout";

const Page = () => {
  const { logout } = useLogout();
  const { data: user, tonProvider } = useUser();
  const { data: stats, isSuccess } = api.auth.getMyStats.useQuery();
  const { setEditProfileOpen } = useEditQueryState();

  const items = isSuccess
    ? [
        {
          title: "Shares",
          value: stats.totalShare,
        },
        {
          title: "Reactions",
          value: stats.totalReaction,
        },
        {
          title: "Minted",
          value: stats.totalMinted,
        },
      ]
    : [];

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
              <div className="h-3 w-3 rounded-full bg-[#DAF200]" />
              <div className="text-center text-sm font-medium leading-tight tracking-tight text-[#717D00]">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1"></div>

      <ProfileDrawer />

      <div className="mt-4">
        <Button onClick={logout} className="w-full bg-[#DAF200]" size="4">
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

export const ProfileDrawer = () => {
  const {
    editProfileOpen,
    setEditProfileOpen,
    setEditDisplayNameOpen,
    setEditPictureOpen,
  } = useEditQueryState();

  const items = [
    {
      icon: <IconEdit className="size-8" />,
      title: "Edit user name",
      onClick: () => {
        void setEditDisplayNameOpen(true);
      },
    },
    {
      icon: <IconPicture className="size-8" />,
      title: "Edit picture",
      onClick: () => {
        void setEditPictureOpen(true);
      },
    },
  ];

  return (
    <Drawer
      open={editProfileOpen}
      onOpenChange={(open) => {
        void setEditProfileOpen(open);
      }}
    >
      <DrawerContent>
        <div>
          {items.map((item) => (
            <button
              className="flex w-full cursor-pointer items-center justify-start gap-3 px-5 py-3 hover:bg-gray-100"
              key={item.title}
              onClick={item.onClick}
            >
              {item.icon}
              <div className="text-xl font-medium leading-7 text-slate-700">
                {item.title}
              </div>
            </button>
          ))}
        </div>

        <EditDisplayNameDrawer />

        <DrawerFooter>
          <Button
            radius="full"
            color="gray"
            variant="soft"
            size="4"
            className="bg-[#E5E7EC]"
            onClick={() => {
              void setEditProfileOpen(false);
            }}
          >
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const PageWrapper = () => {
  return (
    <LoggedUserOnly>
      <Page />
    </LoggedUserOnly>
  );
};

const useEditQueryState = () => {
  const [editProfileOpen, setEditProfileOpen] = useQueryState(
    "editProfileOpen",
    parseAsBoolean.withDefault(false),
  );
  const [editDisplayNameOpen, setEditDisplayNameOpen] = useQueryState(
    "editDisplayNameOpen",
    parseAsBoolean.withDefault(false),
  );
  const [editPictureOpen, setEditPictureOpen] = useQueryState(
    "editPictureOpen",
    parseAsBoolean.withDefault(false),
  );

  return {
    editProfileOpen,
    setEditProfileOpen,
    editDisplayNameOpen,
    setEditDisplayNameOpen,
    editPictureOpen,
    setEditPictureOpen,
  };
};

const EditDisplayNameDrawer = () => {
  const { editDisplayNameOpen, setEditDisplayNameOpen, setEditProfileOpen } =
    useEditQueryState();
  const { mutateAsync: updateDisplayName } =
    api.auth.updateDisplayName.useMutation();
  const form = useForm<z.infer<typeof updateInputNameSchema>>({
    resolver: zodResolver(updateInputNameSchema),
  });
  const { data: user } = useUser();

  useEffect(() => {
    if (user?.displayName) {
      form.reset({
        displayName: user.displayName,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.displayName]);
  const utils = api.useUtils();

  return (
    <VauleDrawer.NestedRoot
      open={editDisplayNameOpen}
      onOpenChange={(open) => {
        void setEditDisplayNameOpen(open);
      }}
    >
      <DrawerContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              await toast.promise(
                updateDisplayName({
                  displayName: data.displayName,
                }),
                {
                  loading: "Updating...",
                  success: "Updated",
                  error: "Failed to update",
                },
              );

              await utils.auth.getCurrentUser.invalidate();

              await setEditDisplayNameOpen(false);
              await setEditProfileOpen(false);
            })}
          >
            <DrawerTitle>Edit user name</DrawerTitle>

            <DrawerFooter>
              <Controller
                name="displayName"
                render={({ field, fieldState }) => (
                  <>
                    <TextField.Root
                      placeholder="Enter your name"
                      className={cn(
                        "h-[48px] rounded-lg px-4 py-3 text-base font-medium leading-normal tracking-tight text-slate-900 outline-[#DAF200]",
                        {
                          "outline-red-500 ring-1 ring-red-500":
                            fieldState.error,
                        },
                      )}
                      {...field}
                    >
                      <TextField.Slot side="right">
                        <div className="text-right text-base font-light leading-normal tracking-tight text-slate-500">
                          {field.value?.length ?? 0} / 20
                        </div>
                      </TextField.Slot>
                    </TextField.Root>

                    {fieldState.error && (
                      <Text color="red" size="2" className="mt-1">
                        {fieldState.error.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <div className="flex gap-2 *:flex-1">
                <Button
                  radius="large"
                  color="gray"
                  variant="soft"
                  size="4"
                  className="bg-[#E5E7EC]"
                  onClick={() => {
                    void setEditDisplayNameOpen(false);
                  }}
                  type="button"
                >
                  <div className="text-xl font-bold leading-7 text-slate-900">
                    Cancel
                  </div>
                </Button>
                <Button radius="large" size="4" type="submit">
                  <div className="text-xl font-bold leading-7 text-slate-900">
                    Save
                  </div>
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </FormProvider>
      </DrawerContent>
    </VauleDrawer.NestedRoot>
  );
};

export default PageWrapper;
