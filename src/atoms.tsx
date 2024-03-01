import { atom } from "recoil";

export const isModal = atom({
  key: "isModal",
  default: false,
});

export const isEdit = atom({
  key: "isEdit",
  default: false,
});
