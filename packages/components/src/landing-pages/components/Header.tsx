"use client"
import { Search } from "lucide-react";
import SearchBar from "../../base/SearchBar";
import Button from "../../base/Button";
import MultiselectDropdown from "../../base/MultiselectDropdown";
import SingleDropdown from "../../base/SingleDropdown";
import { useRouter } from "next/navigation";
import SearchFilterForm from "./SearchFilterForm";


export default function Header({
  title,
  subtitle,
  requestPath,

}: {
  title: string;
  subtitle: string;
  requestPath: string;
}) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-row gap-[32px] justify-between">
      <div className="flex flex-col gap-[8px]">
        <h3>{title}</h3>
        <p className="text-body3">{subtitle}</p>
      </div>
      <div className="flex flex-row gap-[16px] items-center">
        <SearchFilterForm/>
        <Button onClick={() => router.push(requestPath)} size={"medium"} variant={"contained"} label={"Request"} displayIcon={"plus"}/>
      </div>
    </div>
  );
}
