import { z } from "zod";

import { adminPagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

export const createGalleryProjectProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "submit",
)
  .input(
    z.object({
      projectName: z.string().min(1, "Project name is required"),
      mediaMakerName: z.string().min(1, "Media maker name is required"),
      description: z.string().min(1, "Description is required"),
      imageUrl: z.string().url("Image URL is required"),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.galleryProject.create({
      data: {
        projectName: input.projectName,
        mediaMakerName: input.mediaMakerName,
        description: input.description,
        imageUrl: input.imageUrl,
      },
    });
  });
