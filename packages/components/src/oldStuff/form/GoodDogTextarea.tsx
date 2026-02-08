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
import { Textarea } from "@good-dog/ui/textarea";

import type { GoodDogFieldBaseProps } from "./types";

interface GoodDogTextAreaProps<T extends FieldValues>
  extends GoodDogFieldBaseProps<T> {
  autoComplete?: ComponentProps<typeof Textarea>["autoComplete"];
}

export const GoodDogTextarea = <T extends FieldValues>(
  props: GoodDogTextAreaProps<T>,
) => {
  const form = useFormContext<T>();

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="text-2xl">{props.label}</FormLabel>
          <FormControl>
            <Textarea
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
