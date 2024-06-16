"use client";
import { Button } from "@radix-ui/themes";
import { Drawer, DrawerContent, DrawerFooter } from "../_components/Drawer";
import { EditDisplayNameDrawer } from "./EditDisplayNameDrawer";
import { IconEdit } from "./_icon/IconEdit";
import { useEditQueryState } from "./useEditQueryState";

export const ProfileDrawer = () => {
  const {
    editProfileOpen,
    setEditProfileOpen,
    setEditDisplayNameOpen,
    // setEditPictureList,
  } = useEditQueryState();

  const items = [
    {
      icon: <IconEdit className="size-8" />,
      title: "Edit user name",
      onClick: () => {
        void setEditDisplayNameOpen(true);
      },
    },
    // {
    //   icon: <IconPicture className="size-8" />,
    //   title: "Edit picture",
    //   onClick: () => {
    //     void setEditPictureList(true);
    //   },
    // },
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
        {/* <EditPictureDrawer /> */}

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
