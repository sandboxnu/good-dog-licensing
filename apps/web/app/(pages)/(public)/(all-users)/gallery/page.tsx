import GalleryPage from "@good-dog/components/gallery/GalleryPage";
import PageContainer from "@good-dog/components/PageContainer";
import { trpc } from "@good-dog/trpc/server";

const FEATURED_COUNT = 3;

export default async function Gallery() {
  const [user, projects] = await Promise.all([
    trpc.user(),
    trpc.galleryProjects(),
  ]);

  const featured = projects.slice(0, FEATURED_COUNT);

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
