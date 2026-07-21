import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, Filter, Cpu, Smartphone, Monitor } from 'lucide-react';
import { projectService } from '../../services';
import type { Project } from '../../types';

const categories = ['All', 'Web Application', 'Mobile Application', 'Machine Learning', 'Other'];

const categoryColors: Record<string, string> = {
  'Web Application': 'rgba(99,102,241,0.2)',
  'Mobile Application': 'rgba(168,85,247,0.2)',
  'Machine Learning': 'rgba(6,182,212,0.2)',
  'Other': 'rgba(16,185,129,0.2)',
};

const ProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    projectService.getAll()
      .then(res => {
        setProjects(res.data);
        setFiltered(res.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, projects]);

  return (
    <div className="relative min-h-screen py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="orb orb-1" style={{ opacity: 0.1 }} />
      <div className="orb orb-3" style={{ opacity: 0.08 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
            — Portfolio —
          </span>
          <h1 className="section-title">
            <span className="text-white">My </span>
            <span className="gradient-text">Projects</span>
          </h1>
          <p className="section-subtitle max-w-xl mx-auto">
            A showcase of my work — from web applications to machine learning experiments.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <Filter size={16} className="text-gray-500 self-center" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={{
                background: activeCategory === cat ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.05)',
                border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: activeCategory === cat ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="project-card group"
              >
                {/* Project image */}
                <div className="relative h-48 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: categoryColors[project.category] || 'rgba(99,102,241,0.1)' }}
                    >
                      {project.category === 'Machine Learning' ? (
                        <Cpu size={48} className="text-cyan-400/80" />
                      ) : project.category === 'Mobile Application' ? (
                        <Smartphone size={48} className="text-purple-400/80" />
                      ) : (
                        <Monitor size={48} className="text-indigo-400/80" />
                      )}
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{
                        background: categoryColors[project.category] || 'rgba(99,102,241,0.6)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {project.category}
                    </span>
                  </div>

                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 4).map((tech) => (
                      <span key={tech.id} className="tech-tag">{tech.technology}</span>
                    ))}
                    {project.technologies?.length > 4 && (
                      <span className="tech-tag">+{project.technologies.length - 4}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="flex-1 py-2 text-center text-sm font-medium text-indigo-400 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-200"
                    >
                      View Details
                    </Link>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                        aria-label="GitHub"
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
