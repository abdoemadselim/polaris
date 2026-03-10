import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"

export const useProjectsPartial = (limit: number) => {
    return useQuery(api.projects.getPartial, { limit })
}

export const useProjects = () => {
    return useQuery(api.projects.get)
}

export const useCreateProject = () => {
    return useMutation(api.projects.create).withOptimisticUpdate(
        (localStore, args) => {
            const { name } = args;
            const currentValue = localStore.getQuery(api.projects.get);

            if (currentValue !== undefined) {
                // eslint-disable-next-line
                const now = Date.now()

                const newProject: Doc<"projects"> = {
                    _creationTime: now,
                    updatedAt: now,
                    _id: crypto.randomUUID() as Id<"projects">,
                    name: name,
                    ownerId: "anonymous",
                }

                localStore.setQuery(api.projects.get, {}, [
                    ...currentValue,
                    newProject
                ]);
            }
        })
}

export const useProjectById = (id: Id<"projects">, skip: boolean = false) => {
    return useQuery(api.projects.getById, { id })
}

export const useRenameProject = () => {
    return useMutation(api.projects.rename).withOptimisticUpdate(
        (localStorage, args) => {
            const { name, projectId } = args;
            const currentProject = localStorage.getQuery(api.projects.getById, { id: projectId })

            if (currentProject !== undefined) {
                // eslint-disable-next-line
                const now = Date.now()

                localStorage.setQuery(api.projects.getById, { id: projectId }, {
                    ...currentProject,
                    name,
                    updatedAt: now,
                })
            }

            const currentProjects = localStorage.getQuery(api.projects.get)

            if (currentProjects !== undefined) {
                // eslint-disable-next-line
                const now = Date.now()

                localStorage.setQuery(api.projects.get, {},
                    currentProjects.map((project) => (
                        project._id === currentProject?._id ? { ...project, name, updatedAt: now } : project
                    ))
                )
            }
        }
    )
}