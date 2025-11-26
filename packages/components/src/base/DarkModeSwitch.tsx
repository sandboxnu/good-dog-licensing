import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

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
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
            isDark 
              ? 'bg-gray-600' 
              : 'bg-gray-300'
          }`}
        >
          {/* Toggle circle with icon */}
          <span
            className={`absolute top-1 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
              isDark ? 'translate-x-8' : 'translate-x-1'
            }`}
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-blue-700" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-400" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}