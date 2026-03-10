import { Id } from "@/convex/_generated/dataModel";
import ProjectPage from "@/features/projects/pages/project-page";

export default async function Page({ params }: { params: Promise<{ projectId: Id<"projects"> }> }) {
    const { projectId } = await params;

    return (
        <ProjectPage projectId={projectId} />
    )
}
