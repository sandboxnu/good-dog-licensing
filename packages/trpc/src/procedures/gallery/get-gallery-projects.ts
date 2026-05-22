import { baseProcedureBuilder } from "../../internal/init";

export const getGalleryProjectsProcedure = baseProcedureBuilder.query(
  async ({ ctx }) => {
    return ctx.prisma.galleryProject.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
);
