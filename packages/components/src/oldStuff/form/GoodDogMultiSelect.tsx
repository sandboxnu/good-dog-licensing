"use client";

import type React from "react";
import type { FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@good-dog/ui/form";
import { MultiSelect } from "@good-dog/ui/multi-select";

import type { GoodDogFieldBaseProps } from "./types";

interface Option {
  value: string;
  label: string;
}

interface GoodDogMultiSelectProps<T extends FieldValues>
  extends GoodDogFieldBaseProps<T> {
  options: Option[];
  placerholder?: string;
  maxCount?: number;
}

export const GoodDogMultiSelect = <T extends FieldValues>(
  props: GoodDogMultiSelectProps<T>,
) => {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-2xl">{props.label}</FormLabel>
          <FormControl>
            <MultiSelect
              className="bg-input-background"
              options={props.options}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder={props.placerholder}
              variant="inverted"
              animation={2}
              maxCount={props.maxCount}
            />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
