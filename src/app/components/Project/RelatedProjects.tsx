"use client";

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
      <section className="py-16">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
              <h2 className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                Loading related projects...
              </h2>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="py-16">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-30"></div>
          <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-8 backdrop-blur-sm shadow-xl">
            <h2 className="text-lg text-red-400">{error}</h2>
          </div>
        </div>
      </section>
    );
  }

  if (relatedProjects.length === 0) {
    return null;
  }
  return (
    <section className="py-16">
      <div className="text-center mb-12 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-blue-100 to-purple-100 mb-4">
          Related Projects
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Explore more projects in the same category
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProjects.map((project, index) => (
          <div
            key={project.slug}
            className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm hover:scale-105"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500"></div>
            <Link href={`/projects/${project.slug}`}>
              <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                <Image
                  src={project.imageUrl || project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm px-3 py-1 rounded-md border border-zinc-800/50 text-zinc-300 text-xs uppercase tracking-wider font-medium">
                  {project.status}
                </div>
              </div>
              <div className="relative z-10 p-6">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-blue-100 mb-3 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-4 group-hover:text-zinc-300 transition-colors leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-xs font-medium text-zinc-300 bg-zinc-800/70 border border-zinc-700/50 rounded-full group-hover:border-blue-500/50 group-hover:text-zinc-200 group-hover:bg-zinc-700/70 transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 group-hover:translate-x-2 transition-all duration-300">
                  View Project
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3" />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
