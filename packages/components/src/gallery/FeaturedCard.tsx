"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

import type { GalleryProject } from "@good-dog/db";

const CAROUSEL_INTERVAL_MS = 30_000;

export default function FeaturedCard({
  projects,
  paused,
  onOpenProject,
}: {
  projects: GalleryProject[];
  paused: boolean;
  onOpenProject: (project: GalleryProject) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (paused || projects.length <= 1) return;
    const id = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % projects.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [activeIndex, projects.length, paused]);

  const active = projects[activeIndex];
  if (!active) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenProject(active)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenProject(active);
        }
      }}
      className="relative flex h-[360px] w-full cursor-pointer items-end overflow-hidden rounded-3xl bg-light-gray bg-cover bg-center p-[24px] dark:bg-dark-gray-300"
      style={{
        backgroundImage: active.imageUrl
          ? `url(${active.imageUrl})`
          : undefined,
      }}
    >
      <p className="rounded-2xl bg-black/15 px-[16px] py-[10px] text-4xl font-semibold text-cream-100 backdrop-blur-md">
        {active.projectName}
      </p>

      {projects.length > 1 && (
        <div className="absolute inset-x-0 bottom-[24px] flex justify-center gap-[10px]">
          {projects.map((p, i) => (
            <button
              key={p.galleryProjectId}
              type="button"
              aria-label={`Show project ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(i);
              }}
              className={clsx(
                "h-[10px] rounded-full shadow-[0_1px_6px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all",
                i === activeIndex
                  ? "w-[24px] bg-white/70"
                  : "w-[10px] bg-white/30",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
