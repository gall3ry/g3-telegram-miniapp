"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Spinner, Text, TextField } from "@radix-ui/themes";
import { cn } from "@repo/utils";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Drawer as VauleDrawer } from "vaul";
import { type z } from "zod";
import { updateInputNameSchema } from "../../../server/api/routers/auth/_shared/updateInputNameSchema";
import { api } from "../../../trpc/react";
import {
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from "../_components/Drawer";
import { useUser } from "../useUser";
import { useEditQueryState } from "./useEditQueryState";

export const EditDisplayNameDrawer = () => {
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

              form.reset();
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
                        "h-[48px] rounded-lg px-4 py-3 text-base font-medium leading-normal tracking-tight text-slate-900 outline-[#14DB60]",
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
                <Button
                  radius="large"
                  size="4"
                  type="submit"
                  disabled={!form.formState.isDirty}
                  loading={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && <Spinner />}
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
