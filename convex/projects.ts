import { v } from "convex/values";
import { mutation, query } from "./_generated/server"

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated")
        }

        return await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
            .collect()
    }
})

export const createProject = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (identity === null) {
            throw new Error("Not authenticated")
        }

        const newProjectId = await ctx.db.insert("projects", { name: args.name, importStatus: "completed", ownerId: identity.subject });
        return newProjectId;
    },
});