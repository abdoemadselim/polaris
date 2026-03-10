import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { ChevronRight, FilePlus2, FolderPlus } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { cn } from "@/lib/utils";

import { useCreateFile, useCreateFolder, useDeleteFile, useFiles, useRenameFile } from "@/features/projects/hooks/use-files";
import CreatingInput from "@/features/projects/components/file-explorer/creating-input";
import LoadingRow from "@/features/projects/components/file-explorer/loading-row";
import TreeItemWrapper from "@/features/projects/components/file-explorer/tree-item-wrapper";
import { getLevelPadding } from "@/features/projects/const";
import RenamingInput from "@/features/projects/components/file-explorer/renaming-input";

interface TreeProps {
    item: Doc<"files">,
    level?: number
}

export default function Tree({
    item,
    level = 0
}: TreeProps) {
    const [isOpenFolder, setIsOpenFolder] = useState(false)
    const [creating, setCreating] = useState<"file" | "folder" | null>(null)
    const [isRenaming, setIsRenaming] = useState(false)
    const [fileName, setFileName] = useState("")

    const createFile = useCreateFile()
    const createFolder = useCreateFolder()
    const deleteFile = useDeleteFile()
    const renameFile = useRenameFile()

    const files = useFiles({
        projectId: item.projectId,
        parentId: item._id,
        enabled: isOpenFolder
    })

    const handleDelete = () => {
        deleteFile({
            id: item._id
        })
    }

    const handleCreateFile = (fileName: string) => {
        setCreating(null)

        switch (creating) {
            case "file":
                createFile({
                    parentId: item._id,
                    name: fileName,
                    projectId: item.projectId
                })
                break;
            case "folder":
                createFolder({
                    parentId: item._id,
                    name: fileName,
                    projectId: item.projectId
                })
        }

        setCreating(null)
    }

    if (item.type === "file") {
        if (isRenaming) {
            return (
                <RenamingInput
                    defaultValue={item.name}
                    type={item.type}
                    level={level}
                    onSubmit={
                        (fileName: string) => {
                            renameFile({
                                name: fileName,
                                id: item._id
                            })
                            setIsRenaming(false)
                        }}
                    onCancel={() => setIsRenaming(false)}
                    isOpenFolder={isOpenFolder}
                />
            )
        }

        return (
            <TreeItemWrapper
                item={item}
                level={level}
                onDoubleClick={() => { }}
                onDelete={() => {
                    // Close tab
                    handleDelete()
                }}
                onRename={() => {
                    setIsRenaming(true)
                    setFileName(item.name)
                }}
            >

                <FileIcon fileName={item.name} autoAssign={true} className="size-6" />
                <p>{item.name}</p>
            </TreeItemWrapper >
        )
    }

    const folderRender = (
        <div className="flex items-center gap-1.5">
            <ChevronRight className={cn("size-5", isOpenFolder && "rotate-90")} />
            <div className="flex items-center gap-1.5">
                <FolderIcon folderName={item.name} className="size-6" />
                <p>{item.name}</p>
            </div>
        </div>
    )

    if (item.type === "folder") {

        if (creating) {
            return (
                <>
                    <button
                        onClick={() => setIsOpenFolder((value) => !value)}
                        className="group flex items-center gap-1.5 py-1 hover:bg-accent/30 w-full"
                        style={{ paddingLeft: getLevelPadding({ level, type: item.type }) }}
                    >
                        {folderRender}

                        <div className="flex flex-1 justify-end gap-2.5 pr-2">
                            <div
                                className="rounded hover:bg-sidebar/40 p-0.5 -m-0.5 hidden group-hover:block"
                                aria-label="Create file"
                                onClick={
                                    (e) => {
                                        e.preventDefault()
                                        setIsOpenFolder(true)
                                        e.stopPropagation()
                                        setCreating("file")
                                    }}>
                                <FilePlus2 className="size-5" aria-hidden />
                            </div>
                            <div
                                className="rounded hover:bg-sidebar/40 p-0.5 -m-0.5 hidden group-hover:block"
                                aria-label="Create folder"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setIsOpenFolder(true)
                                    e.stopPropagation()
                                    setCreating("folder")
                                }}>
                                <FolderPlus className="size-5" aria-hidden />
                            </div>
                        </div>
                    </button>
                    {isOpenFolder && (
                        <div className="pt-1">
                            {files === undefined && <LoadingRow level={level + 1} />}
                            <CreatingInput
                                type={creating}
                                level={level + 1}
                                onSubmit={handleCreateFile}
                                onCancel={() => setCreating(null)}
                            />
                            {files?.map((file) => (
                                <Tree
                                    key={file._id}
                                    item={file}
                                    level={level + 1}
                                />
                            ))}
                        </div>
                    )}
                </>
            )
        }

        if (isRenaming) {
            return (
                <>
                    <RenamingInput
                        defaultValue={item.name}
                        type={item.type}
                        level={level}
                        onSubmit={
                            (fileName: string) => {
                                renameFile({
                                    name: fileName,
                                    id: item._id
                                })
                                setIsRenaming(false)
                            }
                        }
                        onCancel={() => setIsRenaming(false)}
                        isOpenFolder={isOpenFolder}
                    />

                    {
                        isOpenFolder && (
                            <>
                                {files === undefined && <LoadingRow level={level + 1} />}
                                {files?.map((file) => (
                                    <Tree
                                        key={file._id}
                                        item={file}
                                        level={level + 1}
                                    />
                                ))}
                            </>
                        )
                    }
                </>
            )
        }


        return (
            <>
                <TreeItemWrapper
                    item={item}
                    level={level}
                    onClick={() => {
                        setIsOpenFolder(!isOpenFolder)

                        if (isOpenFolder) {
                            setCreating(null)
                        }
                    }}
                    onDelete={handleDelete}
                    onRename={() => {
                        setIsRenaming(true)
                        setFileName(item.name)
                    }}
                    onCreateFile={() => {
                        setIsOpenFolder(true)
                        setCreating("file")
                    }}
                    onCreateFolder={() => {
                        setCreating("folder")
                        setIsOpenFolder(true)
                    }}
                >
                    {folderRender}
                    <div className="flex flex-1 justify-end gap-2.5 pr-2">
                        <button
                            className="rounded hover:bg-sidebar/40 p-0.5 -m-0.5 hidden group-hover:block"
                            aria-label="Create file"
                            type="button"
                            onClick={
                                (e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setIsOpenFolder(true)
                                    setCreating("file")
                                }}>
                            <FilePlus2 className="size-5" aria-hidden />
                        </button>
                        <button
                            className="rounded hover:bg-sidebar/40 p-0.5 -m-0.5 hidden group-hover:block"
                            aria-label="Create folder"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsOpenFolder(true)
                                setCreating("folder")
                            }}>
                            <FolderPlus className="size-5" aria-hidden />
                        </button>
                    </div>
                </TreeItemWrapper>

                {isOpenFolder && (
                    <>
                        {files === undefined && <LoadingRow level={level + 1} />}
                        {files?.map((file) => (
                            <Tree
                                key={file._id}
                                item={file}
                                level={level + 1}
                            />
                        ))}
                    </>
                )}
            </>
        )
    }
}
