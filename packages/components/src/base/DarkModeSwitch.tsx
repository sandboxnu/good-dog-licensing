import { useState, useEffect } from "react";
import Button from "./Button";

export default function DarkModeSwitch() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  return (
    <Button
      size={"medium"}
      variant={"text"}
      label="Switch theme"
      onClick={toggleDarkMode}
    />
  );
}
