import GalleryPage from "@good-dog/components/gallery/GalleryPage";
import PageContainer from "@good-dog/components/PageContainer";
import type { GalleryProject } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/server";

const MOCK_PROJECTS: GalleryProject[] = Array.from({ length: 12 }).map(
  (_, i) => ({
    galleryProjectId: `mock-${i}`,
    projectName: "Name",
    mediaMakerName: "Media Maker",
    imageUrl: "/images/sandbox.png",
    description: "test description test description test description test description test description test description ",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
);

export default async function Gallery() {
  const user = await trpc.user();

  const featured = MOCK_PROJECTS.slice(0, 3);
  const projects = MOCK_PROJECTS.slice(3);

  return (
    <PageContainer background="solid" widthType="large">
      <GalleryPage
        isAdmin={user != null && user.role === "ADMIN"}
        featured={featured}
        projects={projects}
      />
    </PageContainer>
  );
}
