import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminPagePermissions } from "@good-dog/auth/permissions";
import { env } from "@good-dog/env";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import {
  getPublicStorageUrl,
  getSupabaseAdminClient,
} from "../../utils/supabase";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const createGalleryImageUploadUrlProcedure =
  rolePermissionsProcedureBuilder(adminPagePermissions, "submit")
    .input(
      z.object({
        contentType: z.enum(Object.keys(EXTENSION_BY_MIME) as [string, ...string[]]),
        contentLength: z.number().int().positive().max(MAX_FILE_SIZE_BYTES),
      }),
    )
    .mutation(async ({ input }) => {
      const extension = EXTENSION_BY_MIME[input.contentType];
      const path = `${randomUUID()}.${extension}`;

      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase.storage
        .from(env.SUPABASE_GALLERY_STORAGE_BUCKET)
        .createSignedUploadUrl(path);

      if (error || !data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create signed upload URL: ${error?.message ?? "unknown error"}`,
        });
      }

      return {
        signedUrl: data.signedUrl,
        token: data.token,
        path: data.path,
        publicUrl: getPublicStorageUrl(data.path),
      };
    });
