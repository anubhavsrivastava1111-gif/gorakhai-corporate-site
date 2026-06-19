import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { submitForm } from '@/lib/supabaseClient';
import { NEWSLETTER } from '@/constants/testIds';

export default function NewsletterForm({ variant = 'default' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      await submitForm('newsletter_subscribers', {
        email,
        source_page: window.location.pathname,
        subscribed_at: new Date().toISOString()
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        data-testid={NEWSLETTER.successMessage}
        className="flex items-center gap-3 text-green-400"
      >
        <CheckCircle2 size={20} />
        <span className="text-sm">You're subscribed. Welcome to the network.</span>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          data-testid={NEWSLETTER.emailInput}
          className={`flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7] transition-colors ${
            variant === 'large' ? 'py-3 text-base' : ''
          }`}
        />
        <button
          type="submit"
          data-testid={NEWSLETTER.submitButton}
          disabled={status === 'loading'}
          className="px-4 py-2.5 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-100 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
        >
          {status === 'loading' ? (
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Subscribe <ArrowRight size={14} /></>
          )}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
