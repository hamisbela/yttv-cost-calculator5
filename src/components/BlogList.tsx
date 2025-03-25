import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../data/posts';
import { BlogPost } from '../types/blog';
import { PenLine } from 'lucide-react';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllPosts()
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
        setLoading(false);
      })
      .catch((err) => {
        setError('Unable to load blog posts');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
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

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Posts</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <PenLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No blog posts available yet.</p>
          <p className="text-gray-500 text-sm mt-2">Check back soon for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white rounded-lg shadow-sm p-6">
            <Link to={`/blog/${post.slug}`} className="block hover:no-underline">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-gray-600">{post.excerpt}</p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogList