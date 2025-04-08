"use client";

import type React from "react";
import type { FieldValues } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

import type { GoodDogFieldBaseProps } from "./types";

interface Option {
  value: string;
  label: string;
}

interface GoodDogMultiSelectProps<T extends FieldValues>
  extends GoodDogFieldBaseProps<T> {
  uniqueKey: string;
  options: Option[];
}

export const GoodDogMultiSelect = <T extends FieldValues>(
  props: GoodDogMultiSelectProps<T>,
) => {
  const form = useFormContext<T>();
  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field }) => (
        <Select
          className="w-full"
          ref={field.ref}
          options={props.options}
          isMulti
          instanceId={props.uniqueKey}
          placeholder={props.placeholder}
          value={props.options.filter((option) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            field.value?.includes(option.value),
          )}
          onChange={field.onChange}
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
