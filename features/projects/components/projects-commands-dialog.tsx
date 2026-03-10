import { Dispatch, SetStateAction } from "react"

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import ProjectsItem from "@/features/projects/components/projects-item"

import { Id } from "@/convex/_generated/dataModel"

import { useProjects } from "@/features/projects/hooks/use-projects"
import { useRouter } from "next/navigation"

interface ProjectsCommandsDialogProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function ProjectsCommandsDialog({ open, setOpen }: ProjectsCommandsDialogProps) {
    const projects = useProjects()
    const router = useRouter()

    const handleSelect = (id: Id<"projects">) => {
        router.push(`/projects/${id}`)
    }

    return (
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
            title="Search Projects"
            description="Search and navigate through your projects"
        >
            <Command>
                <CommandInput placeholder="Search projects..." />
                <CommandList>
                    <CommandEmpty>No projects found.</CommandEmpty>
                    <CommandGroup heading="Projects">
                        {
                            projects?.map((project) => (
                                <CommandItem
                                    onSelect={() => handleSelect(project._id)}
                                    key={project._id}
                                    value={`${project.name} ${project._id}`}
                                >
                                    <ProjectsItem project={project} />
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    )
}
