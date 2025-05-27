import { Metadata } from 'next';
import BlogSlug from '@/app/components/Blog/BlogSlug';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { notFound } from 'next/navigation';
import Script from "next/script";
import { headers } from 'next/headers';
import RelatedBlog from '@/app/components/Blog/RelatedBlog';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await Blog.findOne({ slug });

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  // Get the current user's role from headers
  const headersList = await headers();
  const userRole = headersList.get('x-user-role');

  // If not admin, return minimal metadata
  if (userRole !== 'admin') {
    return {
      title: post.title + ' | AI-SecOps Research',
      description: post.excerpt + ' | AI-SecOps Research'
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image.url] : [],
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: post.createdBy ? [post.createdBy] : [],
      tags: post.tags || []
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image.url] : []
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const post = await Blog.findOne({ slug });

  if (!post) {
    notFound();
  }

  return (
    <>
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title || "Loading...",
            "image": post.image?.url || "Loading...",
            "author": {
              "@type": "Person",
              "name": post.createdBy || "Loading..."
            },
            "publisher": {
              "@type": "Organization",
              "name": "AI-SecOps Research",
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
              }
            },
            "datePublished": post.createdAt || "Loading...",
            "dateModified": post.updatedAt || "Loading...",
            "description": post.excerpt || "Loading..."
          })
        }}
      />
      <BlogSlug slug={slug} />
      <RelatedBlog currentPostId={post._id} category={post.category} />
    </>
  );
} 