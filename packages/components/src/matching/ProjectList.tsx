"use client";

import { useState } from "react";
import { ChevronRightIcon, VideoIcon } from "@radix-ui/react-icons";

import { trpc } from "@good-dog/trpc/client";
import { GetProcedureOutput } from "@good-dog/trpc/utils";
import { Button } from "@good-dog/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@good-dog/ui/card";

export function ProjectList() {
  type Project = GetProcedureOutput<"getProjects">["projects"][0];
  type Scene = Project["scenes"][0];

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  const projects: GetProcedureOutput<"getProjects">["projects"] =
    trpc.getProjects.useSuspenseQuery()[0]["projects"];

  return (
    <Card className="border border-primary/20 bg-background/50">
      <CardHeader>
        <CardTitle className="text-xl text-primary">
          Projects & Scenes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedProject ? (
          <div className="space-y-2">
            {projects.map((project) => (
              <Button
                key={project.projectId}
                variant="ghost"
                className="w-full justify-between hover:bg-primary/10"
                onClick={() => setSelectedProject(project)}
              >
                <span className="flex items-center gap-2">
                  <VideoIcon className="h-4 w-4" />
                  {project.projectTitle}
                </span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="ghost"
              className="text-primary"
              onClick={() => setSelectedProject(null)}
            >
              ← Back to Projects
            </Button>
            <div className="space-y-2">
              {selectedProject.scenes.map((scene) => (
                <Button
                  key={scene.sceneId}
                  variant="outline"
                  className={`w-full justify-between ${
                    selectedScene?.sceneId === scene.sceneId
                      ? "border-primary bg-primary/10"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedScene(scene)}
                >
                  <span>{scene.sceneTitle}</span>
                  <span className="text-sm text-muted-foreground">
                    {scene.musicType}
                    {/* could maybe add something about duration and other info here */}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
