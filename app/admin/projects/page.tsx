'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiExternalLink, FiGithub } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  images: string[];
  date: string;
  category: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (id?: string) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/projects/${id}` : '/api/projects';
    
    // Handle tech array string conversion if needed (basic version)
    const payload = {
      ...formData,
      tech: typeof formData.tech === 'string' ? (formData.tech as string).split(',').map(t => t.trim()) : formData.tech
    };

    const res = await fetch(url, {
      method,
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    const savedItem = await res.json();
    if (id) {
      setProjects(projects.map(p => p.id === id ? savedItem : p));
    } else {
      setProjects([...projects, savedItem]);
    }
    setEditing(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects(projects.filter(p => p.id !== id));
  };

  const startEdit = (project: Project) => {
    setEditing(project.id);
    setFormData({ ...project, tech: project.tech.join(', ') as any });
  };

  if (loading) return <div className="text-slate-500">Loading projects...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Projects</h1>
          <p className="text-slate-500 mt-2">Showcase your best work with images and links.</p>
        </div>
        <button 
          onClick={() => { setEditing('new'); setFormData({ title: '', description: '', tech: [] as any, category: 'AI/ML', date: new Date().toISOString().split('T')[0] }); }}
          className="btn-primary"
        >
          <FiPlus /> Add Project
        </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {editing === 'new' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 border-2 border-primary-600/30">
              <h2 className="text-xl font-bold text-white mb-6">New Project</h2>
              <ProjectForm formData={formData} setFormData={setFormData} onSave={() => handleSave()} onCancel={() => setEditing(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {projects.map((project) => (
          <div key={project.id} className="glass p-6 group">
            {editing === project.id ? (
              <ProjectForm formData={formData} setFormData={setFormData} onSave={() => handleSave(project.id)} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    <span className="tag text-xs">{project.category}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map(t => <span key={t} className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-500">{t}</span>)}
                  </div>
                  <div className="flex gap-4">
                    {project.github && <a href={project.github} target="_blank" className="text-slate-500 hover:text-white flex items-center gap-1 text-xs"><FiGithub /> GitHub</a>}
                    {project.live && <a href={project.live} target="_blank" className="text-slate-500 hover:text-accent flex items-center gap-1 text-xs"><FiExternalLink /> Live</a>}
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 justify-end">
                  <button onClick={() => startEdit(project)} className="p-2 bg-white/5 hover:bg-primary-600/10 text-slate-400 hover:text-primary-600 rounded-lg transition-colors"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 bg-white/5 hover:bg-red-400/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"><FiTrash2 /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ formData, setFormData, onSave, onCancel }: any) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Title</label>
          <input className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="admin-label">Category</label>
          <input className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="admin-label">Description</label>
        <textarea className="admin-input h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      </div>
      <div>
        <label className="admin-label">Tech Stack (comma separated)</label>
        <input className="admin-input" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} placeholder="Next.js, Tailwind, AI" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">GitHub Link</label>
          <input className="admin-input" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
        </div>
        <div>
          <label className="admin-label">Live Link</label>
          <input className="admin-input" value={formData.live} onChange={e => setFormData({...formData, live: e.target.value})} />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onSave} className="btn-primary">Save Project</button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}
