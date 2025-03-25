import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllPosts } from '../data/posts';
import { BlogPost as BlogPostType } from '../types/blog';
import { ArrowLeft, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllPosts().then((posts) => {
      const foundPost = posts.find(p => p.slug === slug);
      setPost(foundPost || null);
      setLoading(false);
      
      if (!foundPost) {
        navigate('/blog', { replace: true });
      }
    }).catch((err) => {
      setError('Unable to load blog post');
      setLoading(false);
    });
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  // Remove the title from the content to avoid duplication
  const contentWithoutTitle = post.content.replace(/^#\s+.*$/m, '').trim();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <Link 
        to="/blog"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>
      
      <article className="bg-white rounded-lg shadow-sm p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>
        
        <div className="prose prose-lg prose-slate max-w-none">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <div className="my-8">
                  <img
                    {...props}
                    className="rounded-lg shadow-md w-full h-auto"
                    alt={props.alt || 'Blog post image'}
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image failed to load:', props.src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="text-3xl font-semibold mt-12 mb-6" />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-2xl font-semibold mt-8 mb-4" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="text-gray-700 leading-relaxed mb-6" />
              ),
              a: ({ node, ...props }) => (
                <a {...props} className="text-blue-600 hover:text-blue-800 underline" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc list-inside mb-6" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal list-inside mb-6" />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="mb-2" />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="border-l-4 border-gray-200 pl-4 italic my-6" />
              ),
            }}
          >
            {contentWithoutTitle}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;