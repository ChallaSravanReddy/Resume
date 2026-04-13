'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiShield, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export default function AdminCertifications() {
  const [items, setItems] = useState<Certification[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Certification>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/certifications').then(r => r.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (id?: string) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/certifications/${id}` : '/api/certifications';
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
    if (!confirm('Delete this certification?')) return;
    await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  };

  const startEdit = (item: Certification) => {
    setEditing(item.id);
    setFormData(item);
  };

  if (loading) return <div className="text-slate-500">Loading certifications...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Certifications</h1>
          <p className="text-slate-500 mt-2">Display your professional credentials and courses.</p>
        </div>
        <button 
          onClick={() => { setEditing('new'); setFormData({ name: '', issuer: '', date: '', link: '' }); }}
          className="btn-primary"
        >
          <FiPlus /> Add Certification
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AnimatePresence>
          {editing === 'new' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 border-2 border-primary-600/30 md:col-span-2">
              <CertificationForm formData={formData} setFormData={setFormData} onSave={() => handleSave()} onCancel={() => setEditing(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {items.map((item) => (
          <div key={item.id} className="glass p-6">
            {editing === item.id ? (
              <CertificationForm formData={formData} setFormData={setFormData} onSave={() => handleSave(item.id)} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full glass border border-primary-600/30 flex items-center justify-center text-primary-600 shrink-0">
                  <FiShield />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">{item.name}</h3>
                  <p className="text-primary-600 text-sm mb-2">{item.issuer}</p>
                  <p className="text-slate-500 text-xs flex items-center gap-1 mb-4">
                    <FiCalendar /> {item.date}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-600/10 rounded-lg transition-colors"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><FiTrash2 /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationForm({ formData, setFormData, onSave, onCancel }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="admin-label">Certification Name</label>
        <input className="admin-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="AWS Cloud Practitioner" />
      </div>
      <div>
        <label className="admin-label">Issuer</label>
        <input className="admin-input" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} placeholder="Amazon Web Services" />
      </div>
      <div>
        <label className="admin-label">Date</label>
        <input type="date" className="admin-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
      </div>
      <div className="md:col-span-2">
        <label className="admin-label">Certificate Link</label>
        <input className="admin-input" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." />
      </div>
      <div className="flex gap-3 pt-2 md:col-span-2">
        <button onClick={onSave} className="btn-primary">Save Certificate</button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}
