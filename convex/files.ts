import { v } from "convex/values";
import { mutation, query } from "./_generated/server"
import { verifyAuth } from "./auth";
import { Id } from "./_generated/dataModel.js";

// Get files sorted (folders --> files)
export const getFiles = query({
    args: {
        projectId: v.id("projects"),
        parentId: v.optional(v.id("files"))
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        const { projectId, parentId } = args;

        const project = await ctx.db.get("projects", projectId)

        if (!project) {
            throw new Error("Unauthorized access")
        }

        if (project.ownerId !== identity.subject) {
            throw new Error("Unauthorized access")
        }

        const files = await ctx.db
            .query("files")
            .withIndex("by_project_parent", (q) => q.eq("parentId", parentId).eq("projectId", projectId))
            .collect()

        // sort
        files.sort((a, b) => {
            if (a.type === "file" && b.type === "folder") return 1;
            else if (a.type === "folder" && b.type === "file") return -1;

            return a.name.localeCompare(b.name)
        })

        return files;
    }
})

// Get a file
export const getFile = query({
    args: {
        id: v.id("files")
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        const { id } = args

        const file = await ctx.db.get("files", id)

        if (!file) {
            throw new Error("Unauthorized access")
        }

        // file exist
        const project = await ctx.db.get("projects", file.projectId)

        if (!project) {
            throw new Error("Unauthorized access")
        }

        if (project.ownerId !== identity.subject) {
            throw new Error("Unauthorized access")
        }

        return file
    }
})

// Create a file
export const createFile = mutation({
    args: {
        name: v.string(),
        projectId: v.id("projects"),
        parentId: v.optional(v.id("files"))
    },
    handler: async (ctx, args) => {
        const { name, projectId, parentId } = args;

        const identity = await verifyAuth(ctx)

        // file exist
        const project = await ctx.db.get("projects", projectId)

        if (!project) {
            throw new Error("Unauthorized access")
        }

        if (project.ownerId !== identity.subject) {
            throw new Error("Unauthorized access")
        }

        const files = await ctx.db.query("files").withIndex("by_project_parent", (q) => q.eq("parentId", parentId).eq("projectId", projectId)).collect()

        const file = files.find((file) => {
            return file.type === "file" && file.name === name
        })

        if (file) {
            throw new Error("file already exists")
        }

        const now = Date.now()

        await ctx.db.insert("files", {
            name,
            updatedAt: Date.now(),
            projectId,
            parentId,
            type: "file",
        })

        await ctx.db.patch("projects", projectId, {
            updatedAt: now
        })
    }
})

// Rename a file
export const renameFile = mutation({
    args: {
        id: v.id("files"),
        name: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        const { id, name } = args;

        const file = await ctx.db.get("files", id)

        if (!file) {
            throw new Error("Unauthorized access")
        }

        const project = await ctx.db.get("projects", file.projectId)

        if (!project) {
            throw new Error("Unauthorized access")
        }

        if (project.ownerId !== identity.subject) {
            throw new Error("Unauthorized access")
        }

        const fileWithSameName = (await ctx
            .db
            .query("files")
            .withIndex("by_project_parent",
                (q) => q.eq("parentId", file.parentId).eq("projectId", file.projectId))
            .collect())
            .find((file) => file.name === name)


        if (fileWithSameName) {
            throw new Error("a file with the new name already exists")
        }

        const now = Date.now()

        await ctx.db.patch("files", id, {
            name,
            updatedAt: now
        })

        await ctx.db.patch("projects", file.projectId, {
            updatedAt: now
        })
    }
})

// Delete a file
export const deleteFile = mutation({
    args: {
        id: v.id("files")
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        const { id } = args;

        const file = await ctx.db.get("files", id)

        if (!file) {
            throw new Error("Unauthorized access")
        }

        const project = await ctx.db.get("projects", file.projectId)

        if (!project) {
            throw new Error("Unauthorized access")
        }

        if (project.ownerId !== identity.subject) {
            throw new Error("Unauthorized access")
        }

        const deleteRecursively = async (fileId: Id<"files">) => {
            // get the file
            const file = await ctx.db.get("files", fileId)

            if (!file) return;

            if (file.type === "folder") {
                const files = await ctx.db.query("files").withIndex("by_parent", (q) => q.eq("parentId", file._id)).collect()
                files.forEach(async (file) => {
                    await deleteRecursively(file._id)
                })
            }

            await ctx.db.delete("files", fileId)
        }

        deleteRecursively(file._id)
    }
})

// Update the file content
export const updateFile = mutation({
    args: {
        id: v.id("files"),
        content: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        const { id, content } = args;

        const file = await ctx.db.get("files", id)

        if (!file) {
            throw new Error("Unauthorized access")
        }

        const project = await ctx.db.get("projects", file.projectId)

        if (!project) {
            throw new Error("Unauthorized access")
        }

        if (project.ownerId !== identity.subject) {
            throw new Error("Unauthorized access")
        }

        const now = Date.now()

        await ctx.db.patch("files", file._id, {
            content,
            updatedAt: now
        })

        await ctx.db.patch("projects", file.projectId, {
            updatedAt: now
        })
    }
})

// Create folder
export const createFolder = mutation({
    args: {
        projectId: v.id("projects"),
        parentId: v.optional(v.id("files")),
        name: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        const { name, projectId, parentId } = args;

        // file exist
        const project = await ctx.db.get("projects", projectId)

        if (!project) {
            throw new Error("Unauthorized access")
        }

        if (project.ownerId !== identity.subject) {
            throw new Error("Unauthorized access")
        }

        const files = await ctx.db.query("files").withIndex("by_project_parent", (q) => q.eq("parentId", parentId).eq("projectId", projectId)).collect()

        const file = files.find((file) => {
            return file.type === "folder" && file.name === name
        })

        if (file) {
            throw new Error("folder already exists")
        }

        const now = Date.now()

        await ctx.db.insert("files", {
            name,
            updatedAt: Date.now(),
            projectId,
            parentId,
            type: "folder",
        })

        await ctx.db.patch("projects", projectId, {
            updatedAt: now
        })
    }
})