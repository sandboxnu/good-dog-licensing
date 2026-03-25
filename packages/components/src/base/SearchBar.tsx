import NavLogo from "../svg/NavLogo";

export default function SearchBar({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-row px-2 gap-1 items-center w-full border-[0.5px] rounded-lg focus-within:ring-2 focus-within:ring-green-400">
      <NavLogo size={16} />
      <input
        className="flex-1 outline-none"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type to find a song, artist or genre"
      />
    </div>
  );
}
