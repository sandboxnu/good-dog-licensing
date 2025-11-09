import z, { ZodString } from "zod";
import Search from "../svg/Search";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import TextInput from "./TextInput";
import RHFTextInput from "../rhf-base/RHFTextInput";
import { zSearchTermValues } from "@good-dog/trpc/schema";
import { useFormContext } from "react-hook-form";

type SearchTermFormFields = z.input<typeof zSearchTermValues>;

export default function SearchBar() {    

    return <div className="w-[214px]">
        <RHFTextInput<SearchTermFormFields>
            rhfName={"searchTerm"} 
            label={""} 
            placeholder={""} id={"1"} icon={<Search/>}/>
    </div>
}