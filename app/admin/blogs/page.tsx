'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiTag, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
}

export default function AdminBlogs() {
  const [items, setItems] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Blog>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs').then(r => r.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (id?: string) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/blogs/${id}` : '/api/blogs';
    
    const payload = {
      ...formData,
      slug: formData.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map(t => t.trim()) : formData.tags
    };

    const res = await fetch(url, {
      method,
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    const savedItem = await res.json();
    if (id) {
      setItems(items.map(i => i.id === id ? savedItem : i));
    } else {
      setItems([...items, savedItem]);
    }
    setEditing(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  };

  const startEdit = (item: Blog) => {
    setEditing(item.id);
    setFormData({ ...item, tags: item.tags.join(', ') as any });
  };

  if (loading) return <div className="text-slate-500">Loading blogs...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Blogs</h1>
          <p className="text-slate-500 mt-2">Write and edit your thoughts on tech and more.</p>
        </div>
        <button 
          onClick={() => { setEditing('new'); setFormData({ title: '', excerpt: '', content: '', tags: [] as any, date: new Date().toISOString().split('T')[0] }); }}
          className="btn-primary"
        >
          <FiPlus /> New Post
        </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {editing === 'new' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 border-2 border-primary-600/30">
              <BlogForm formData={formData} setFormData={setFormData} onSave={() => handleSave()} onCancel={() => setEditing(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {items.map((item) => (
          <div key={item.id} className="glass p-6">
            {editing === item.id ? (
              <BlogForm formData={formData} setFormData={setFormData} onSave={() => handleSave(item.id)} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{item.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map(t => <span key={t} className="text-xs text-accent flex items-center gap-1"><FiTag size={10} /> {t}</span>)}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <FiCalendar /> {item.date} | Slug: {item.slug}
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 justify-end">
                  <button onClick={() => startEdit(item)} className="p-2 bg-white/5 hover:bg-primary-600/10 text-slate-400 hover:text-primary-600 rounded-lg"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/5 hover:bg-red-400/10 text-slate-400 hover:text-red-400 rounded-lg"><FiTrash2 /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogForm({ formData, setFormData, onSave, onCancel }: any) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Title</label>
          <input className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="How I Built..." />
        </div>
        <div>
          <label className="admin-label">Date</label>
          <input type="date" className="admin-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="admin-label">Excerpt (Brief summary)</label>
        <textarea className="admin-input h-20" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
      </div>
      <div>
        <label className="admin-label">Content (Markdown supported)</label>
        <textarea className="admin-input h-64 font-mono text-sm" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="# Hello World..." />
      </div>
      <div>
        <label className="admin-label">Tags (comma separated)</label>
        <input className="admin-input" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="AI, React, Python" />
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onSave} className="btn-primary">Publish Post</button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}
