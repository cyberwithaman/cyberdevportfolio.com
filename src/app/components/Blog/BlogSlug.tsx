"use client";

// import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  image: {
    url: string;
    filename: string;
    contentType: string;
  };
  tags: string[];
  createdBy: string;
}

interface BlogSlugProps {
  slug?: string;
}

const BlogSlug = ({ slug }: BlogSlugProps) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  // Share functionality
  const handleShare = async (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        // Show a temporary success message
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Link copied to clipboard!';
        successMessage.className = 'fixed bottom-4 right-4 bg-[var(--primary)] text-black px-4 py-2 rounded-sm z-50';
        document.body.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 2000);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Update structured data when post loads
  useEffect(() => {
    if (post) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.image.url,
        "author": {
          "@type": "Person",
          "name": post.createdBy
        },
        "publisher": {
          "@type": "Organization",
          "name": "AI-SecOps Research",
          "logo": {
            "@type": "ImageObject",
            "url": "/logo.png"
          }
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "description": post.excerpt,
        "keywords": post.tags.join(", "),
        "articleBody": post.content
      };

      // Update the structured data script
      const script = document.getElementById('blog-structured-data');
      if (script) {
        script.textContent = JSON.stringify(structuredData);
      }
    }
  }, [post]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        // Fetch main post
        const response = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setPost(data[0]);
          
          // Fetch related posts from same category
          const relatedResponse = await fetch(`/api/blog?category=${encodeURIComponent(data[0].category)}`);
          const relatedData = await relatedResponse.json();
          
          // Filter out the current post and limit to 2 related posts
          setRelatedPosts(
            relatedData
              .filter((p: BlogPost) => p.id !== data[0].id)
              .slice(0, 2)
          );
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-zinc-400">
          Loading secure data...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#0A0A0A]">
        <h1 className="text-3xl font-medium text-zinc-100 mb-4">Content Not Found</h1>
        <p className="text-zinc-400 mb-6">The requested article could not be found or does not exist.</p>
        <Link href="/blog" className="px-6 py-3 bg-zinc-900 text-zinc-100 font-medium rounded-md border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors duration-200">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="nextjs-container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm flex items-center text-zinc-500">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-zinc-300">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-300">{post.title}</span>
          </div>

          {/* Post Header */}
          <div className="mb-8">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-zinc-900/80 text-zinc-300 border border-zinc-800/50 rounded-md mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-medium text-zinc-100 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-between text-zinc-400 text-sm mb-8">
                <div className="flex items-center space-x-4">
                  <div className="text-zinc-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-zinc-500">
                    {calculateReadingTime(post.content)} min read
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-300 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative mb-12 bg-zinc-900/50 border border-zinc-800/50 rounded-md overflow-hidden">
              <div className="w-full">
                <Image 
                  src={post.image.url} 
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-invert mx-auto max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-400 prose-a:text-zinc-300 prose-strong:text-zinc-200 prose-code:text-zinc-300 prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800/50"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          {/* Tags */}
          <div className="mt-10 mb-16 border-t border-zinc-800/50 pt-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-sm bg-zinc-900/50 text-zinc-400 border border-zinc-800/50 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-16 border-t border-zinc-800/50 pt-8">
            <h2 className="text-2xl font-medium text-zinc-100 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block"
                >
                  <div className="relative mb-4 overflow-hidden bg-zinc-900/50 border border-zinc-800/50 rounded-md">
                    <div className="w-full">
                      <Image 
                        src={relatedPost.image.url}
                        alt={relatedPost.title}
                        width={600}
                        height={300}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-100 mb-2 group-hover:text-zinc-300 transition-colors duration-200">
                    {relatedPost.title}
                  </h3>
                  <div className="text-sm text-zinc-500">
                    {new Date(relatedPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-zinc-900 text-zinc-100 font-medium rounded-md border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Articles
            </Link>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-zinc-900/95 p-6 rounded-md max-w-md w-full mx-4 border border-zinc-800/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-zinc-100">Share Article</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-zinc-400 hover:text-zinc-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center space-x-2 p-3 bg-zinc-800 text-zinc-100 rounded-md hover:bg-zinc-700 transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Twitter</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center justify-center space-x-2 p-3 bg-zinc-800 text-zinc-100 rounded-md hover:bg-zinc-700 transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center space-x-2 p-3 bg-zinc-800 text-zinc-100 rounded-md hover:bg-zinc-700 transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center space-x-2 p-3 bg-zinc-800 text-zinc-100 rounded-md hover:bg-zinc-700 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSlug; 