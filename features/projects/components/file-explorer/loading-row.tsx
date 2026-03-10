import { Spinner } from "@/components/ui/spinner";
import { getLevelPadding } from "@/features/projects/const";
import { cn } from "@/lib/utils";

export default function LoadingRow({
    level,
    className
}: {
    level: number,
    className?: string
}) {
    return (
        <div
            className={cn("flex items-center py-1", className)}
            style={{ paddingLeft: getLevelPadding({ level }) }}
        >
            <Spinner className="text-ring size-4" />
        </div>
    )
}
