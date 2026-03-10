import { ReactNode } from "react"

import { Doc } from "@/convex/_generated/dataModel";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { getLevelPadding } from "@/features/projects/const";

interface TreeItemWrapperProps {
    item: Doc<"files">,
    level: number,
    children: ReactNode,
    onClick?: () => void
    onDoubleClick?: () => void
    onDelete?: () => void
    onRename?: () => void
    onCreateFile?: () => void
    onCreateFolder?: () => void
}
export default function TreeItemWrapper({
    item,
    level,
    children,
    onClick,
    onDoubleClick,
    onDelete,
    onRename,
    onCreateFile,
    onCreateFolder,
}: TreeItemWrapperProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    onClick={onClick}
                    className="flex gap-1.5 hover:bg-accent/30 py-1 cursor-pointer w-full group"
                    style={{ paddingLeft: getLevelPadding({ level, type: item.type }) }}
                >
                    {children}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent
                className="min-w-70"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >

                {
                    item.type === "folder" && (
                        <>
                            <ContextMenuItem className="items-center flex justify-between" onClick={onCreateFile}>
                                New File
                            </ContextMenuItem>
                            <ContextMenuItem className="items-center flex justify-between" onClick={onCreateFolder}>
                                New Folder
                            </ContextMenuItem>

                            <ContextMenuSeparator />
                        </>

                    )
                }

                <ContextMenuItem className="items-center flex justify-between" onClick={onRename}>
                    Rename
                    <ContextMenuShortcut>Enter</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem className="items-center flex justify-between" onClick={onDelete}>
                    Delete Permanently
                    <ContextMenuShortcut>⌘ Backspace</ContextMenuShortcut>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
