"use client";

import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faLaptopCode,
  faBrain,
  faRocket,
  faArrowRight,
  faDiagramProject,
  faGraduationCap,
  faShieldAlt,
  faCog,
  faLightbulb,
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



const Home = () => {
  const [text, setText] = useState("");
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const phrases = useMemo(() => [
    "Artificial Intelligence & Data Science Researcher & Scientist",
    "Cyber Crime & Security Research & Scientist",
    "Penetration Testing",
    "Bug Bounty Hunter",
    "Principal Architect",
    "Problem Solver",
  ], []);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Fetch featured projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsRes = await fetch('/api/projects?featured=true&limit=3');
        const projectsData = await projectsRes.json();

        setFeaturedProjects(projectsData.posts || []);
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
      description: "Writing maintainable and scalable code that stands the test of time",
      gradient: "from-emerald-400 to-teal-600"
    },
    {
      icon: faLaptopCode,
      title: "Modern Tech",
      description: "Mastering the latest frameworks and technologies to build cutting-edge solutions",
      gradient: "from-purple-400 to-indigo-600"
    },
    {
      icon: faBrain,
      title: "Problem Solving",
      description: "Turning complex challenges into elegant, efficient solutions",
      gradient: "from-orange-400 to-red-600"
    },
    {
      icon: faRocket,
      title: "Performance",
      description: "Optimizing applications for speed, scalability, and user experience",
      gradient: "from-blue-400 to-cyan-600"
    }
  ];

  const stats = [
    { label: "Years Experience", value: "2+", icon: faGraduationCap },
    { label: "Projects Completed", value: "20+", icon: faDiagramProject },
    { label: "Happy Clients", value: "5+", icon: faLightbulb },
    { label: "Certifications", value: "10+", icon: faShieldAlt }
  ];

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated floating orbs */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/20 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-green-500/20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-60 right-1/3 w-5 h-5 bg-yellow-500/20 rounded-full animate-ping" style={{ animationDelay: '3s' }} />

      {/* Gradient orbs with subtle movement */}
      <div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-xl animate-pulse"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-xl animate-pulse"
        style={{ transform: `translateY(${-scrollY * 0.05}px)` }}
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0f0f23] relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none" />

      <FloatingElements />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative">
        <div className="nextjs-container py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Enhanced badge */}
            <div className="mb-12 relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <span className="relative inline-flex items-center px-6 py-2 rounded-lg bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                AVAILABLE FOR OPPORTUNITIES
              </span>
            </div>

            {/* Enhanced title with gradient animation */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 relative">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300 animate-gradient-x">
                Hi, I&apos;m Cyber Dev Portfolio
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </h1>

            {/* Enhanced typing animation */}
            <div className="h-16 mb-12 relative flex items-center justify-center">
              <div className="absolute -left-8 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <span className="text-2xl md:text-3xl text-zinc-300 font-light">
                I&apos;m a{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-semibold">
                    {text}
                  </span>
                  <span className="text-blue-400 animate-pulse font-thin">|</span>
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400/50 to-purple-400/50 scale-x-0 animate-pulse"></div>
                </span>
              </span>
              <div className="absolute -right-8 top-0 w-1 h-full bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 rounded-full animate-pulse"></div>
            </div>

            {/* Enhanced description */}
            <div className="relative mb-16">
              <p className="text-zinc-400 text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed relative z-10 backdrop-blur-sm">
                I&apos;m a passionate developer specializing in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-medium">Principal Architect</span>,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-medium">Cyber Crime & Security Research & Scientist</span>, and{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-medium">Artificial Intelligence & Data Science Research & Scientist</span>.
                With expertise in building secure, scalable applications and implementing AI-driven security solutions,
                I focus on creating robust systems that protect against emerging threats. My work combines cutting-edge
                technology with practical security measures to deliver innovative solutions that make a real impact.
              </p>
            </div>

            {/* Enhanced stats with icons and animations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-500 shadow-xl hover:shadow-blue-500/20 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 rounded-xl transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <FontAwesomeIcon icon={stat.icon} className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/contact"
                className="group relative px-8 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 flex items-center min-w-[200px] justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <span className="relative z-10">Let&apos;s Connect</span>
                <FontAwesomeIcon icon={faArrowRight} className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              <Link
                href="/projects"
                className="group px-8 py-4 text-base font-semibold text-zinc-300 border-2 border-zinc-700/50 rounded-xl hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all duration-300 flex items-center backdrop-blur-sm min-w-[200px] justify-center"
              >
                View Projects
                <FontAwesomeIcon icon={faDiagramProject} className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Skills Section */}
      <section className="py-32 relative">
        <div className="nextjs-container relative z-10">
          <div className="text-center mb-20 relative">
            <div className="inline-block mb-6">
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
                <FontAwesomeIcon icon={faCog} className="mr-2 w-3 h-3 text-blue-400" />
                CORE EXPERTISE
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-blue-100 to-purple-100 mb-6">
              What I Do Best
            </h2>
            <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Combining technical excellence with innovative problem-solving to deliver exceptional results
              that exceed expectations and drive meaningful impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {skills.map((skill, index) => (
              <div
                key={skill.title}
                className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-500 shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 rounded-2xl transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skill.gradient} bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon
                      icon={skill.icon}
                      className="h-7 w-7 text-white"
                    />
                  </div>
                  <h3 className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${skill.gradient} mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    {skill.title}
                  </h3>
                  <p className="text-zinc-400 text-base group-hover:text-zinc-300 transition-colors leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Projects Section */}
      <section className="py-32 relative">
        <div className="nextjs-container relative z-10">
          <div className="text-center mb-20 relative">
            <div className="inline-block mb-6">
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
                <FontAwesomeIcon icon={faDiagramProject} className="mr-2 w-3 h-3 text-purple-400" />
                FEATURED WORK
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-purple-100 to-pink-100 mb-6">
              Selected Projects
            </h2>
            <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Explore some of my recent work in web development, cybersecurity, and AI research,
              showcasing innovation and technical excellence.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
                <span className="text-zinc-300">Loading amazing projects...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.slug}
                  className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl hover:shadow-blue-500/20 backdrop-blur-sm hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500"></div>
                  <div className="relative h-56 border-b border-zinc-700/50 overflow-hidden">
                    <Image
                      src={project.imageUrl || project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  </div>
                  <div className="relative z-10 p-8">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-blue-100 mb-3 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-base mb-6 group-hover:text-zinc-300 transition-colors leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
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
                      Explore Project
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href="/projects"
              className="group inline-flex items-center px-8 py-4 text-base font-semibold text-zinc-300 border-2 border-zinc-700/50 rounded-xl hover:border-purple-500/50 hover:bg-zinc-800/50 transition-all duration-300 backdrop-blur-sm"
            >
              View All Projects
              <FontAwesomeIcon icon={faArrowRight} className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;