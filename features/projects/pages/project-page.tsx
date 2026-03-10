import { Id } from "@/convex/_generated/dataModel"

import ProjectNav from "@/features/projects/components/project-nav"
import ProjectIDE from "@/features/projects/components/project-ide"

export default function ProjectPage({
    projectId
}: { projectId: Id<"projects"> }) {
    return (
        <div className="flex flex-1 flex-col h-screen">
            <ProjectNav projectId={projectId} />
            <ProjectIDE projectId={projectId} />
        </div>
    )
}
