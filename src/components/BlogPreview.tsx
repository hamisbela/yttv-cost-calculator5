import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../data/posts';
import { BlogPost } from '../types/blog';
import { Calendar, PenLine } from 'lucide-react';

const BlogPreview: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllPosts()
      .then((fetchedPosts) => {
        setPosts(fetchedPosts.slice(0, 2)); // Only show latest 2 posts
        setLoading(false);
      })
      .catch((err) => {
        setError('Unable to load blog posts');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest from our Blog</h2>
          <Link 
            to="/blog"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all posts →
          </Link>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <PenLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No blog posts available yet.</p>
          <p className="text-gray-500 text-sm mt-2">Check back soon for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Latest from our Blog</h2>
        <Link 
          to="/blog"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View all posts →
        </Link>
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white rounded-lg shadow-sm p-6">
            <Link to={`/blog/${post.slug}`} className="block hover:no-underline">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                {post.title}
              </h3>
              <div className="flex items-center text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              {post.excerpt && (
                <p className="text-gray-600">{post.excerpt}</p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPreview;