"use client";

// import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  imageUrl?: string;
  delay: number;
  category: string;
  status: string;
  date: string;
  featured: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Cyber-Security",
    "Digital-Forensics",
    "Monitoring",
    "Cyber-Intelligence",
    "Ethical-Hacking",
    "Artificial-Intelligence",
    "Data-Science",
    "Software-Engineering",
    "Others"
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data.projects);
        setFilteredProjects(data.projects);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setError("Failed to load projects. Please try again later.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  if (loading) {
    return (
      <main className="pt-24 bg-[#0A0A0A] min-h-screen">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-8">
            <h2 className="text-xl md:text-2xl text-zinc-100">Loading projects...</h2>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 bg-[#0A0A0A] min-h-screen">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-8">
            <h2 className="text-xl md:text-2xl text-red-400">{error}</h2>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md border border-zinc-800/50"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 bg-[#0A0A0A] relative">
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="container mx-auto px-4 mb-16 relative">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-md bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 text-sm font-medium mb-4">
            PORTFOLIO
          </span>
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">
            Our Projects
          </h1>
          <p className="text-zinc-500 max-w-3xl mx-auto">
            Innovative cybersecurity solutions designed to address complex security challenges in various domains.
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-xl mb-3 text-zinc-100">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 text-sm rounded-md ${
                    selectedCategory === category
                      ? "bg-zinc-800 text-zinc-100 border border-zinc-700/50"
                      : "bg-zinc-900/50 text-zinc-400 border border-zinc-800/50 hover:bg-zinc-800/50"
                  }`}
                >
                  {category.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl text-zinc-500">No projects found in this category.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.slug}
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg overflow-hidden group"
              >
                <div className="overflow-hidden relative">
                  <Image
                    src={project.imageUrl || project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-70"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-medium text-zinc-100 mb-3">{project.title}</h3>
                  <p className="text-zinc-400 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link 
                    href={`/projects/${project.slug}`} 
                    className="inline-block mt-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md border border-zinc-800/50"
                  >
                    View Project Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 