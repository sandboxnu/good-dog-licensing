# Web Package

This package contains all the web-related stuff for the project. We use a Next.js layout to organize the website structure.

## Table of Contents

- [`Web Package`](#web-package)
  - [`Table of Contents`](#table-of-contents)
  - [`Cron Jobs`](#cron-jobs)
    - [`Adding a new cron job`](#adding-a-new-cron-job)
    - [`Schedules on vercel`](#schedules-on-vercel)

## Cron Jobs

Every cron job is located in [`apps/web/app/api/cron/`](./app/api/cron/). Cronjobs will be authenticated using the [`CRON_SECRET`](Insert/location/here).

### Adding a new cron job

To create a new cron job, create a folder with the name of the cronjob located at `apps/web/app/api/cron/<name-of-job-here>/`. In that folder, create a file named `route.ts` and create the cronjob there. Every cronjob should check the header of the request to check for the `CRON_SECRET` before any operations are done.

### Schedules on vercel

Schedules are configured in `vercel.json` at the root of the project.

Cron jobs will run based on the schedule specified for each cron job. The schedule is organized as such:

```

┌───────── minute (0-59)
│ ┌───────── hour (0-23)
│ │ ┌───────── day of month (1-31)
│ │ │ ┌───────── month (1-12)
│ │ │ │ ┌───────── day of week (0-6, Sun=0)
│ │ │ │ │
0 0 * * * ---> minute 0, hour 0, every day, every month, every day of the week

0 0 */3 * * -> minute 0, hour 0, every 3rd day of the month, every month, every day of the week
```
