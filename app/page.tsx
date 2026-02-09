'use client'

import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button";

export default function Home() {
  const projects = useQuery(api.projects.get) || []
  const addProjectMutation = useMutation(api.projects.createProject)

  return (
    <div>
      <Button onClick={() => addProjectMutation({ name: "new Project" })}>Add project</Button>
      <ul>
        {
          projects?.map((project, i) => (
            <li key={project._id}>
              <p>projectName: {project.name} </p>
              <p>ownerId: {project.ownerId}</p>
            </li>
          ))
        }
      </ul>
    </div>
  );
}
