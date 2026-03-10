import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { ChevronRight } from "lucide-react";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { getLevelPadding } from "@/features/projects/const";

interface CreatingInputProps {
    type: "file" | "folder",
    level?: number,
    onSubmit: (fileName: string) => void,
    onCancel: () => void
}

export default function CreatingInput({
    type,
    level = 0,
    onSubmit,
    onCancel
}: CreatingInputProps) {
    const [fileName, setFileName] = useState("")

    const handleSubmit = () => {
        const trimmedName = fileName.trim()

        if (trimmedName) {
            onSubmit(trimmedName)
        } else {
            onCancel()
        }
    }

    return (
        <div
            className="flex items-center bg-accent/30 py-1 gap-1.5"
            style={{ paddingLeft: getLevelPadding({ level, type }) }}
        >
            {type === "folder" && (
                <ChevronRight className="size-5" />
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

