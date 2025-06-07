"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faDiagramProject,
  faFilter,
  faSearch} from "@fortawesome/free-solid-svg-icons";

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

export default function ProjectsPage() {  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [scrollY, setScrollY] = useState(0);

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

  // Scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0f0f23] relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
        
        <div className="nextjs-container pt-32 flex justify-center items-center min-h-screen">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-8 backdrop-blur-sm shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <h2 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                  Loading amazing projects...
                </h2>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0f0f23] relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
        
        <div className="nextjs-container pt-32 flex justify-center items-center min-h-screen">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-30"></div>
            <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-8 backdrop-blur-sm shadow-xl">
              <h2 className="text-xl md:text-2xl text-red-400 mb-4">{error}</h2>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0f0f23] relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/20 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-green-500/20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-xl animate-pulse"
          style={{ transform: `translateY(${-scrollY * 0.05}px)` }}
        />
      </div>

      <div className="nextjs-container pt-32 pb-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="inline-block mb-6">
            <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
              <FontAwesomeIcon icon={faDiagramProject} className="mr-2 w-3 h-3 text-blue-400" />
              PORTFOLIO
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-blue-100 to-purple-100 mb-6">
            Our Projects
          </h1>
          <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Innovative cybersecurity solutions designed to address complex security challenges in various domains.
          </p>
        </div>

        {/* Enhanced Filter Section */}
        <div className="mb-16 relative">
          <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 rounded-2xl transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faFilter} className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-blue-100 font-semibold">
                  Filter by Category
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 backdrop-blur-sm ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 hover:border-blue-500/50 hover:bg-zinc-700/50 hover:text-zinc-200"
                    }`}
                  >
                    {category.replace(/-/g, " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg blur opacity-30"></div>
              <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-8 backdrop-blur-sm shadow-xl">
                <FontAwesomeIcon icon={faSearch} className="w-12 h-12 text-zinc-400 mb-4" />
                <h3 className="text-xl text-zinc-400 font-medium">No projects found in this category.</h3>
                <p className="text-zinc-500 mt-2">Try selecting a different category to explore more projects.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {filteredProjects.map((project, index) => (
              <div
                key={project.slug}
                className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500"></div>
                <div className="relative h-64 border-b border-zinc-700/50 overflow-hidden">
                  <Image
                    src={project.imageUrl || project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm px-3 py-1 rounded-md border border-zinc-800/50 text-zinc-300 text-xs uppercase tracking-wider font-medium">
                    {project.status}
                  </div>
                </div>

                <div className="relative z-10 p-8">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-blue-100 mb-3 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 text-base mb-6 group-hover:text-zinc-300 transition-colors leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-xs font-medium text-zinc-300 bg-zinc-800/70 border border-zinc-700/50 rounded-full group-hover:border-blue-500/50 group-hover:text-zinc-200 group-hover:bg-zinc-700/70 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link 
                    href={`/projects/${project.slug}`} 
                    className="inline-flex items-center text-base font-semibold text-blue-400 hover:text-blue-300 group-hover:translate-x-2 transition-all duration-300"
                  >
                    View Project Details
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-4 h-4" />
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