import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { themeAtom } from "../store/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}