import NavLogo from "../svg/NavLogo";

export default function SearchBar({
  onChange,
  placeholder,
}: {
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex w-full flex-row items-center gap-1 rounded-lg border-[0.5px] border-dark-gray-100 bg-white px-2 focus-within:ring-2 focus-within:ring-green-400 dark:border-dark-gray-300 dark:bg-dark-gray-500">
      <NavLogo size={16} />
      <input
        className="flex-1 bg-white text-dark-gray-500 outline-none placeholder:text-dark-gray-100 dark:bg-dark-gray-500 dark:text-gray-300 dark:placeholder:text-dark-gray-200"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
