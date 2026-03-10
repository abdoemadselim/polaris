import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { ChevronRight } from "lucide-react";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { getLevelPadding } from "@/features/projects/const";
import { cn } from "@/lib/utils";

interface RenamingInputProps {
    type: "file" | "folder",
    level?: number,
    onSubmit: (fileName: string) => void,
    onCancel: () => void,
    isOpenFolder: boolean,
    defaultValue: string
}

export default function RenamingInput({
    type,
    level = 0,
    onSubmit,
    onCancel,
    isOpenFolder,
    defaultValue
}: RenamingInputProps) {
    const [fileName, setFileName] = useState(defaultValue)

    const handleSubmit = () => {
        const trimmedName = fileName.trim()

        if (trimmedName === defaultValue) {
            onCancel()
            return
        }

        if (!trimmedName) {
            onCancel()
            return
        }

        onSubmit(trimmedName)
    }

    return (
        <div
            className="flex items-center bg-accent/30 py-1 gap-1.5"
            style={{ paddingLeft: getLevelPadding({ level, type }) }}
        >
            {type === "folder" && (
                <ChevronRight className={cn("size-5", isOpenFolder && "rotate-90")} />
            )}

            {type === "file" && (
                <FileIcon fileName={fileName} autoAssign={true} className="size-6" />
            )}

            {type === "folder" && (
                <FolderIcon folderName={fileName} className="size-6" />
            )}

            <Input
                autoFocus
                className="bg-accent! focus-within:ring-0 focus-visible:ring-0 focus-visible::border-ring text-base rounded-none max-h-fit py-1.5 px-0.5"
                value={fileName}
                onBlur={handleSubmit}
                onFocus={(e) => {
                    const dot = e.target.value.lastIndexOf(".")
                    if (dot > 0) {
                        e.target.setSelectionRange(0, dot)
                    } else {
                        e.target.setSelectionRange(0, e.target.value.length)
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSubmit()
                    }

                    if (e.key === "Escape") {
                        onCancel()
                    }
                }}
                onChange={(e) => setFileName(e.target.value)}
            />
        </div>
    )
}

