'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiHome, FiUser, FiCode, FiBriefcase, FiAward, 
  FiShield, FiEdit3, FiLogOut, FiMenu, FiX, FiFileText
} from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = sessionStorage.getItem('admin-auth');
    if (auth !== 'true' && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [router, pathname]);

  if (!authorized && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return <>{children}</>;

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: <FiHome /> },
    { label: 'Profile', href: '/admin/profile', icon: <FiUser /> },
    { label: 'Skills', href: '/admin/skills', icon: <FiCode /> },
    { label: 'Projects', href: '/admin/projects', icon: <FiBriefcase /> },
    { label: 'Experience', href: '/admin/experience', icon: <FiFileText /> },
    { label: 'Achievements', href: '/admin/achievements', icon: <FiAward /> },
    { label: 'Certifications', href: '/admin/certifications', icon: <FiShield /> },
    { label: 'Blogs', href: '/admin/blogs', icon: <FiEdit3 /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col md:flex-row">
      {/* Mobile Toggle */}
      <div className="md:hidden glass p-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin" className="font-bold gradient-text">Admin Panel</Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass border-r border-primary-600/20 transform transition-transform duration-300 md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold gradient-text block mb-8">Portfolio Admin</Link>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${pathname === item.href ? 'btn-primary py-3' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
