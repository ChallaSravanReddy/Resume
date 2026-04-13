'use client';

import { useState, useEffect } from 'react';
import { FiUpload, FiFileText, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminResume() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentResume, setCurrentResume] = useState('');

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(data => setCurrentResume(data.resume));
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'resume');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setSuccess(true);
      setCurrentResume(data.path);
      // Update profile data with new resume path
      await fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ resume: data.path }), // This is a bit simplified, usually we fetch whole profile first
        headers: { 'Content-Type': 'application/json' },
      });
      setTimeout(() => setSuccess(false), 3000);
    }
    setUploading(false);
    setFile(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Manage Resume</h1>
        <p className="text-slate-500 mt-2">Upload your latest CV for recruiters to download.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary-600/10 flex items-center justify-center text-primary-600 mb-4">
            <FiFileText size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Current Resume</h2>
          <p className="text-slate-500 text-sm mb-6">
            {currentResume ? 'Your resume is uploaded and live.' : 'No resume uploaded yet.'}
          </p>
          {currentResume && (
            <a href={currentResume} target="_blank" className="btn-outline">
              <FiDownload /> View Current CV
            </a>
          )}
        </div>

        <div className="glass p-8">
          <h2 className="text-xl font-bold text-white mb-4">Upload New CV</h2>
          <p className="text-slate-500 text-sm mb-6">Please upload a PDF file. This will replace your existing resume link.</p>
          
          <div className="space-y-4">
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input 
                type="file" 
                accept=".pdf"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-600/10 file:text-primary-600 hover:file:bg-primary-600/20 transition-all cursor-pointer"
              />
            </label>

            {file && (
              <div className="p-3 bg-white/5 rounded-lg text-sm text-slate-400">
                Selected: {file.name}
              </div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-sm flex items-center gap-2">
                <FiCheckCircle /> Resume uploaded successfully!
              </motion.div>
            )}

            <button 
              onClick={handleUpload}
              disabled={!file || uploading}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiUpload />}
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
