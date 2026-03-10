import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    projects: defineTable({
        ownerId: v.string(),
        name: v.string(),
        importStatus: v.optional(
            v.union(
                v.literal("importing"),
                v.literal("completed"),
                v.literal("failed")
            )),
        exportStatus: v.optional(
            v.union(
                v.literal("exporting"),
                v.literal("cancelled"),
                v.literal("completed")
            )),
        updatedAt: v.number(),
        gitRepoUrl: v.optional(v.string()),
    }).index("by_owner", ["ownerId", "updatedAt"]),
    files: defineTable({
        projectId: v.id("projects"),

        type: v.union(v.literal("file"), v.literal("folder")),

        name: v.string(),

        // In case of code
        content: v.optional(v.string()),

        // In case of image
        storageId: v.optional(v.id("_storage")),

        // Each file/folder may have many files/folders 
        parentId: v.optional(v.id("files")),

        updatedAt: v.number()
    }).index("by_project", ["projectId"])
        .index("by_parent", ["parentId"])
        .index("by_project_parent", ["parentId", "projectId"])
})