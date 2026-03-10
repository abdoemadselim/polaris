import { ChevronRight, CopyMinus, FilePlus2, FolderPlus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";

import { useProjectById } from "@/features/projects/hooks/use-projects";
import { useCreateFile, useCreateFolder, useFiles } from "@/features/projects/hooks/use-files";
import LoadingRow from "@/features/projects/components/file-explorer/loading-row";
import CreatingInput from "@/features/projects/components/file-explorer/creating-input";
import Tree from "@/features/projects/components/file-explorer/tree";

export default function FileExplorer({ projectId }: { projectId: Id<"projects"> }) {
    const project = useProjectById(projectId)
    const [isOpenProject, setIsOpenProject] = useState(false)
    const [creating, setCreating] = useState<"file" | "folder" | null>(null)

    const createFile = useCreateFile()
    const createFolder = useCreateFolder()

    const rootFiles = useFiles({
        projectId,
        parentId: undefined,
        enabled: isOpenProject
    })

    const handleCreateFile = (fileName: string) => {
        switch (creating) {
            case "file":
                createFile({
                    parentId: undefined,
                    name: fileName,
                    projectId: projectId
                })
                break;
            case "folder":
                createFolder({
                    parentId: undefined,
                    name: fileName,
                    projectId: projectId
                })
        }

        setCreating(null)
    }

    return (
        <ScrollArea className="h-full flex flex-col flex-1 bg-sidebar">
            <div className="bg-accent py-2 px-1">
                {
                    project == undefined ? (
                        <div>
                            <Spinner />
                        </div>
                    ) : (
                        <div className="flex gap-1.5 items-center py-1 cursor-pointer group" onClick={() => setIsOpenProject(!isOpenProject)}>
                            {
                                <ChevronRight className={
                                    cn(
                                        "size-5",
                                        isOpenProject && "rotate-90"
                                    )
                                } />
                            }
                            <p className="text-md font-medium truncate line-clamp-1">{project.name}</p>

                            <div className="flex flex-1 justify-end gap-2.5 pr-2">
                                <button className="rounded hover:bg-sidebar/40 p-0.5 -m-0.5 hidden group-hover:block" aria-label="Create file" onClick={
                                    (e) => {
                                        e.preventDefault()
                                        setIsOpenProject(true)
                                        e.stopPropagation()
                                        setCreating("file")
                                    }}>
                                    <FilePlus2 className="size-5" aria-hidden />
                                </button>
                                <button className="rounded hover:bg-sidebar/40 p-0.5 -m-0.5 hidden group-hover:block" aria-label="Create folder" onClick={(e) => {
                                    e.preventDefault()
                                    setIsOpenProject(true)
                                    e.stopPropagation()
                                    setCreating("folder")
                                }}>
                                    <FolderPlus className="size-5" aria-hidden />
                                </button>
                                <button className="rounded hover:bg-sidebar/40 p-0.5 -m-0.5 hidden group-hover:block" aria-label="Collapse all folders">
                                    <CopyMinus className="size-5" aria-hidden />
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>

            <div className="pt-1">
                <div>
                    {
                        creating && (
                            <CreatingInput
                                type={creating}
                                level={0}
                                onSubmit={handleCreateFile}
                                onCancel={() => {
                                    setCreating(null)
                                }} />
                        )
                    }
                </div>
                {
                    isOpenProject && (
                        rootFiles == undefined ? (
                            <div>
                                <LoadingRow level={0} />
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {
                                    rootFiles.map((file) => (
                                        <Tree item={file} key={file._id} level={0} />
                                    ))
                                }
                            </div>
                        )
                    )
                }
            </div>
        </ScrollArea>
    )
}
