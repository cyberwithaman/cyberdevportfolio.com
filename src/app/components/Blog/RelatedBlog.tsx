"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { motion } from "framer-motion";

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: {
    url: string;
    filename: string;
    contentType: string;
  };
  createdAt: string;
  createdBy: string;
}

interface RelatedBlogProps {
  currentPostId: string;
  category: string;
}

const RelatedBlog = ({ currentPostId, category }: RelatedBlogProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // Fetch posts from the same category
        const response = await fetch(`/api/blog?category=${encodeURIComponent(category)}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Filter out the current post and take top 3 related posts
          const relatedPosts = data
            .filter((post: BlogPost) => post._id !== currentPostId)
            .sort((a: BlogPost, b: BlogPost) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 3);
            
          setPosts(relatedPosts);
        }
      } catch (err) {
        console.error("Error fetching related posts:", err);
        setError("Failed to load related posts");
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchRelatedPosts();
    }
  }, [category, currentPostId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-4 border-zinc-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading related posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-md p-8 text-center">
        <p className="text-zinc-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-zinc-900 text-zinc-100 rounded-md border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-md p-8 text-center">
        <p className="text-zinc-400">No related posts found in this category</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium text-zinc-100 mb-6">
        Related Posts in {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-zinc-900/50 border border-zinc-800/50 rounded-md overflow-hidden backdrop-blur-sm hover:border-zinc-700/50 transition-colors duration-200"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="relative h-48 w-full">
                <Image
                  src={post.image.url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-zinc-900/80 text-zinc-300 text-sm rounded-md border border-zinc-800/50">
                    {post.category}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-zinc-100 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">
                    By {post.createdBy}
                  </span>
                  <span className="text-zinc-300 text-sm font-medium">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlog;
