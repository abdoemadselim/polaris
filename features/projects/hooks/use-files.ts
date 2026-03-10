import { api } from "@/convex/_generated/api.js"
import { Doc, Id } from "@/convex/_generated/dataModel.js"
import { useMutation, useQuery } from "convex/react"

export const useFiles = ({ projectId, parentId, enabled = false }: {
    projectId: Id<"projects">,
    parentId?: Id<"files">,
    enabled?: boolean
}) => {
    return useQuery(api.files.getFiles,
        enabled ? { projectId, parentId } : "skip"
    )
}

export const useFile = (fileId: Id<"files">) => {
    return useQuery(api.files.getFile, {
        id: fileId
    })
}

export const useCreateFile = () => {
    return useMutation(api.files.createFile).withOptimisticUpdate(
        (localStore, args) => {
            const { parentId, projectId, name } = args;
            const currentValue = localStore.getQuery(api.files.getFiles, { parentId, projectId });

            if (currentValue !== undefined) {
                // eslint-disable-next-line
                const now = Date.now()

                const newFile: Doc<"files"> = {
                    _creationTime: now,
                    updatedAt: now,
                    _id: crypto.randomUUID() as Id<"files">,
                    name: name,
                    type: "file",
                    projectId,
                    parentId
                }

                localStore.setQuery(api.files.getFiles, { projectId, parentId }, [
                    ...currentValue,
                    newFile
                ]);
            }
        })
}

export const useRenameFile = () => {
    return useMutation(api.files.renameFile)
        .withOptimisticUpdate(
            (localStorage, args) => {
                const { name, id } = args;
                const currentFile = localStorage.getQuery(api.files.getFile, { id })

                if (currentFile !== undefined) {
                    // eslint-disable-next-line
                    const now = Date.now()

                    localStorage.setQuery(api.files.getFile, { id },
                        {
                            ...currentFile,
                            name,
                            updatedAt: now,
                        }
                    )

                    const currentFiles = localStorage.getQuery(api.files.getFiles, { parentId: currentFile.parentId, projectId: currentFile.projectId })

                    if (currentFiles !== undefined) {
                        // eslint-disable-next-line
                        const now = Date.now()

                        localStorage.setQuery(api.files.getFiles, { projectId: currentFile.projectId, parentId: currentFile.parentId },
                            currentFiles.map((file) => (
                                file._id === currentFile?._id ? { ...file, name, updatedAt: now } : file
                            ))
                        )
                    }
                }
            })
}

export const useDeleteFile = () => {
    return useMutation(api.files.deleteFile)
}

export const useCreateFolder = () => {
    return useMutation(api.files.createFolder).withOptimisticUpdate(
        (localStore, args) => {
            const { parentId, projectId, name } = args;
            const currentValue = localStore.getQuery(api.files.getFiles, { parentId, projectId });

            if (currentValue !== undefined) {
                // eslint-disable-next-line
                const now = Date.now()

                const newFile: Doc<"files"> = {
                    _creationTime: now,
                    updatedAt: now,
                    _id: crypto.randomUUID() as Id<"files">,
                    name: name,
                    type: "folder",
                    projectId,
                    parentId
                }

                localStore.setQuery(api.files.getFiles, { projectId, parentId }, [
                    ...currentValue,
                    newFile
                ]);
            }
        })
}

export const useUpdateFile = () => {
    return useMutation(api.files.updateFile).withOptimisticUpdate(
        (localStore, args) => {
            const { content, id } = args;
            const currentFile = localStore.getQuery(api.files.getFile, { id })

            if (currentFile !== undefined) {
                // eslint-disable-next-line
                const now = Date.now()

                localStore.setQuery(api.files.getFile, { id },
                    {
                        ...currentFile,
                        content,
                        updatedAt: now,
                    }
                )

                const currentFiles = localStore.getQuery(api.files.getFiles,
                    {
                        parentId: currentFile.parentId,
                        projectId: currentFile.projectId
                    })

                if (currentFiles !== undefined) {
                    // eslint-disable-next-line
                    const now = Date.now()

                    localStore.setQuery(api.files.getFiles, { projectId: currentFile.projectId, parentId: currentFile.parentId },
                        currentFiles.map((file) => (
                            file._id === currentFile?._id ? { ...file, content, updatedAt: now } : file
                        ))
                    )
                }
            }
        })
}