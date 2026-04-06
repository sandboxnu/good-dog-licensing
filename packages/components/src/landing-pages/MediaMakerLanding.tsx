"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { trpc } from "@good-dog/trpc/client";

import Card from "../base/Card";
import StatusIndicator from "../base/StatusIndicator";
import EmptyFolder from "../svg/homepage/EmptyFolder";
import EmptyMessage from "./components/EmptyMessage";
import Header from "./components/Header";

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
                  <div className="flex h-full flex-col justify-between gap-[24px] pt-[16px]">
                    <p className="body3 line-clamp-[2] break-words text-base font-normal leading-tight text-dark-gray-200 dark:text-dark-gray-100">
                      {project.description}
                    </p>
                    <div className="flex w-full flex-row justify-between">
                      <StatusIndicator status={project.mediaMakerStatus} />
                      <ChevronRight
                        onClick={() =>
                          router.push(`/project/${project.projectId}`)
                        }
                        className="text-black hover:cursor-pointer dark:text-mint-100"
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
