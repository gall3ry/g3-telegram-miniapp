"use client";
import { parseAsBoolean, useQueryState } from "nuqs";

export const useEditQueryState = () => {
  const [editProfileOpen, setEditProfileOpen] = useQueryState(
    "editProfileOpen",
    parseAsBoolean.withDefault(false),
  );
  const [editDisplayNameOpen, setEditDisplayNameOpen] = useQueryState(
    "editDisplayNameOpen",
    parseAsBoolean.withDefault(false),
  );
  const [editPictureList, setEditPictureList] = useQueryState(
    "editPictureList",
    parseAsBoolean.withDefault(false),
  );
  const [chooseFromLibrary, setChooseFromLibrary] = useQueryState(
    "chooseFromLibrary",
    parseAsBoolean.withDefault(false),
  );

  return {
    editProfileOpen,
    setEditProfileOpen,
    editDisplayNameOpen,
    setEditDisplayNameOpen,

    editPictureList,
    setEditPictureList,
    chooseFromLibrary,
    setChooseFromLibrary,
  };
};
