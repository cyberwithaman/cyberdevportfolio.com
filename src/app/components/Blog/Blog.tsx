"use client";

// import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogPost {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: {
    url: string;
    filename: string;
    contentType: string;
  };
  createdBy: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const postsPerPage = 6;
  const categories = ["All", "Cyber-Security", "Digital-Forensics", "Monitoring", "Cyber-Intelligence", "Ethical-Hacking", "Artificial-Intelligence", "Data-Science", "Software-Engineering", "Others"];

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/blog?page=${currentPage}&limit=${postsPerPage}&category=${activeFilter !== "All" ? activeFilter : ""}&search=${searchQuery}`);
        const data = await response.json();
        
        // Check if data is an array (old format) or has posts property (new format)
        if (Array.isArray(data)) {
          setPosts(data);
          setTotalPages(Math.ceil(data.length / postsPerPage));
        } else if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
          setTotalPages(Math.ceil(data.total / postsPerPage));
        } else {
          setPosts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    // Add debounce to search
    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPage, activeFilter, searchQuery]);

  // Filter posts by category
  const filterPosts = async (category: string) => {
    setActiveFilter(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-zinc-400">
          Loading secure data...
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="nextjs-container relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-md bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 text-sm font-medium mb-4">
            RESEARCH & INSIGHTS
          </span>
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">
            Knowledge Base
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Cutting-edge research, security insights, and advanced techniques to stay ahead of emerging threats.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => filterPosts(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeFilter === category
                    ? 'bg-zinc-900 text-zinc-100 border border-zinc-800/50'
                    : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800/50 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div
              key={post.id || post._id || index}
              className="bg-zinc-900/50 border border-zinc-800/50 rounded-md overflow-hidden backdrop-blur-sm hover:border-zinc-700/50 transition-colors duration-200"
            >
              <div className="relative">
                <div
                  className="w-full aspect-[16/9] bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.image.url})` }}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-medium bg-zinc-900/80 text-zinc-300 border border-zinc-800/50 rounded-md">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="text-zinc-500 text-sm mb-2">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <h3 className="text-xl font-medium text-zinc-100 mb-3">
                  {post.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  {post.excerpt}
                </p>
                <Link href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-zinc-300 hover:text-zinc-100 transition-colors duration-200 text-sm font-medium">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                currentPage === 1
                  ? 'bg-zinc-900/30 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-900/50 text-zinc-300 border border-zinc-800/50 hover:bg-zinc-800/50'
              }`}
            >
              Previous
            </button>

            <span className="text-zinc-400 text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'bg-zinc-900/30 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-900/50 text-zinc-300 border border-zinc-800/50 hover:bg-zinc-800/50'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 text-center">
          <p className="text-zinc-400 mb-6">
            Looking for specialized security insights? Our research team regularly publishes cutting-edge analysis.
          </p>
          <div className="inline-flex">
            <Link href="/contact"
              className="px-6 py-3 bg-zinc-900 text-zinc-100 font-medium rounded-md border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors duration-200">
              Request Custom Research
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;