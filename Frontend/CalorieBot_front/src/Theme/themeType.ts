import { palette } from "./colors";

export const lightTheme = {
  element: palette.light.element[500],
  text: "#000000",
  text_plain: palette.light.text_plain[500],
  interactable: palette.light.interactable[500],
  background: palette.light.background[500],
  border: palette.light.border[500],
  icon: "#000000",
};

export const darkTheme = {
  element: palette.dark.element[500],
  text: "#ffffff",
  text_plain: palette.dark.text_plain[500],
  interactable: palette.dark.interactable[500],
  // themeselection demonstration purposes
  background: palette.dark.background[800],
  border: palette.light.border[500],
  icon: "#ffffff",
};

export type ThemeType = typeof lightTheme;
