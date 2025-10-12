import type { z } from "zod";

import type { zProjectSubmissionValues } from "@good-dog/trpc/schema";

import { GoodDogDatePicker, GoodDogInput, GoodDogTextarea } from "../../form";

export type ProjectSubmissionFieldValues = z.input<
  typeof zProjectSubmissionValues
>;

export const ProjectSubmissionInput =
  GoodDogInput<ProjectSubmissionFieldValues>;

export const ProjectSubmissionTextarea =
  GoodDogTextarea<ProjectSubmissionFieldValues>;

export const ProjectSubmissionDatePicker =
  GoodDogDatePicker<ProjectSubmissionFieldValues>;
