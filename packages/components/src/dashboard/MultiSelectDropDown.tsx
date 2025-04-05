"use client";

import type React from "react";
import type { Control } from "react-hook-form";
import type { ActionMeta, MultiValue } from "react-select";
import { Controller } from "react-hook-form";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  name: string;
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
            placeholder={placeholder}
            value={options.filter((option) =>
              field.value?.includes(option.value),
            )}
            onChange={(
              newValue: MultiValue<Option>,
              actionMeta: ActionMeta<Option>,
            ) => {
              const selectedValues = newValue.map((item) => item.value);
              field.onChange(selectedValues.join(", "));
            }}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            menuPosition="absolute"
            styles={{
                input: (provided) => ({
                    ...provided,
                    caretColor: "transparent", // Cursor color
                }),
              control: (provided) => ({
                ...provided,
                outline: "none", // Remove default outline
                backgroundColor: "#E4E4E6", // Background color of the input box
                borderRadius: "12px", // Rounded corners
                minHeight: "40px", // Height of the input box
                borderColor: "#FFFFFF",
                ':hover': {
                  borderColor: "#FFFFFF", // Border color on hover
                },
              }),
              valueContainer: (provided) => ({
                ...provided,
                padding: "0 10px", // Padding for the selected value
              }),
              placeholder: (provided) => ({
                ...provided,    
                color: "#9ca3af", // Placeholder text color
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: "#fff", // Background color of selected tags
                color: "#000", // Text color of selected tags
                borderRadius: "12px", // Rounded corners for tags
                padding: "2px 5px", // Padding inside tags
                marginLeft: "10px", // Margin between tags
                marginRight: "10px", // Margin between tags
                marginTop: "5px", // Margin above tags
                marginBottom: "5px", // Margin below tags
              }),
              multiValueLabel: (provided) => ({
                ...provided,
                color: "#000", // Text color of the tag label
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                color: "#03BC92", // Color of the "x" button
                ':hover': {
                    borderRadius: "8px", // Rounded corners on hover
                  backgroundColor: "#F4392D", // Background color on hover
                  color: "#fff", // Text color on hover
                },
              }),
              menu: (provided) => ({
                ...provided,
                position: "relative"
              }),
              menuList: (provided) => ({
                ...provided,
                color: "#000", // Text color of the dropdown options
                maxHeight: "200px", // Maximum height of the dropdown menu
                overflowY: "auto", // Enable vertical scrolling
                backgroundColor: "#E4E4E6", // Background color of the dropdown menu
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#098465" : "#E4E4E6", // Background color of options
                color: state.isSelected ? "#fff" : "#000", // Text color of options
                cursor: "pointer", // Cursor style on hover
                ':active': {
                  backgroundColor: "#E4E4E6", // Background color on click
                  color: "#000", // Text color on click
                },
              }),
            }}
          />
        )}
      />
    );
  };
  
  export default MultiSelectDropdown;