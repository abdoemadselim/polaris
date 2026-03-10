import Link from "next/link";
import { AlertCircle, Globe, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button";

import { Doc } from "@/convex/_generated/dataModel";
import Github from "@/components/icons/github";

const formatDate = (date: number) => {
    if (date) {
        return formatDistanceToNow(new Date(date), { addSuffix: true })
    }
}

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

export default function ProjectsItem({ project }: { project: Doc<"projects"> }) {
    return (
        <Button variant="ghost" className="items-center w-full justify-between px-2 relative">
            <div className="flex items-center gap-2">
                {getProjectIcon(project)}
                <p className="text-sm text-zinc-300 group-hover:text-zinc-100">{project.name}</p>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-white/70">
                {formatDate(project.updatedAt)}
            </span>

            <Link href={`projects/${project._id}`} aria-label={`Open ${project.name} project`} className="absolute inset-0 w-full h-full" />
        </Button>
    )
}
