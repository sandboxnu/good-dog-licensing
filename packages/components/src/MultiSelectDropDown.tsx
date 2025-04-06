"use client";

import type React from "react";
import type { Control } from "react-hook-form";
import type { MultiValue } from "react-select";
import { Controller } from "react-hook-form";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  options: Option[];
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  name,
  control,
  options,
  placeholder = "Select options",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          className="w-full"
          ref={field.ref}
          options={options}
          isMulti
          instanceId="genre-select"
          placeholder={placeholder}
          value={options.filter((option) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            field.value?.includes(option.value),
          )}
          onChange={(newValue: MultiValue<Option>) => {
            const selectedValues = newValue.map((item) => item.value);
            field.onChange(selectedValues.join(", "));
          }}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          menuPosition="absolute"
          styles={{
            input: (provided) => ({
              ...provided,
              caretColor: "transparent",
            }),
            control: (provided) => ({
              ...provided,
              outline: "none",
              backgroundColor: "#E4E4E6",
              borderRadius: "12px",
              minHeight: "40px",
              borderColor: "#FFFFFF",
              ":hover": {
                borderColor: "#FFFFFF",
              },
            }),
            valueContainer: (provided) => ({
              ...provided,
              padding: "0 10px",
              maxWidth: "815px",
            }),
            placeholder: (provided) => ({
              ...provided,
              color: "#9ca3af",
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "12px",
              padding: "2px 5px",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "5px",
              marginBottom: "5px",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: "#000",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              color: "#03BC92",
              ":hover": {
                borderRadius: "8px",
                backgroundColor: "#F4392D",
                color: "#fff",
              },
            }),
            menu: (provided) => ({
              ...provided,
              position: "relative",
            }),
            menuList: (provided) => ({
              ...provided,
              color: "#000",
              maxHeight: "200px",
              overflowY: "auto",
              backgroundColor: "#E4E4E6",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? "#098465" : "#E4E4E6",
              color: state.isSelected ? "#fff" : "#000",
              cursor: "pointer",
              ":active": {
                backgroundColor: "#E4E4E6",
                color: "#000",
              },
            }),
          }}
        />
      )}
    />
  );
};

export default MultiSelectDropdown;
