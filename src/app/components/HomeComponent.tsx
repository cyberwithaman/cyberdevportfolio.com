"use client";

import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faLaptopCode,
  faBrain,
  faRocket,
  faArrowRight,
  faNewspaper,
  faDiagramProject,
} from "@fortawesome/free-solid-svg-icons";
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

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  content: string;
}

const HomeComponent = () => {
  const [text, setText] = useState("");
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const phrases = useMemo(() => [
    "Artificial Intelligence",
    "Machine Learning",
    "Penetration Testing",
    "Full Stack Engineer",
    "Full Stack Web Engineer",
    "Full Stack Mobile Engineer",
    "Software Engineer",
    "Problem Solver",
    "Expert Researcher & Scientist",    
  ], []);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 50 : 150;
    const deletingSpeed = 50;

    const handleTyping = () => {
      if (!isDeleting && text === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        return;
      }

      const delta = isDeleting ? -1 : 1;
      setText(currentPhrase.substring(0, text.length + delta));
    };

    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [text, phraseIndex, isDeleting, phrases]);

  // Fetch featured projects and latest posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, postsRes] = await Promise.all([
          fetch('/api/projects?featured=true&limit=3'),
          fetch('/api/blog?limit=3')
        ]);

        const [projectsData, postsData] = await Promise.all([
          projectsRes.json(),
          postsRes.json()
        ]);

        setFeaturedProjects(projectsData.posts || []);
        setLatestPosts(postsData.posts || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const skills = [
    {
      icon: faCode,
      title: "Clean Code",
      description: "Writing maintainable and scalable code that stands the test of time"
    },
    {
      icon: faLaptopCode,
      title: "Modern Tech",
      description: "Mastering the latest frameworks and technologies to build cutting-edge solutions"
    },
    {
      icon: faBrain,
      title: "Problem Solving",
      description: "Turning complex challenges into elegant, efficient solutions"
    },
    {
      icon: faRocket,
      title: "Performance",
      description: "Optimizing applications for speed, scalability, and user experience"
    }
  ];

  const stats = [
    { label: "Years Experience", value: "2+" },
    { label: "Projects Completed", value: "20+" },
    { label: "Happy Clients", value: "5+" },
    { label: "Certifications", value: "10+" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#111111] relative overflow-hidden">
      {/* Enhanced tech grid background with gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A] pointer-events-none" />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative">
        <div className="nextjs-container py-24">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 relative">
              <span className="inline-block px-4 py-1 rounded-md bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-lg">
                PORTFOLIO
              </span>
              {/* Decorative dot */}
              <div className="absolute -right-2 -top-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 mb-6">
              Hi, I&apos;m Aman Anil
            </h1>
            <div className="h-12 mb-8 relative">
              <span className="text-xl text-zinc-400">
                I&apos;m a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 font-medium">
                  {text}
                  <span className="text-blue-500 animate-pulse">|</span>
                </span>
              </span>
              {/* Decorative line */}
              <div className="absolute -left-4 top-1/2 w-2 h-12 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full" />
            </div>
            <p className="text-zinc-400 text-lg mb-12 max-w-2xl leading-relaxed">
              I&apos;m a passionate developer specializing in full-stack development, cybersecurity, and AI research. With expertise in building secure, scalable applications and implementing AI-driven security solutions, I focus on creating robust systems that protect against emerging threats. My work combines cutting-edge technology with practical security measures to deliver innovative solutions that make a real impact.
            </p>

            {/* Stats Section with enhanced styling */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="group bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10">
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-1 group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group px-6 py-2.5 text-sm font-medium text-zinc-100 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 flex items-center"
              >
                Let&apos;s Connect
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="group px-6 py-2.5 text-sm font-medium text-zinc-300 border border-zinc-700/50 rounded-md hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all duration-300 flex items-center"
              >
                View Projects
                <FontAwesomeIcon icon={faDiagramProject} className="ml-2 w-3 h-3 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section with enhanced styling */}
      <section className="py-24 relative">
        <div className="nextjs-container">
          <div className="text-center mb-16 relative">
            <span className="inline-block px-4 py-1 rounded-md bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-lg mb-4">
              EXPERTISE
            </span>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 mb-4">
              Core Expertise
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Combining technical excellence with innovative problem-solving to deliver exceptional results.
            </p>
            {/* Decorative elements */}
            <div className="absolute -left-4 top-1/2 w-1 h-12 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full" />
            <div className="absolute -right-4 top-1/2 w-1 h-12 bg-gradient-to-b from-blue-500/50 to-transparent rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {skills.map((skill) => (
              <div
                key={skill.title}
                className="group bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                  <FontAwesomeIcon
                    icon={skill.icon}
                    className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors"
                  />
                </div>
                <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300 mb-2 group-hover:from-blue-300 group-hover:to-blue-400 transition-all duration-300">
                  {skill.title}
                </h3>
                <p className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section with enhanced styling */}
      <section className="py-24 relative">
        <div className="nextjs-container">
          <div className="text-center mb-16 relative">
            <span className="inline-block px-4 py-1 rounded-md bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-lg mb-4">
              PROJECTS
            </span>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 mb-4">
              Featured Projects
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Explore some of my recent work in web development, cybersecurity, and AI research.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-zinc-400">Loading projects...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredProjects.map((project) => (
                <div
                  key={project.slug}
                  className="group bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm"
                >
                  <div className="relative h-48 border-b border-zinc-700/50 overflow-hidden">
                    <Image
                      src={project.imageUrl || project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300 mb-2 group-hover:from-blue-300 group-hover:to-blue-400 transition-all duration-300">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 group-hover:text-zinc-300 transition-colors">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 rounded-md group-hover:border-blue-500/50 group-hover:text-zinc-300 transition-all duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center group-hover:translate-x-1 transition-all duration-300"
                    >
                      View Project
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="group px-6 py-2.5 text-sm font-medium text-zinc-300 border border-zinc-700/50 rounded-md hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all duration-300 inline-flex items-center"
            >
              View All Projects
              <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section with enhanced styling */}
      <section className="py-24 relative">
        <div className="nextjs-container">
          <div className="text-center mb-16 relative">
            <span className="inline-block px-4 py-1 rounded-md bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-lg mb-4">
              INSIGHTS
            </span>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 mb-4">
              Latest Insights
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Recent articles and research on cybersecurity, AI, and software development.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-zinc-400">Loading posts...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {latestPosts.map((post) => (
                <div
                  key={post.slug}
                  className="group bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                      <FontAwesomeIcon icon={faNewspaper} className="w-3 h-3 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </div>
                    <span className="group-hover:text-zinc-300 transition-colors">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-300 mb-2 group-hover:from-blue-300 group-hover:to-blue-400 transition-all duration-300">
                    {post.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2 group-hover:text-zinc-300 transition-colors">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center group-hover:translate-x-1 transition-all duration-300"
                  >
                    Read More
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="group px-6 py-2.5 text-sm font-medium text-zinc-300 border border-zinc-700/50 rounded-md hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all duration-300 inline-flex items-center"
            >
              View All Posts
              <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeComponent;