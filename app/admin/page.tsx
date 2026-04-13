'use client';

import { useEffect, useState } from 'react';
import { FiUsers, FiCpu, FiLayout, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    blogs: 0,
    achievements: 0
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/skills').then(r => r.json()),
      fetch('/api/blogs').then(r => r.json()),
      fetch('/api/achievements').then(r => r.json())
    ]).then(([p, s, b, a]) => {
      setStats({
        projects: p.length || 0,
        skills: s.length || 0,
        blogs: b.length || 0,
        achievements: a.length || 0
      });
    });
  }, []);

  const cards = [
    { label: 'Projects', value: stats.projects, icon: <FiLayout className="text-primary-600" />, color: 'bg-primary-600/10' },
    { label: 'Skills', value: stats.skills, icon: <FiCpu className="text-blue-400" />, color: 'bg-blue-400/10' },
    { label: 'Blog Posts', value: stats.blogs, icon: <FiMessageSquare className="text-accent" />, color: 'bg-accent/10' },
    { label: 'Achievements', value: stats.achievements, icon: <FiTrendingUp className="text-yellow-400" />, color: 'bg-yellow-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back! Here&apos;s a quick look at your portfolio content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${card.color}`}>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass p-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/projects" className="btn-outline justify-center">Add Project</a>
            <a href="/admin/blogs" className="btn-outline justify-center">New Blog Post</a>
            <a href="/admin/profile" className="btn-outline justify-center">Update Bio</a>
            <a href="/" target="_blank" className="btn-primary justify-center">View Site</a>
          </div>
        </div>

        <div className="glass p-8 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary-600/20 flex items-center justify-center mb-4 text-primary-600">
            <FiUsers size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Portfolio Analytics</h2>
          <p className="text-slate-500 text-sm">
            Visitor tracking is not enabled yet. You can integrate Google Analytics or Vercel Analytics for detailed insights.
          </p>
        </div>
      </div>
    </div>
  );
}
