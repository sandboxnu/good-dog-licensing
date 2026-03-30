import NavLogo from "../svg/NavLogo";

export default function SearchBar({
  onChange,
  placeholder,
}: {
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-row px-2 gap-1 items-center w-full border-[0.5px] bg-white dark:bg-dark-gray-500 border-dark-gray-100 dark:border-dark-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-400">
      <NavLogo size={16} />
      <input
        className="flex-1 outline-none bg-white dark:bg-dark-gray-500 placeholder:text-dark-gray-100 dark:placeholder:text-dark-gray-200 text-dark-gray-500 dark:text-gray-300"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
