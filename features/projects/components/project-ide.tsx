'use client'

import { Id } from "@/convex/_generated/dataModel";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GithubIcon } from "lucide-react";

import FileExplorer from "@/features/projects/components/file-explorer";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_SIDEBAR_WIDTH = 350;
const DEFAULT_MAIN_SIZE = 1000;

const Tab = ({ title, onClick, isActive }: { title: string, onClick: () => void, isActive: boolean }) => {
    return (
        <button className={
            cn(
                "border-r border-t px-6 flex flex-col justify-center rounded-none py-2 text-gray-400 text-base",
                isActive && "bg-accent text-accent-foreground hover:bg-accent!"
            )
        } onClick={onClick}>
            {title}
        </button>
    )
}

export default function ProjectIDE({ projectId }: { projectId: Id<"projects"> }) {
    const [ideMode, setIdeMode] = useState<"code" | "preview">("code")

    return (
        <div className="flex flex-col flex-1 ">
            <Allotment defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]} className="flex flex-col flex-1">
                <Allotment.Pane
                    snap
                    minSize={MIN_SIDEBAR_WIDTH}
                    maxSize={MAX_SIDEBAR_WIDTH}
                    preferredSize={DEFAULT_SIDEBAR_WIDTH}
                    className="min-h-screen flex-1 flex flex-col"
                >
                    <p>Hello</p>
                </Allotment.Pane>
                <Allotment.Pane className="min-h-screen">

                    <div className="bg-sidebar border flex ">
                        <Tab title="Code" onClick={() => setIdeMode("code")} isActive={ideMode === "code"} />
                        <Tab title="Preview" onClick={() => setIdeMode("preview")} isActive={ideMode === "preview"} />

                        <div className="flex-1 flex justify-end">
                            <button className={
                                cn(
                                    "border px-6 flex justify-center rounded-none py-3 border-t-0 border-b-0 text-gray-400 text-base gap-2 items-center",
                                )
                            } >
                                <GithubIcon className="size-5" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Editor mode */}
                    <div
                        className={
                            cn(
                                ideMode === "code" ? "visible" : "invisible"
                            )
                        }
                    >
                        <Allotment defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]} className="min-h-screen">
                            <Allotment.Pane
                                snap
                                minSize={MIN_SIDEBAR_WIDTH}
                                maxSize={MAX_SIDEBAR_WIDTH}
                                className="min-h-screen flex-1 flex flex-col"
                                preferredSize={DEFAULT_SIDEBAR_WIDTH}
                            >
                                <FileExplorer projectId={projectId} />
                            </Allotment.Pane>
                            <Allotment.Pane
                                className="min-h-screen flex-1 flex flex-col"
                            >
                                <div>Editor view</div>
                            </Allotment.Pane>
                        </Allotment>
                    </div>

                    {/* Preview mode */}
                    <div
                        className={
                            cn(
                                ideMode === "preview" ? "visible" : "invisible"
                            )
                        }
                    >
                        preview
                    </div>

                </Allotment.Pane>
            </Allotment>
        </div>
    )
}
