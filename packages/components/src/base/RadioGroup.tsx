import { Label } from "@good-dog/ui/label";
import {
  RadioGroupItem,
  RadioGroup as RadioGroupShad,
} from "@good-dog/ui/radio-group";

interface RadioGroupProps {
  options: {
    value: string;
    label: string;
  }[];
  htmlFor?: string;
  required: boolean;
}

export default function RadioGroup({ options, htmlFor }: RadioGroupProps) {
  return (
    <RadioGroupShad className="w-full flex flex-col gap-5 text-label-black">
      {options.map((option, index) => {
        return (
          <div key={index} className="w-full flex flex-row gap-2">
            <RadioGroupItem className="border-radio" value={option.value} />
            <Label htmlFor={htmlFor} className="!text-base-label">
              {option.label}
            </Label>
          </div>
        );
      })}
    </RadioGroupShad>
  );
}
