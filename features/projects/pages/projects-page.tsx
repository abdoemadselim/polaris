'use client'

import Image from "next/image";
import { Github, SparkleIcon } from "lucide-react";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import ProjectsView from "@/features/projects/components/projects-view";

import { useCreateProject } from "@/features/projects/hooks/use-projects";
import { useEffect } from "react";

export default function ProjectsPage() {
  const addProject = useCreateProject()

  const createProject = () => {
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 3
    });

    addProject({
      name: shortName,
    })
  }

  useEffect(() => {
    const createProjectEventHandler = (e: KeyboardEvent) => {
      if (e.key === "J") {
        if (e.ctrlKey || e.metaKey) {
          createProject()
        }
      }
    }

    window.addEventListener("keydown", createProjectEventHandler)

    return () => window.removeEventListener("keydown", createProject)
  }, [])

  return (
    <div className="flex flex-col min-h-full bg-background w-2xl mx-auto mt-15">
      <div className="flex gap-4 items-center ">
        <Image
          src="/logo.png"
          alt="Curse logo"
          width={150}
          height={150}
          className="width-[350px] height-[408px]"
        />
      </div>

      <div className="flex gap-4 mt-8 w-full max-w-full min-w-full">
        <Button variant="outline" className="group flex flex-col items-start rounded-none h-auto gap-6 flex-1" onClick={() => createProject()}>
          <div className="flex justify-between w-full ">
            <SparkleIcon className="size-5" />
            <Kbd data-icon="inline-end" className="translate-x-0.5 bg-background/70 group-hover:bg-background/90">
              Ctrl+J
            </Kbd>
          </div>
          <p className="text-lg text-orange-500">New</p>
        </Button>

        <Button variant="outline" className="group flex flex-col items-start rounded-none h-auto gap-6 flex-1">
          <div className="flex justify-between w-full">
            <Github className="size-5" />
            <Kbd data-icon="inline-end" className="translate-x-0.5 bg-background/70 group-hover:bg-background/90">
              Ctrl+I
            </Kbd>
          </div>
          <p className="text-base">Import</p>
        </Button>
      </div>

      <ProjectsView />
    </div>
  );
}
