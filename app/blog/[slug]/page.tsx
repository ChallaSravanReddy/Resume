'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCalendar, FiTag, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { marked } from 'marked';

interface Blog {
  title: string;
  date: string;
  tags: string[];
  content: string;
  excerpt: string;
}

export default function BlogDetail({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/blogs/${params.slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) router.push('/');
        else setBlog(data);
        setLoading(false);
      });
  }, [params.slug, router]);

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-slate-500">Loading post...</div>;
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-dark text-slate-200 dot-grid pb-20">
      <nav className="p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
          </button>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 mt-10">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map(t => <span key={t} className="tag text-xs">{t}</span>)}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm">
            <span className="flex items-center gap-2"><FiCalendar /> {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-2"><FiClock /> 5 min read</span>
          </div>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-8 md:p-12 prose prose-invert prose-primary max-w-none prose-headings:text-white prose-a:text-primary-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: marked(blog.content) }}
        />

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center border-t border-white/5 pt-16"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Thanks for reading!</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">I hope you found this post helpful. If you have any questions, feel free to reach out to me.</p>
          <button onClick={() => router.push('/#contact')} className="btn-primary">Get in Touch</button>
        </motion.footer>
      </article>
    </div>
  );
}
