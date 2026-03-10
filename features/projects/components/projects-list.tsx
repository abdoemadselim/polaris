import { Doc } from "@/convex/_generated/dataModel";

import ProjectsItem from "./projects-item";


export default function ProjectsList({ projects }: { projects: Doc<"projects">[] }) {
    return (
        <ul className="flex flex-col gap-4 mt-4">
            {
                projects.map((project) => (
                    <li className="group" key={project._id}>
                        <ProjectsItem project={project} />
                    </li>
                ))
            }
        </ul>
    )
}
