import { Search } from "lucide-react";
import SearchBar from "../../base/SearchBar";
import Button from "../../base/Button";
import MultiselectDropdown from "../../base/MultiselectDropdown";
import SingleDropdown from "../../base/SingleDropdown";

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="w-full flex flex-row gap-[32px] justify-between">
      <div className="flex flex-col gap-[8px]">
        <h3>{title}</h3>
        <p className="text-caption">{subtitle}</p>
      </div>
      <Button size={"medium"} variant={"contained"} label={"Request"} displayIcon={"plus"}/>
      <SingleDropdown label={""} value={""} options={[]} onChange={function (newValue: string): void {
        throw new Error("Function not implemented.");
      } } placeholder={""} id={""}/>
    </div>
  );
}
