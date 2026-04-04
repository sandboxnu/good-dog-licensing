"use client";

import { trpc } from "@good-dog/trpc/client";
import Card from "../base/Card";
import StatusIndicator from "../base/StatusIndicator";
import EmptyFolder from "../svg/homepage/EmptyFolder";
import EmptyMessage from "./components/EmptyMessage";
import Header from "./components/Header";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MediaMakerLanding() {
  const [data] = trpc.mediamakerProjects.useSuspenseQuery();

  const router = useRouter();

  return (
    <div className="align-start flex w-full flex-col gap-[32px]">
      <Header
        title={"Project requests"}
        subtitle={"This is where you view and manage your project requests"}
        requestPath={"/project-submission"}
        buttonContent={"Request"}
      />
      {data.projects.length === 0 && (
        <EmptyMessage
          title={"Find projects requests here"}
          description="Once you submit a project request, you can track its status, view details, and manage all your requests here."
          icon={<EmptyFolder />}
        />
      )}
      {data.projects.length > 0 && (
        <div className="mx-auto flex max-w-fit flex-wrap justify-start gap-4 pb-[36px]">
          {data.projects.map((project, key) => {
            return (
              <Card
                size="small"
                title={project.projectTitle}
                subheader={
                  "Submitted " +
                  project.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
                children={
                  <div className="flex flex-col gap-[24px] h-full justify-between pt-[16px]">
                    <p className="body3 line-clamp-[2] break-words text-base font-normal leading-tight text-dark-gray-200 dark:text-dark-gray-100">
                      {project.description}
                    </p>
                    <div className="w-full flex flex-row justify-between">
                      <StatusIndicator status={project.mediaMakerStatus} />
                      <ChevronRight
                        onClick={() =>
                          router.push(`/project/${project.projectId}`)
                        }
                        className="hover:cursor-pointer text-black dark:text-mint-100"
                        fill="none"
                      />
                    </div>
                  </div>
                }
                key={key}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
