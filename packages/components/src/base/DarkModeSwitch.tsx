import { useState } from "react";
import { Moon, Sun } from "lucide-react";

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
    } else {
      document.documentElement.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun className="text-yellow-400" />
      ) : (
        <Moon className="text-gray-800" />
      )}
    </button>
  );
}
