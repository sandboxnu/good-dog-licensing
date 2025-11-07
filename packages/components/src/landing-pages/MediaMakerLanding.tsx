import { trpc } from "@good-dog/trpc/client";
import { songRequestProcedure } from "../../../trpc/src/procedures/get-song-requests";
import Card from "../base/Card";
import StatusIndicator from "../base/StatusIndicator";
import Header from "./components/Header";

export default function MediaMakerLanding() {
  const [data] = trpc.mediamakerProjects.useSuspenseQuery();

  return (
    <div className="flex flex-col gap-[32px] align-start w-full">
      <Header
        title={"Project Requests"}
        subtitle={"This is where you view and manage your project requests"}
      />
      <div className="flex flex-wrap justify-start gap-4 mx-auto max-w-fit pb-[36px]">
        {data.projects.map((req) => (
          <Card
            size="small"
            title={req.projectTitle}
            subheader={req.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            children={
              <div className="flex flex-col pt-[16px] gap-[24px]">
                <p className="body3 text-[var(--typography-heading-gray)] overflow-hidden text-base font-normal leading-tight break-words">
                  {req.description}
                </p>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
