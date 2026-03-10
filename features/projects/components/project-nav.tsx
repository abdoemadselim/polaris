'use client'

import { AlertCircle, CloudCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { UserButton } from "@clerk/nextjs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Spinner } from "@/components/ui/spinner"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

import { useProjectById, useRenameProject } from "@/features/projects/hooks/use-projects"

import { Doc, Id } from "@/convex/_generated/dataModel"

const getProjectStateIcon = (project: Doc<"projects">) => {
    if (project.importStatus === "importing") {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Spinner className="size-6" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Updating</p>
                </TooltipContent>
            </Tooltip>
        )
    } else if (project.importStatus === "failed") {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertCircle className="size-6" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Failed to update</p>
                </TooltipContent>
            </Tooltip>
        )
    } else {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <CloudCheck className="size-6" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Saved {formatDistanceToNow(project.updatedAt, { addSuffix: true })}</p>
                </TooltipContent>
            </Tooltip>
        )
    }
}

export default function ProjectNav({ projectId }: { projectId: Id<"projects"> }) {
    const router = useRouter()
    const project = useProjectById(projectId)
    const renameProject = useRenameProject()

    const [isRename, setIsRename] = useState(false)
    const [projectName, setProjectName] = useState("")


    if (project === undefined) {
        return (
            <div className="bg-sidebar p-6 flex justify-between items-center">
                <Spinner />
            </div>
        )
    }

    if (project === null) {
        router.replace("/")
    }

    const handleSetRename = () => {
        setIsRename(true)
        setProjectName(project.name)
    }

    const handleSubmit = () => {
        setIsRename(false)
        const trimmedName = projectName.trim()

        if (!trimmedName) {
            return
        }

        if (trimmedName === project.name) {
            return;
        }

        renameProject({
            name: projectName,
            projectId: project._id
        })
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            setIsRename(false)
            handleSubmit()

        } else if (event.key === "Escape") {
            setIsRename(false)
        }
    }

    return (
        <header className="bg-sidebar px-6 py-2 flex justify-between items-center">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">
                            <Image
                                src="/logo.png"
                                alt="Go To home page"
                                width={700 / 7}
                                height={416 / 7}
                                className="pb-2"
                            />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {
                            isRename ? (
                                <Input
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="text-white text-lg!"
                                    onBlur={handleSubmit}
                                    autoFocus
                                    onKeyDown={handleKeyDown}
                                />
                            ) : (
                                <>
                                    <BreadcrumbPage className="pr-2 truncate max-w-50 font-medium text-lg" onClick={handleSetRename}>
                                        {project?.name ?? "Loading.."}
                                    </BreadcrumbPage>
                                    {getProjectStateIcon(project)}
                                </>
                            )
                        }
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <UserButton />
        </header>
    )
}
