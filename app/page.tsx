'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FiGithub, FiLinkedin, FiTwitter, FiMail, FiPhone, FiMapPin,
  FiDownload, FiExternalLink, FiCode, FiStar, FiAward, FiBook,
  FiBriefcase, FiUser, FiMenu, FiX, FiChevronDown, FiSend,
  FiCalendar, FiTag, FiShield
} from 'react-icons/fi';

// ──────────────────────────────────────────────
// TYPE DEFINITIONS
// ──────────────────────────────────────────────
interface Profile {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  twitter: string;
  photo: string;
  resume: string;
  about: {
    bio: string;
    education: string;
    interests: string[];
    goals: string;
    languages: string[];
  };
}

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

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

interface Experience {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  link: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
}

// ──────────────────────────────────────────────
// ANIMATION VARIANTS
// ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// NAVBAR
// ──────────────────────────────────────────────
function Navbar({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = ['About', 'Skills', 'Projects', 'Experience', 'Achievements', 'Certifications', 'Blog', 'Contact'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-primary-600/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="text-xl font-bold gradient-text">{name.split(' ')[0]}<span className="text-white">.</span></a>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">{l}</a>
          ))}
          <a href="/admin/login" className="btn-primary text-sm py-2 px-5">Admin ⚡</a>
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden glass border-t border-primary-600/20 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="text-slate-300 hover:text-white py-2">{l}</a>
          ))}
          <a href="/admin/login" className="btn-primary text-sm">Admin ⚡</a>
        </motion.div>
      )}
    </nav>
  );
}

// ──────────────────────────────────────────────
// HERO
// ──────────────────────────────────────────────
function Hero({ profile }: { profile: Profile }) {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden dot-grid">
      {/* Glowing orbs */}
      <div className="absolute top-32 left-1/4 w-64 h-64 rounded-full bg-primary-600/20 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-32 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
        <AnimatedSection>
          <motion.span variants={fadeUp} className="inline-block tag mb-4">👋 Welcome to my portfolio</motion.span>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            Hi, I&apos;m <span className="gradient-text">{profile.name.split(' ')[0]}</span>
            <br />
            <span className="text-white">{profile.name.split(' ').slice(1).join(' ')}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-accent font-mono text-lg md:text-xl mb-4">
            {profile.tagline}
          </motion.p>
          <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed max-w-lg mb-8">
            {profile.bio}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-8">
            <a href={profile.resume} download className="btn-primary">
              <FiDownload /> Download Resume
            </a>
            <a href="#contact" className="btn-outline">
              <FiMail /> Contact Me
            </a>
            <a href="#projects" className="btn-outline">
              <FiCode /> View Projects
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-center gap-4">
            {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><FiGithub size={22} /></a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary-600 transition-colors"><FiLinkedin size={22} /></a>}
            {profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-accent transition-colors"><FiTwitter size={22} /></a>}
            {profile.email && <a href={`mailto:${profile.email}`} className="text-slate-400 hover:text-white transition-colors"><FiMail size={22} /></a>}
          </motion.div>
        </AnimatedSection>

        {/* Profile photo */}
        <AnimatedSection className="flex justify-center lg:justify-end">
          <motion.div variants={fadeUp} className="relative">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-primary-600/50 glow">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=400&background=6C63FF&color=fff&bold=true`;
                }}
              />
            </div>
            {/* Floating badges */}
            {/* <div className="absolute -bottom-4 -left-4 glass px-4 py-2 flex items-center gap-2">
              <span className="text-green-400">●</span>
              {/* <span className="text-sm font-medium">Available for work</span> */}
            {/* </div> */} 
            {/* <div className="absolute -top-4 -right-4 glass px-4 py-2 flex items-center gap-2">
              <FiStar className="text-yellow-400" />
              {/* <span className="text-sm font-medium">AI Developer</span> */}
            {/* </div> */} 
          </motion.div>
        </AnimatedSection>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-white transition-colors animate-bounce">
        <FiChevronDown size={28} />
      </a>
    </section>
  );
}

// ──────────────────────────────────────────────
// ABOUT
// ──────────────────────────────────────────────
function About({ profile }: { profile: Profile }) {
  const cards = [
    { icon: <FiMapPin />, label: 'Location', value: profile.location },
    { icon: <FiBook />, label: 'Education', value: profile.about.education },
    { icon: <FiUser />, label: 'Goals', value: profile.about.goals },
  ];

  return (
    <section id="about" className="section">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="tag mb-4 inline-block">About Me</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Who <span className="gradient-text">I Am</span></h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={fadeUp}>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">{profile.about.bio}</p>
              <div className="grid grid-cols-1 gap-4">
                {cards.map((card) => (
                  <div key={card.label} className="glass p-4 flex items-start gap-4">
                    <span className="text-primary-600 text-xl mt-1">{card.icon}</span>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{card.label}</div>
                      <div className="text-slate-200 font-medium">{card.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-6">
              <div className="glass p-6">
                <h3 className="text-lg font-bold mb-4 gradient-text">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.about.interests.map((i) => <span key={i} className="tag">{i}</span>)}
                </div>
              </div>
              <div className="glass p-6">
                <h3 className="text-lg font-bold mb-4 gradient-text">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.about.languages.map((l) => <span key={l} className="tag">{l}</span>)}
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// SKILLS
// ──────────────────────────────────────────────
function Skills({ skills }: { skills: Skill[] }) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const categoryColors: Record<string, string> = {
    Programming: 'from-purple-500 to-primary-600',
    'AI/ML': 'from-cyan-500 to-blue-500',
    'Web Development': 'from-green-500 to-teal-500',
    Tools: 'from-orange-500 to-amber-500',
  };

  return (
    <section id="skills" className="section gradient-bg">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="tag mb-4 inline-block">Skills</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">My <span className="gradient-text">Expertise</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">Technologies and tools I work with every day</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((cat) => (
              <motion.div key={cat} variants={fadeUp} className="glass p-6">
                <h3 className={`text-lg font-bold mb-6 bg-gradient-to-r ${categoryColors[cat] || 'from-primary-600 to-accent'} bg-clip-text text-transparent`}>
                  {cat}
                </h3>
                <div className="space-y-4">
                  {skills.filter((s) => s.category === cat).map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 font-medium">{skill.name}</span>
                        <span className="text-slate-500">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-dark-400 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                          className={`h-full rounded-full bg-gradient-to-r ${categoryColors[cat] || 'from-primary-600 to-accent'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// PROJECTS
// ──────────────────────────────────────────────
function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(projects.map((p) => p.category))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="tag mb-4 inline-block">Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">My <span className="gradient-text">Projects</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">Things I&apos;ve built that I&apos;m proud of</p>
          </motion.div>

          {/* Category filter */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'btn-primary py-2' : 'glass text-slate-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <motion.div key={project.id} variants={fadeUp} whileHover={{ y: -6 }} className="glass p-6 flex flex-col h-full transition-shadow hover:shadow-lg hover:shadow-primary-600/20">
                {/* Category badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="tag text-xs">{project.category}</span>
                  <span className="text-slate-500 text-xs">{new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((t) => <span key={t} className="text-xs bg-dark-400 text-slate-400 px-2 py-1 rounded-md">{t}</span>)}
                </div>

                {/* Links */}
                <div className="flex gap-3 mt-auto">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="btn-outline py-2 px-4 text-sm flex-1 justify-center">
                      <FiGithub /> Code
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer" className="btn-primary py-2 px-4 text-sm flex-1 justify-center">
                      <FiExternalLink /> Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// EXPERIENCE
// ──────────────────────────────────────────────
function Experience({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="section gradient-bg">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="tag mb-4 inline-block">Career</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">My <span className="gradient-text">Experience</span></h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-600 to-accent" />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <motion.div key={exp.id} variants={fadeUp} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center glass border-2 border-primary-600">
                    <FiBriefcase className="text-primary-600" />
                  </div>

                  <div className="glass p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      {exp.current && <span className="tag text-green-400 border-green-400/30 bg-green-400/10">Current</span>}
                    </div>
                    <p className="text-primary-600 font-semibold mb-2">{exp.organization}</p>
                    <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                      <FiCalendar size={12} />
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      {' – '}
                      {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-slate-400 leading-relaxed">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// ACHIEVEMENTS
// ──────────────────────────────────────────────
function Achievements({ achievements }: { achievements: Achievement[] }) {
  return (
    <section id="achievements" className="section">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="tag mb-4 inline-block">Wins</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">My <span className="gradient-text">Achievements</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((ach) => (
              <motion.div key={ach.id} variants={fadeUp} whileHover={{ y: -4 }} className="glass p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 rounded-full -translate-y-12 translate-x-12" />
                <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center mb-4">
                  <FiAward className="text-yellow-400" size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{ach.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{ach.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <FiCalendar size={10} />
                    {new Date(ach.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  {ach.link && (
                    <a href={ach.link} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-accent text-xs flex items-center gap-1">
                      View <FiExternalLink size={11} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// CERTIFICATIONS
// ──────────────────────────────────────────────
function Certifications({ certifications }: { certifications: Certification[] }) {
  const issuerColors: Record<string, string> = {
    Google: 'from-blue-500 to-green-500',
    Coursera: 'from-blue-500 to-cyan-500',
    Amazon: 'from-orange-500 to-yellow-500',
  };

  return (
    <section id="certifications" className="section gradient-bg">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="tag mb-4 inline-block">Credentials</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">My <span className="gradient-text">Certifications</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => {
              const colorKey = Object.keys(issuerColors).find(k => cert.issuer.includes(k)) || '';
              const gradient = issuerColors[colorKey] || 'from-primary-600 to-accent';
              return (
                <motion.div key={cert.id} variants={fadeUp} whileHover={{ y: -4 }} className="glass p-6 relative overflow-hidden">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <FiShield className="text-white" size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{cert.name}</h3>
                  <p className={`text-sm mb-3 font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{cert.issuer}</p>
                  <p className="text-slate-500 text-xs mb-4 flex items-center gap-1">
                    <FiCalendar size={10} />
                    {new Date(cert.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noreferrer" className="btn-outline py-2 px-4 text-xs w-full justify-center">
                      <FiExternalLink /> View Certificate
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// BLOG
// ──────────────────────────────────────────────
function Blog({ blogs }: { blogs: Blog[] }) {
  return (
    <section id="blog" className="section">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="tag mb-4 inline-block">Writing</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">My <span className="gradient-text">Blog</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">Thoughts on AI, building products, and organizing communities</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <motion.div key={blog.id} variants={fadeUp} whileHover={{ y: -4 }} className="glass p-6 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((t) => (
                    <span key={t} className="flex items-center gap-1 text-xs text-accent">
                      <FiTag size={10} /> {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{blog.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">{blog.excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <FiCalendar size={10} />
                    {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <a href={`/blog/${blog.slug}`} className="text-primary-600 hover:text-accent text-sm font-medium flex items-center gap-1 transition-colors">
                    Read more →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// CONTACT
// ──────────────────────────────────────────────
function Contact({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const msg = data.get('message');
    window.location.href = `mailto:${profile.email}?subject=Portfolio Contact from ${name}&body=${msg}%0A%0AFrom: ${name} (${email})`;
    setStatus('sent');
    setTimeout(() => setStatus('idle'), 4000);
  };

  const socials = [
    { icon: <FiGithub size={20} />, href: profile.github, label: 'GitHub', color: 'hover:text-white' },
    { icon: <FiLinkedin size={20} />, href: profile.linkedin, label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: <FiTwitter size={20} />, href: profile.twitter, label: 'Twitter', color: 'hover:text-cyan-400' },
    { icon: <FiMail size={20} />, href: `mailto:${profile.email}`, label: profile.email, color: 'hover:text-primary-600' },
    { icon: <FiPhone size={20} />, href: `tel:${profile.phone}`, label: profile.phone, color: 'hover:text-green-400' },
  ];

  return (
    <section id="contact" className="section gradient-bg">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="tag mb-4 inline-block">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Let&apos;s <span className="gradient-text">Talk</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">I&apos;m always open to exciting projects, collaborations, or just a friendly chat.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="glass p-6">
                <h3 className="font-bold text-lg mb-4 gradient-text">Contact Details</h3>
                <div className="space-y-4">
                  {socials.filter(s => s.href).map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className={`flex items-center gap-4 text-slate-400 ${s.color} transition-colors group`}>
                      <span className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:border-primary-600/50 transition-colors">{s.icon}</span>
                      <span className="text-sm">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className="glass p-6">
                <p className="text-slate-400 text-sm leading-relaxed">
                  Based in <strong className="text-white">{profile.location}</strong>. Currently available for freelance projects and full-time opportunities.
                </p>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div variants={fadeUp}>
              <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
                <h3 className="font-bold text-lg mb-4 gradient-text">Send a Message</h3>
                <div>
                  <label className="admin-label">Your Name</label>
                  <input name="name" required placeholder="Sravan Reddy" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Email Address</label>
                  <input name="email" type="email" required placeholder="you@example.com" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Message</label>
                  <textarea name="message" required rows={4} placeholder="Hi, I'd love to work with you on..." className="admin-input" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  <FiSend />
                  {status === 'sent' ? 'Message Sent! ✓' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// FOOTER
// ──────────────────────────────────────────────
function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-primary-600/20 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xl font-bold gradient-text">{profile.name}</span>
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} {profile.name}. Built with Next.js & ❤️</p>
        {profile.resume && (
          <a href={profile.resume} download className="btn-primary py-2 px-5 text-sm">
            <FiDownload /> Resume
          </a>
        )}
      </div>
    </footer>
  );
}

// ──────────────────────────────────────────────
// MAIN PAGE
// ──────────────────────────────────────────────
export default function PortfolioPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/skills').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/experience').then(r => r.json()),
      fetch('/api/achievements').then(r => r.json()),
      fetch('/api/certifications').then(r => r.json()),
      fetch('/api/blogs').then(r => r.json()),
    ]).then(([p, s, pr, ex, ac, ce, bl]) => {
      setProfile(p);
      setSkills(s);
      setProjects(pr);
      setExperiences(ex);
      setAchievements(ac);
      setCertifications(ce);
      setBlogs(bl);
    });
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          Loading portfolio...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar name={profile.name} />
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Achievements achievements={achievements} />
      <Certifications certifications={certifications} />
      <Blog blogs={blogs} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </>
  );
}
