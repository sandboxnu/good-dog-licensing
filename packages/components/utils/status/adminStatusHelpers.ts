import type { Status } from "@good-dog/db";

// Projects

// Update this enum if you want to add, remove, or rename project statuses for the admin dashboard
export enum ADMIN_PROJECT_STATUS_DISPLAY {
  ACTION_NEEDED = "Action Needed",
  IN_PROGRESS = "In Progress",
  MATCHED = "Matched",
}

export const ADMIN_PROJECT_STATUS_DISPLAY_TO_STATUS: Record<
  ADMIN_PROJECT_STATUS_DISPLAY,
  Status[]
> = {
  "Action Needed": ["ACTION_NEEDED"],
  "In Progress": ["IN_PROGRESS"],
  Matched: ["COMPLETED"],
};

export const ADMIN_PROJECT_STATUS_DISPLAY_TO_SUBTITLE: Record<
  ADMIN_PROJECT_STATUS_DISPLAY,
  string
> = {
  "Action Needed": "Projects that need attention",
  "In Progress": "Projects that are being worked on",
  Matched: "Matched projects",
};
