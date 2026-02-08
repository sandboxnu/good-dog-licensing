"use client";

import type { FieldValues } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@good-dog/ui";
import { Button } from "@good-dog/ui/button";
import { Calendar } from "@good-dog/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@good-dog/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@good-dog/ui/popover";

import type { GoodDogFieldBaseProps } from "./types";

const format = (date: unknown) => {
  try {
    return new Date(date as string).toLocaleDateString("en-US", {});
  } catch {
    return "Unknown date";
  }
};

interface GoodDogDatePickerProps<T extends FieldValues>
  extends GoodDogFieldBaseProps<T> {
  disallowFutureDates?: boolean;
  disallowPastDates?: boolean;
}

export const GoodDogDatePicker = <T extends FieldValues>(
  props: GoodDogDatePickerProps<T>,
) => {
  const form = useFormContext<T>();

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-3">
          <FormLabel>{props.label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outlined"}
                  className={cn(
                    "bg-input-background w-[240px] pl-3 text-left text-lg font-normal md:text-sm",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? format(field.value) : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => {
                  const now = new Date();

                  return (
                    (!!props.disallowFutureDates && date > now) ||
                    (!!props.disallowPastDates && date < now) ||
                    date < new Date("1970-01-01T00:00:00Z")
                  );
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
