"use client";

import { useProjects } from "@/features/projects/hooks/use-projects";
import { ProjectCard } from "@/features/projects/components/project-card";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";

export function ProjectsGrid() {
  const { data, isLoading, isError, error } = useProjects();

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-56 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="No pudimos cargar proyectos"
        description={error instanceof Error ? error.message : "Revisa que el gateway este corriendo en localhost:8090."}
      />
    );
  }

  if (!data?.content.length) {
    return (
      <EmptyState
        title="Todavia no hay proyectos para mostrar"
        description="Cuando el backend publique proyectos disponibles, los vas a ver reflejados en este catalogo."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {data.content.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
