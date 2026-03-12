import type { Status } from "@good-dog/db";
import type { AdminProjectStatusDisplay } from "./statusDisplays";

export const AdminProjectStatusDisplaysMapper: Record<
  AdminProjectStatusDisplay,
  Status[]
> = {
  "Action needed": ["ACTION_NEEDED"],
  "In progress": ["IN_PROGRESS"],
  Matched: ["COMPLETED"],
};
