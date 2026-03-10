import { v } from "convex/values";
import { mutation, query } from "./_generated/server"
import { verifyAuth } from "./auth";

export const getPartial = query({
    args: {
        limit: v.number()
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        return await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
            .order("desc")
            .take(args.limit)
    }
})

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await verifyAuth(ctx)

        return await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
            .collect()
    }
})

export const create = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        const newProjectId = await ctx.db.insert(
            "projects",
            {
                name: args.name,
                importStatus: "completed",
                ownerId: identity.subject,
                exportStatus: "exporting",
                updatedAt: Date.now()
            }
        );
        return newProjectId;
    },
});

export const getById = query({
    args: {
        id: v.id("projects")
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        const project = await ctx.db.get("projects", args.id)

        if (!project || project?.ownerId !== identity.subject) {
            throw new Error("Not authorized user")
        }

        return project;
    }
})

export const rename = mutation({
    args: {
        name: v.string(),
        projectId: v.id("projects")
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)
        const project = await ctx.db.get("projects", args.projectId)

        if (!project || project.ownerId !== identity.subject) {
            return new Error("Not authorized")
        }

        await ctx.db.patch("projects", args.projectId, {
            name: args.name
        })
    }
})