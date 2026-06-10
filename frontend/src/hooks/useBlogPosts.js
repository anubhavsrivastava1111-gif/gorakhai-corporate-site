import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { BLOG_POSTS } from '@/constants/mockData';

export function useBlogPosts({ category = null, limit = 50, published = true } = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured || !supabase) {
        // Use mock data
        let filtered = BLOG_POSTS;
        if (category) filtered = filtered.filter(p => p.category === category);
        if (limit) filtered = filtered.slice(0, limit);
        setPosts(filtered);
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('blog_posts')
          .select(`*, category:blog_categories(name, slug, color)`)
          .order('published_at', { ascending: false });

        if (published) query = query.eq('status', 'published');
        if (category) query = query.eq('blog_categories.slug', category);
        if (limit) query = query.limit(limit);

        const { data, error: err } = await query;
        if (err) throw err;
        setPosts(data || []);
      } catch (err) {
        console.error('useBlogPosts error:', err);
        setError(err.message);
        setPosts(BLOG_POSTS); // Fallback to mock
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

      if (!isSupabaseConfigured || !supabase) {
        const found = BLOG_POSTS.find(p => p.slug === slug);
        setPost(found || null);
        setLoading(false);
        return;
      }

      try {
        const { data, error: err } = await supabase
          .from('blog_posts')
          .select(`*, category:blog_categories(name, slug, color)`)
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (err) throw err;
        setPost(data);

        // Increment view count
        if (data) {
          await supabase
            .from('blog_posts')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id);
        }
      } catch (err) {
        console.error('useBlogPost error:', err);
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
