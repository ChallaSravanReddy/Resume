'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills').then(r => r.json()).then(data => {
      setSkills(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (id?: string) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/skills/${id}` : '/api/skills';
    const res = await fetch(url, {
      method,
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    const savedItem = await res.json();
    if (id) {
      setSkills(skills.map(s => s.id === id ? savedItem : s));
    } else {
      setSkills([...skills, savedItem]);
    }
    setEditing(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    setSkills(skills.filter(s => s.id !== id));
  };

  const startEdit = (skill: Skill) => {
    setEditing(skill.id);
    setFormData(skill);
  };

  const categories = ['Programming', 'AI/ML', 'Web Development', 'Tools'];

  if (loading) return <div className="text-slate-500">Loading skills...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Skills</h1>
          <p className="text-slate-500 mt-2">Add, edit, or remove your technical skills.</p>
        </div>
        <button 
          onClick={() => { setEditing('new'); setFormData({ name: '', category: 'Programming', level: 80 }); }}
          className="btn-primary"
        >
          <FiPlus /> Add Skill
        </button>
      </div>

      <div className="glass overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Level</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {editing === 'new' && (
                <motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-primary-600/5">
                  <td className="px-6 py-4">
                    <input autoFocus className="admin-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Python" />
                  </td>
                  <td className="px-6 py-4">
                    <select className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input type="number" className="admin-input" value={formData.level} onChange={e => setFormData({...formData, level: parseInt(e.target.value)})} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleSave()} className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg"><FiCheck /></button>
                    <button onClick={() => setEditing(null)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><FiX /></button>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
            {skills.map((skill) => (
              <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  {editing === skill.id ? 
                    <input className="admin-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /> 
                    : <span className="text-white font-medium">{skill.name}</span>
                  }
                </td>
                <td className="px-6 py-4">
                  {editing === skill.id ? 
                    <select className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    : <span className="tag">{skill.category}</span>
                  }
                </td>
                <td className="px-6 py-4">
                  {editing === skill.id ? 
                    <input type="number" className="admin-input w-20" value={formData.level} onChange={e => setFormData({...formData, level: parseInt(e.target.value)})} />
                    : <span className="text-slate-400">{skill.level}%</span>
                  }
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editing === skill.id ? (
                      <>
                        <button onClick={() => handleSave(skill.id)} className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg"><FiCheck /></button>
                        <button onClick={() => setEditing(null)} className="p-2 text-slate-400 hover:bg-white/10 rounded-lg"><FiX /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(skill)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-600/10 rounded-lg"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(skill.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg"><FiTrash2 /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
