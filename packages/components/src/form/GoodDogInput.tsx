"use client";

import type { ComponentProps } from "react";
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
import { Input } from "@good-dog/ui/input";

import type { GoodDogFieldBaseProps } from "./types";

interface GoodDogInputProps<T extends FieldValues>
  extends GoodDogFieldBaseProps<T> {
  autoComplete?: ComponentProps<typeof Input>["autoComplete"];
  type?: ComponentProps<typeof Input>["type"];
  autoCapitalize?: ComponentProps<typeof Input>["autoCapitalize"];
  autoCorrect?: ComponentProps<typeof Input>["autoCorrect"];
  spellCheck?: ComponentProps<typeof Input>["spellCheck"];
  maxLength?: ComponentProps<typeof Input>["maxLength"];
  minLength?: ComponentProps<typeof Input>["minLength"];
}

export const GoodDogInput = <T extends FieldValues>(
  props: GoodDogInputProps<T>,
) => {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-2xl">{props.label}</FormLabel>
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              value={field.value || ""}
              className="bg-input-background text-lg"
            />
          </FormControl>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
