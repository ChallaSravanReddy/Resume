'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiAward, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  link: string;
}

export default function AdminAchievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Achievement>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/achievements').then(r => r.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (id?: string) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/achievements/${id}` : '/api/achievements';
    const res = await fetch(url, {
      method,
      body: JSON.stringify(formData),
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
    if (!confirm('Delete this achievement?')) return;
    await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  };

  const startEdit = (item: Achievement) => {
    setEditing(item.id);
    setFormData(item);
  };

  if (loading) return <div className="text-slate-500">Loading achievements...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Achievements</h1>
          <p className="text-slate-500 mt-2">List your hackathon wins and competitions.</p>
        </div>
        <button 
          onClick={() => { setEditing('new'); setFormData({ title: '', description: '', date: '', link: '' }); }}
          className="btn-primary"
        >
          <FiPlus /> Add Achievement
        </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {editing === 'new' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 border-2 border-primary-600/30">
              <AchievementForm formData={formData} setFormData={setFormData} onSave={() => handleSave()} onCancel={() => setEditing(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {items.map((item) => (
          <div key={item.id} className="glass p-6">
            {editing === item.id ? (
              <AchievementForm formData={formData} setFormData={setFormData} onSave={() => handleSave(item.id)} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 shrink-0">
                  <FiAward />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FiCalendar /> {item.date}</span>
                    {item.link && <span className="text-primary-600">Link attached</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => startEdit(item)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-600/10 rounded-lg transition-colors"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><FiTrash2 /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementForm({ formData, setFormData, onSave, onCancel }: any) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Title</label>
          <input className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Hackathon Winner" />
        </div>
        <div>
          <label className="admin-label">Date</label>
          <input type="date" className="admin-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="admin-label">Description</label>
        <textarea className="admin-input h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      </div>
      <div>
        <label className="admin-label">Link (Optional)</label>
        <input className="admin-input" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." />
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onSave} className="btn-primary">Save Achievement</button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}
