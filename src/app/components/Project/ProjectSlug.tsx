"use client";

import { useEffect, useState } from 'react';
// import { motion } from "framer-motion";
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
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const slug = params.slug as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="pt-16 md:pt-24 min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-8">
          <h2 className="text-lg md:text-xl text-zinc-100">Loading project details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 md:pt-24 min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-8">
          <h2 className="text-lg md:text-xl text-red-400">{error}</h2>
          <button
            onClick={() => router.push('/projects')}
            className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md border border-zinc-800/50"
          >
            Return to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-16 md:pt-24 min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-8">
          <h2 className="text-lg md:text-xl text-zinc-100">Project not found</h2>
          <Link href="/projects" className="mt-4 inline-block px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md border border-zinc-800/50">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-16 md:pt-24 min-h-screen bg-[#0A0A0A] relative">
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 md:p-8 max-w-md w-full m-4 relative">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-medium text-zinc-100">Request Demo Access</h2>
              <button
                onClick={handleCloseModal}
                className="text-zinc-400 hover:text-zinc-300 p-2"
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
                  className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
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
                  className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
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
                  className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                  placeholder="Your Phone Number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 min-h-[100px]"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md border border-zinc-800/50 font-medium"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-16 relative">
        <Link href="/projects" className="inline-flex items-center mb-6 md:mb-8 px-3 py-2 md:px-4 md:py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md border border-zinc-800/50 text-sm md:text-base">
          <span className="mr-1">←</span> Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg overflow-hidden">
              <div className="overflow-hidden relative rounded-lg">
                <Image
                  src={project.imageUrl || project.image}
                  alt={project.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/20 opacity-80"></div>
                <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm px-3 py-1 rounded-md border border-zinc-800/50 text-zinc-300 text-xs uppercase tracking-wider">{project.status}</div>
              </div>

              <div className="p-4 md:p-8">
                <h1 className="text-xl sm:text-2xl md:text-4xl font-medium text-zinc-100 mb-4">{project.title}</h1>
                <p className="text-zinc-400 text-sm md:text-lg mb-6 md:mb-8">{project.longDescription}</p>

                <h2 className="text-lg md:text-2xl font-medium text-zinc-100 mb-4">Key Features</h2>
                <ul className="mb-6 md:mb-8 space-y-2">
                  {project.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-zinc-400 mr-2 flex-shrink-0">›</span>
                      <span className="text-zinc-400 text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4 md:p-6 lg:sticky lg:top-20">
              <h2 className="text-lg md:text-xl font-medium text-zinc-100 mb-4">Project Details</h2>

              <div className="mb-4 md:mb-6">
                <h3 className="text-sm uppercase text-zinc-400 mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 md:px-3 py-1 text-xs md:text-sm bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <h3 className="text-sm uppercase text-zinc-400 mb-2">Status</h3>
                <p className="text-zinc-300">{project.status}</p>
              </div>

              <div className="mb-4 md:mb-6">
                <h3 className="text-sm uppercase text-zinc-400 mb-2">Category</h3>
                <p className="text-zinc-300">{project.category}</p>
              </div>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mb-4 flex items-center justify-center px-4 py-2 md:py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md border border-zinc-800/50 font-medium text-sm md:text-base"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              )}

              <button
                onClick={handleRequestDemo}
                className="w-full px-4 py-2 md:py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md border border-zinc-800/50 font-medium text-sm md:text-base"
              >
                Request Demo Access
              </button>
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