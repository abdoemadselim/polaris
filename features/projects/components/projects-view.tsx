import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Loader2, ArrowRight, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

import Github from "@/components/icons/github";
import { Button, buttonVariants } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import ProjectsList from "@/features/projects/components/projects-list";
import ProjectsCommandsDialog from "@/features/projects/components/projects-commands-dialog"

import { useProjectsPartial } from "@/features/projects/hooks/use-projects";

import { Doc } from "@/convex/_generated/dataModel";

const getProjectIcon = (project: Doc<"projects">) => {
    switch (project.importStatus) {
        case "completed":
            return <Github className="size-5" />
        case "failed":
            return <AlertCircle className="size-5" />
        case "importing":
            return <Loader2 className="animate-spin" />
        default:
            return <Globe />
    }
}

export default function ProjectsView() {
    const data = useProjectsPartial(5)
    const [projectsDialogOpen, setProjectsDialogOpen] = useState(false)

    useEffect(() => {
        const handleProjectsDialogOpen = (event: KeyboardEvent) => {
            if (event.ctrlKey || event.metaKey) {
                if (event.key === "k") {
                    setProjectsDialogOpen(true)
                }
            }
        }

        window.addEventListener("keydown", handleProjectsDialogOpen)

        return () => window.removeEventListener("keydown", handleProjectsDialogOpen)
    }, [])

    if (!data) {
        return <div className="flex flex-col justify-center items-center mt-8">
            <Spinner className="size-8" />
        </div>
    }

    const [latestProject, ...projects] = data;

    return (
        <>
            <ProjectsCommandsDialog open={projectsDialogOpen} setOpen={setProjectsDialogOpen} />
            {
                latestProject && (
                    <section aria-describedby="last-updated" className="mt-8">
                        <h2 id="last-updated" className="text-muted-foreground pb-2 text-sm">Last updated</h2>
                        <Link className={
                            buttonVariants(
                                {
                                    className: "w-full min-h-fit max-w-full py-4 group",
                                    variant: "outline",
                                }

                            )} href={`/projects/${latestProject._id}`}>
                            <div className="flex flex-col items-start w-full gap-4">
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex gap-2 items-center">
                                        {getProjectIcon(latestProject)}
                                        <h3 className="text-">{latestProject?.name}</h3>
                                    </div>

                                    <ArrowRight className="group-hover:translate-x-0.5 transition-transform duration-150" />
                                </div>

                                <span className="text-sm text-muted-foreground">{formatDistanceToNow(latestProject?.updatedAt, { addSuffix: true })}</span>
                            </div>
                        </Link>
                    </section>
                )
            }

            <section aria-describedby="recent-projects" className="mt-8">
                <header className="justify-between flex items-center">
                    <h2 id="recent-projects" className="text-muted-foreground pb-2 text-sm">Recent Projects</h2>

                    <Button className="group px-2 -mx-2" variant="ghost" onClick={() => setProjectsDialogOpen(true)}>
                        <span className="text-sm text-muted-foreground group-hover:text-white/70 transition-colors">View all</span>
                        <span className="sr-only">Press Ctrl + k</span>

                        <Kbd data-icon="inline-end" className="translate-x-0.5 bg-accent ml-2 group-hover:bg-white/10 transition-colors">
                            Ctrl+k
                        </Kbd>
                    </Button>
                </header>

                <ProjectsList projects={projects} />
            </section >
        </>
    )
}
