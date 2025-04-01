import type { NextConfig } from "next";

import { env } from "@good-dog/env";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
env;

const config: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
};

export default config;
