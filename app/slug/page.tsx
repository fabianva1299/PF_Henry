import { notFound } from "next/navigation";
import { projects } from "@/src/data/proyects";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <main className="min-h-screen px-6 py-20 text-white">
      <h1 className="text-4xl font-bold">{project.title}</h1>
      <p className="mt-4 text-indigo-200/65">{project.description}</p>
    </main>
  );
}