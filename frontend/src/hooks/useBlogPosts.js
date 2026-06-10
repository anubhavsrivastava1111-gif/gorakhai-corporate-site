import { useState, useEffect } from 'react';
import { BLOG_POSTS } from '@/constants/mockData';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export function useBlogPosts({ category = null, limit = 50, published = true } = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit });
        if (category && category !== 'All') params.set('category', category);
        const res = await fetch(`${API_BASE}/api/public/blog?${params}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('useBlogPosts error:', err);
        setError(err.message);
        // Fallback to mock
        let filtered = BLOG_POSTS;
        if (category && category !== 'All') filtered = filtered.filter(p => p.category === category);
        if (limit) filtered = filtered.slice(0, limit);
        setPosts(filtered);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [category, limit, published]);

  return { posts, loading, error };
}

export function useBlogPost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    async function fetchPost() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/public/blog/${slug}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
        setPost(BLOG_POSTS.find(p => p.slug === slug) || null);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  return { post, loading, error };
}
