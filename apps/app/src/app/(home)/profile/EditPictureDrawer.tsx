"use client";
import { Button } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { Drawer as VauleDrawer } from "vaul";
import { DrawerContent, DrawerFooter } from "../_components/Drawer";
import { ChooseFromLibraryDrawer } from "./ChooseFromLibraryDrawer";
import { IconPicture } from "./_icon/IconPicture";
import { useEditQueryState } from "./useEditQueryState";

export const EditPictureDrawer = () => {
  const { editPictureList, setEditPictureList, setChooseFromLibrary } =
    useEditQueryState();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const items = useMemo(
    () => [
      {
        title: "Choose from library",
        icon: <IconPicture className="size-8" />,
        onClick: () => {
          // ask the user to choose a picture from the library
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.click();

          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            setPhotoFile(file);

            // open the ChooseFromLibraryDrawer
            void setChooseFromLibrary(true);
          };
        },
      },
    ],
    [setChooseFromLibrary],
  );

  return (
    <VauleDrawer.NestedRoot
      open={editPictureList}
      onOpenChange={(open) => {
        void setEditPictureList(open);
      }}
    >
      <DrawerContent>
        <div className="text-center text-base font-light leading-normal tracking-tight text-slate-500">
          Edit picture
        </div>

        <div className="mt-3">
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

        {photoFile && <ChooseFromLibraryDrawer photoFile={photoFile} />}

        <DrawerFooter>
          <Button
            radius="large"
            color="gray"
            variant="soft"
            size="4"
            className="bg-[#E5E7EC]"
            onClick={() => {
              void setEditPictureList(false);
            }}
          >
            <div className="text-xl font-bold leading-7 text-slate-900">
              Cancel
            </div>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </VauleDrawer.NestedRoot>
  );
};
