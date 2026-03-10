// Base padding for root level items (after project header)
const BASE_PADDING = 8

// Additional padding per nesting level
const LEVEL_PADDING = 12

export const getLevelPadding = ({ type = "file", level }: { type?: "file" | "folder", level: number }) => {
    // Files need extra padding since they don't have the chevron
    const fileOffset = type === "file" ? 25 : 0

    return BASE_PADDING + level * LEVEL_PADDING + fileOffset;
}