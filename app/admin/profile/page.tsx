'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        reset(data);
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-slate-500">Loading profile data...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Update Profile</h1>
          <p className="text-slate-500 mt-2">Manage your hero section, bio, and social links.</p>
        </div>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 flex items-center gap-2">
          <FiCheckCircle /> Profile updated successfully!
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="glass p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-primary-600/20 pb-4 mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Full Name</label>
              <input {...register('name')} className="admin-input" placeholder="Sravan Reddy" />
            </div>
            <div>
              <label className="admin-label">Tagline</label>
              <input {...register('tagline')} className="admin-input" placeholder="AI Developer | Startup Builder" />
            </div>
          </div>
          <div>
            <label className="admin-label">Hero Bio (Short)</label>
            <textarea {...register('bio')} className="admin-input" placeholder="Short introduction for hero section..." />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Photo URL</label>
              <input {...register('photo')} className="admin-input" placeholder="/uploads/profile.jpg" />
            </div>
            <div>
              <label className="admin-label">Location</label>
              <input {...register('location')} className="admin-input" placeholder="India" />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="glass p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-primary-600/20 pb-4 mb-4">About Me Section</h2>
          <div>
            <label className="admin-label">Main About Bio</label>
            <textarea {...register('about.bio')} className="admin-input h-32" placeholder="Detailed background story..." />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Education</label>
              <input {...register('about.education')} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Goals</label>
              <input {...register('about.goals')} className="admin-input" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Interests (JSON array)</label>
              <input {...register('about.interests', { valueAsDate: false })} className="admin-input" placeholder='["AI", "Hackathons"]' />
              <p className="text-[10px] text-slate-500 mt-1">Comma separated interests will be handled by API if formatted correctly.</p>
            </div>
            <div>
              <label className="admin-label">Languages (JSON array)</label>
              <input {...register('about.languages')} className="admin-input" placeholder='["English", "Telugu"]' />
            </div>
          </div>
        </div>

        {/* Contact & Socials */}
        <div className="glass p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-primary-600/20 pb-4 mb-4">Contact & Social Links</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Email</label>
              <input {...register('email')} type="email" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Phone</label>
              <input {...register('phone')} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">LinkedIn URL</label>
              <input {...register('linkedin')} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">GitHub URL</label>
              <input {...register('github')} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Twitter URL</label>
              <input {...register('twitter')} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Resume PDF URL</label>
              <input {...register('resume')} className="admin-input" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
