'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiBriefcase, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Experience {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export default function AdminExperience() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experience').then(r => r.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (id?: string) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/experience/${id}` : '/api/experience';
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
    if (!confirm('Delete this experience?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  };

  const startEdit = (item: Experience) => {
    setEditing(item.id);
    setFormData(item);
  };

  if (loading) return <div className="text-slate-500">Loading experience...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Experience</h1>
          <p className="text-slate-500 mt-2">Add your work history and leadership roles.</p>
        </div>
        <button 
          onClick={() => { setEditing('new'); setFormData({ role: '', organization: '', startDate: '', endDate: '', description: '', current: false }); }}
          className="btn-primary"
        >
          <FiPlus /> Add Role
        </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {editing === 'new' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 border-2 border-primary-600/30">
              <ExperienceForm formData={formData} setFormData={setFormData} onSave={() => handleSave()} onCancel={() => setEditing(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {items.map((item) => (
          <div key={item.id} className="glass p-6">
            {editing === item.id ? (
              <ExperienceForm formData={formData} setFormData={setFormData} onSave={() => handleSave(item.id)} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full glass border border-primary-600/30 flex items-center justify-center text-primary-600 shrink-0">
                  <FiBriefcase />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{item.role}</h3>
                    {item.current && <span className="tag text-[10px] text-green-400 border-green-400/20">Current</span>}
                  </div>
                  <p className="text-primary-600 font-medium mb-2">{item.organization}</p>
                  <p className="text-slate-500 text-xs mb-4 flex items-center gap-1">
                    <FiCalendar size={12} /> {item.startDate} – {item.current ? 'Present' : item.endDate}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => startEdit(item)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-600/10 rounded-lg"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg"><FiTrash2 /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceForm({ formData, setFormData, onSave, onCancel }: any) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Role</label>
          <input className="admin-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
        </div>
        <div>
          <label className="admin-label">Organization</label>
          <input className="admin-input" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="admin-label">Start Date</label>
          <input type="date" className="admin-input" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
        </div>
        <div>
          <label className="admin-label">End Date</label>
          <input type="date" className="admin-input" disabled={formData.current} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <input type="checkbox" id="current" checked={formData.current} onChange={e => setFormData({...formData, current: e.target.checked})} className="w-4 h-4 accent-primary-600" />
          <label htmlFor="current" className="text-sm text-slate-400">Current Role</label>
        </div>
      </div>
      <div>
        <label className="admin-label">Description</label>
        <textarea className="admin-input h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onSave} className="btn-primary">Save Experience</button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}
