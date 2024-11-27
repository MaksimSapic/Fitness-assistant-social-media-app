import { palette } from "./colors";

export const lightTheme = {
    element: palette.light.element[500],
    text: palette.light.text[500],
    text_plain: palette.light.text_plain[500],
    interactable: palette.light.interactable[500],
    background: palette.light.background[500]
  };
  
  export const darkTheme = {
    element: palette.dark.element[500],
    text: palette.dark.text[500],
    text_plain: palette.dark.text_plain[500],
    interactable: palette.dark.interactable[500],
    // themeselection demonstration purposes
    background: palette.dark.background[800]
  };
  
  export type ThemeType = typeof lightTheme;