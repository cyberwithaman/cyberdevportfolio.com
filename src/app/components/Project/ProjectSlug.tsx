"use client";

import { useEffect, useState } from 'react';
import Image from "next/image";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RelatedProjects from './RelatedProjects';

// Define the Project type
interface Project {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  imageUrl?: string;
  delay: number;
  longDescription: string;
  features: string[];
  category: string;
  status: string;
  date: string;
  featured: boolean;
  githubUrl?: string;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const slug = params.slug as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            router.push('/projects');
            return;
          }
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setProject(data.project);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch project:", error);
        setError("Failed to load project details. Please try again later.");
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug, router]);

  const handleRequestDemo = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    try {
      const response = await fetch('/api/project-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          projectType: project?.title || 'Unknown Project',
          description: message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      // Close modal and show success message
      setIsModalOpen(false);
      alert('Your demo request has been submitted successfully. We will contact you soon!');

    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit your request. Please try again later.');
    }
  };
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0f0f23] relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/20 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
        </div>

        <div className="nextjs-container pt-32 flex justify-center items-center min-h-screen">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-8 backdrop-blur-sm shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <h2 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                  Loading project details...
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
        
        <div className="nextjs-container pt-32 flex justify-center items-center min-h-screen">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-30"></div>
            <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-8 backdrop-blur-sm shadow-xl">
              <h2 className="text-lg md:text-xl text-red-400 mb-4">{error}</h2>
              <button
                onClick={() => router.push('/projects')}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                Return to Projects
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (!project) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0f0f23] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
        
        <div className="nextjs-container pt-32 flex justify-center items-center min-h-screen">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg blur opacity-30"></div>
            <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-8 backdrop-blur-sm shadow-xl">
              <h2 className="text-lg md:text-xl text-zinc-400 mb-4">Project not found</h2>
              <Link 
                href="/projects" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                Back to Projects
              </Link>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30"></div>
            <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-6 md:p-8 max-w-md w-full m-4 backdrop-blur-sm shadow-xl">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Request Demo Access</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-zinc-400 hover:text-zinc-300 p-2 transition-colors"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleSubmitRequest}>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1" htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Your Phone Number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 min-h-[100px] transition-all duration-300"
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="nextjs-container pt-32 pb-16 relative z-10">
        <Link href="/projects" className="inline-flex items-center mb-6 md:mb-8 px-4 py-3 bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 hover:border-blue-500/50 text-zinc-300 hover:text-zinc-100 rounded-xl text-sm md:text-base font-medium transition-all duration-300 backdrop-blur-sm shadow-xl">
          <span className="mr-2">←</span> Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 transition-all duration-500"></div>
              <div className="overflow-hidden relative rounded-t-2xl">
                <Image
                  src={project.imageUrl || project.image}
                  alt={project.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent opacity-80"></div>
                <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-zinc-700/50 text-zinc-300 text-xs uppercase tracking-wider font-medium">{project.status}</div>
              </div>

              <div className="relative z-10 p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-blue-100 to-purple-100 mb-6">{project.title}</h1>
                <p className="text-zinc-400 text-base md:text-lg mb-8 leading-relaxed">{project.longDescription}</p>

                <h2 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-blue-100 mb-6">Key Features</h2>
                <ul className="mb-8 space-y-3">
                  {project.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-3 flex-shrink-0 text-lg">›</span>
                      <span className="text-zinc-400 text-sm md:text-base leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl p-6 md:p-8 lg:sticky lg:top-24 backdrop-blur-sm shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 hover:from-blue-600/5 hover:to-purple-600/5 rounded-2xl transition-all duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-blue-100 mb-6">Project Details</h2>

                <div className="mb-6">
                  <h3 className="text-sm uppercase text-zinc-400 mb-3 tracking-wider">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs md:text-sm bg-zinc-800/70 border border-zinc-700/50 text-zinc-300 rounded-full hover:border-blue-500/50 hover:text-zinc-200 hover:bg-zinc-700/70 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm uppercase text-zinc-400 mb-3 tracking-wider">Status</h3>
                  <p className="text-zinc-300 font-medium">{project.status}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm uppercase text-zinc-400 mb-3 tracking-wider">Category</h3>
                  <p className="text-zinc-300 font-medium">{project.category}</p>
                </div>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mb-4 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-zinc-800/90 to-zinc-700/90 hover:from-zinc-700/90 hover:to-zinc-600/90 text-zinc-100 rounded-xl border border-zinc-700/50 hover:border-blue-500/50 font-medium text-sm md:text-base transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View on GitHub
                  </a>
                )}

                <button
                  onClick={handleRequestDemo}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium text-sm md:text-base transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Request Demo Access
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add RelatedProjects component at the bottom */}
        {project && (
          <RelatedProjects
            currentProjectSlug={project.slug}
            currentCategory={project.category}
          />
        )}
      </div>
    </main>
  );
}