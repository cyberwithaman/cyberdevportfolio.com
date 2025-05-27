"use client";

import { useEffect, useState } from 'react';
// import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Project {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  imageUrl?: string;
  category: string;
  status: string;
  date: string;
  featured: boolean;
}

interface RelatedProjectsProps {
  currentProjectSlug: string;
  currentCategory: string;
}

export default function RelatedProjects({ currentProjectSlug, currentCategory }: RelatedProjectsProps) {
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRelatedProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        // Filter projects by category and exclude current project
        const filteredProjects = data.projects
          .filter((project: Project) => 
            project.category === currentCategory && 
            project.slug !== currentProjectSlug
          )
          .slice(0, 3); // Show only 3 related projects

        setRelatedProjects(filteredProjects);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch related projects:", error);
        setError("Failed to load related projects. Please try again later.");
        setLoading(false);
      }
    };

    if (currentCategory) {
      fetchRelatedProjects();
    }
  }, [currentCategory, currentProjectSlug]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
          <h2 className="text-lg text-zinc-100">Loading related projects...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
          <h2 className="text-lg text-red-400">{error}</h2>
        </div>
      </div>
    );
  }

  if (relatedProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl md:text-3xl font-medium text-zinc-100 mb-6">
        Related Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProjects.map((project) => (
          <div
            key={project.slug}
            className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg overflow-hidden"
          >
            <Link href={`/projects/${project.slug}`}>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={project.imageUrl || project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-70"></div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium text-zinc-100 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 text-xs bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
