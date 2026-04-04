import z from "zod";

export enum CREATED_DATE_QUERY {
  LAST_30_DAYS = "LAST_30_DAYS",
  LAST_90_DAYS = "LAST_90_DAYS",
  LAST_365_DAYS = "LAST_365_DAYS",
  ALL_TIME = "ALL_TIME",
}

export const zQueryProjectsRequest = z.object({
  createdDateQuery: z.enum(CREATED_DATE_QUERY),
  assignedToMe: z.boolean(),
});
