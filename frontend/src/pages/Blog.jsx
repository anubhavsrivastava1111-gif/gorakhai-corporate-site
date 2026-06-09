import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/constants/mockData';
import { BLOG } from '@/constants/testIds';
import NewsletterForm from '@/components/sections/NewsletterForm';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Blog() {
  useEffect(() => { document.title = 'Blog — Gorakhai'; }, []);

  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  const featured = BLOG_POSTS[0];
  const rest = filtered.slice(activeCategory === 'All' ? 1 : 0);

  return (
    <div className="bg-[#050505] text-white">
      {/* HEADER */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4">Journal</p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
            Insights &<br /><span className="text-[#002FA7]">Intelligence</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl">
            Research, product updates, and frameworks from the Gorakhai team.
          </p>
        </motion.div>
      </section>

      {/* FEATURED POST */}
      {activeCategory === 'All' && (
        <section className="pb-12 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to={`/blog/${featured.slug}`}
              data-testid={BLOG.featuredPost}
              className="group block"
            >
              <div className="relative bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-7 relative">
                    <img
                      src={featured.cover_image_url}
                      alt={featured.title}
                      className="w-full h-72 md:h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950/80" />
                  </div>
                  <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-[#002FA7]/10 border border-[#002FA7]/20 px-2.5 py-1 rounded-full text-xs text-[#002FA7] mb-4 w-fit">
                      {featured.category}
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-white leading-tight mb-3 group-hover:text-zinc-200 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-600">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-[#002FA7]/20 rounded-full flex items-center justify-center text-[8px] font-bold text-[#002FA7]">
                          {featured.author_avatar}
                        </div>
                        <span>{featured.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1"><Calendar size={12} />{formatDate(featured.published_at)}</div>
                      <div className="flex items-center gap-1"><Clock size={12} />{featured.read_time_mins} min read</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* CATEGORY FILTER */}
      <section className="pb-8 max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-2" data-testid={BLOG.categoryFilter}>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                data-testid={`${BLOG.postCard}-${post.id}`}
                className="group block bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-44 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="p-6">
                  <div className="inline-flex text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-full mb-3">
                    {post.category}
                  </div>
                  <h3 className="font-heading text-base font-semibold text-white leading-snug mb-2 group-hover:text-zinc-200 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-zinc-600">
                    <span>{post.author_name}</span>
                    <span>·</span>
                    <span>{post.read_time_mins} min</span>
                    <span>·</span>
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-500">No articles in this category yet.</div>
        )}
      </section>

      {/* NEWSLETTER CTA */}
      <section className="py-16 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="font-heading text-xl font-semibold text-white mb-2">Never miss an insight</h3>
          <p className="text-sm text-zinc-500 mb-6">Join 3,000+ enterprise AI practitioners. New articles every week.</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
