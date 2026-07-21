import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { projectService } from '../../services';
import type { Project } from '../../types';

const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      projectService.getBySlug(slug)
        .then(res => setProject(res.data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-bold text-white">{t('projects.notFound')}</h2>
        <Link to="/projects" className="btn-primary">{t('projects.backToProjects')}</Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            {t('projects.backToProjects')}
          </Link>
        </motion.div>

        {/* Hero image */}
        {project.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(99,102,241,0.3)' } as any}
          >
            <img src={project.image} alt={project.title} className="w-full h-80 object-cover" />
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="tech-tag text-sm">{project.category}</span>
                {project.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                    ⭐ {t('projects.featured')}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-black text-white mb-6">{(isEn ? project.titleEn : null) || project.title}</h1>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-indigo-500" /> {t('projects.overview')}
                </h2>
                <p className="text-gray-400 leading-relaxed">{(isEn ? project.descriptionEn : null) || project.description}</p>
              </section>

              {((isEn ? project.featuresEn : null) || project.features || (isEn ? project.solutionEn : null) || project.solution || (isEn ? project.challengeEn : null) || project.challenge) && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-indigo-500" /> {t('projects.keyFeatures')}
                  </h2>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                    {(isEn ? project.featuresEn : null) || project.features || (isEn ? project.solutionEn : null) || project.solution || (isEn ? project.challengeEn : null) || project.challenge}
                  </p>
                </section>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tech stack */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Tag size={16} className="text-indigo-400" />
                {t('projects.techStack')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech) => (
                  <span key={tech.id} className="tech-tag">{tech.technology}</span>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-400" />
                {t('projects.created')}
              </h3>
              <p className="text-gray-400 text-sm">
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>

            {/* Links */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="font-bold text-white mb-3">{t('projects.links')}</h3>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                >
                  <Github size={18} />
                  <span className="text-sm">{t('projects.viewOnGithub')}</span>
                  <ExternalLink size={12} className="ml-auto opacity-50" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl text-white border border-indigo-500/30 hover:border-indigo-500/60 transition-all btn-primary"
                >
                  <ExternalLink size={18} />
                  <span className="text-sm">{t('projects.liveDemo')}</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
