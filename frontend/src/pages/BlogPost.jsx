import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useBlogPost, useBlogPosts } from '@/hooks/useBlogPosts';
import NewsletterForm from '@/components/sections/NewsletterForm';
import '@/components/editor/tiptap.css';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogPost() {
  const { slug } = useParams();
  const { post, loading } = useBlogPost(slug);
  const { posts: allPosts } = useBlogPosts({ limit: 4 });
  const related = allPosts.filter(p => p.slug !== slug).slice(0, 3);

  useEffect(() => {
    if (post) document.title = `${post.title} — Gorakhai Blog`;
  }, [post]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-lg font-medium">Post not found</p>
        <Link to="/blog" className="text-[#002FA7] text-sm mt-2 inline-block hover:underline">Back to Blog</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[#050505] text-white">
      {/* BACK */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>

      {/* HEADER */}
      <header className="max-w-4xl mx-auto px-6 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-[#002FA7]/10 border border-[#002FA7]/20 px-2.5 py-1 rounded-full text-xs text-[#002FA7] mb-4">
            {post.category}
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#002FA7]/10 border border-[#002FA7]/20 rounded-full flex items-center justify-center text-xs font-bold text-[#002FA7]">
                {post.author_avatar}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{post.author_name}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-zinc-500">
              <Calendar size={13} /> {formatDate(post.published_at)}
            </div>
            <div className="flex items-center gap-1 text-sm text-zinc-500">
              <Clock size={13} /> {post.read_time_mins} min read
            </div>
          </div>
        </motion.div>
      </header>

      {/* COVER IMAGE */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl overflow-hidden border border-zinc-900"
        >
          <img src={post.cover_image_url} alt={post.title} className="w-full h-80 object-cover" />
        </motion.div>
      </div>

      {/* CONTENT */}
      <article className="max-w-3xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-lg text-zinc-400 leading-relaxed mb-8">{post.excerpt}</p>
          <div
            className="tiptap-prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        {/* TAGS */}
        {post.tags && (
          <div className="mt-12 pt-8 border-t border-zinc-900">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* NEWSLETTER CTA */}
      <section className="py-16 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="font-heading text-xl font-semibold text-white mb-2">More insights like this</h3>
          <p className="text-sm text-zinc-500 mb-6">Subscribe to the Gorakhai newsletter for weekly AI intelligence.</p>
          <NewsletterForm />
        </div>
      </section>

      {/* RELATED POSTS */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <h3 className="font-heading text-xl font-bold text-white mb-6">Related Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map((relPost) => (
            <Link
              key={relPost.id}
              to={`/blog/${relPost.slug}`}
              className="group block bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
            >
              <img src={relPost.cover_image_url} alt={relPost.title} className="w-full h-36 object-cover opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="p-5">
                <div className="text-xs text-zinc-600 mb-2">{relPost.category}</div>
                <h4 className="font-heading text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-zinc-200">
                  {relPost.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
