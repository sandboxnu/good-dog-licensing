import { useState } from "react";

import DarkModeOnToggle from "../svg/nav/DarkModeOnToggle";
import DarkModeOffToggle from "../svg/nav/DarkModeOffToggle";

export default function DarkModeSwitch() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : false, // or true, depending on your default preference
  );

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
    setIsDark(!isDark);
  };

  return (
    <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
      {isDark ? <DarkModeOnToggle /> : <DarkModeOffToggle />}
    </button>
  );
}
