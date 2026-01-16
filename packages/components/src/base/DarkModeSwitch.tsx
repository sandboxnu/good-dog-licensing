import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeSwitch() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

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
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
