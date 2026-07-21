import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Layers, Wrench, Database } from 'lucide-react';
import { skillService } from '../../services';
import type { Skill } from '../../types';
import { SkillIcon } from '../../components/SkillIcon';

const categoryIcons = {
  Programming: Code2,
  Framework: Layers,
  Tools: Wrench,
  Database: Database,
};

const categoryColors = {
  Programming: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
  Framework: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', text: '#c084fc' },
  Tools: { bg: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.3)', text: '#22d3ee' },
  Database: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
};

const SkillPage = () => {
  const [grouped, setGrouped] = useState<Record<string, Skill[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    skillService.getAll()
      .then(res => setGrouped(res.data.grouped || {}))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['All', ...Object.keys(grouped)];
  const displayedGroups = activeCategory === 'All'
    ? grouped
    : { [activeCategory]: grouped[activeCategory] || [] };

  return (
    <div className="relative min-h-screen py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="orb orb-2" style={{ opacity: 0.1 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
            — Technical Skills —
          </span>
          <h1 className="section-title">
            <span className="text-white">My </span>
            <span className="gradient-text">Skills</span>
          </h1>
          <p className="section-subtitle max-w-xl mx-auto">
            Technologies and tools I've mastered throughout my development journey.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{
                background: activeCategory === cat
                  ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                  : 'rgba(255,255,255,0.05)',
                border: activeCategory === cat
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.1)',
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
          <div className="space-y-12">
            {Object.entries(displayedGroups).map(([category, skills], groupIndex) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons] || Code2;
              const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors.Programming;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                    >
                      <Icon size={20} style={{ color: colors.text }} />
                    </div>
                    <h2 className="text-xl font-bold text-white">{category}</h2>
                    <div className="flex-1 h-px" style={{ background: colors.border }} />
                    <span className="text-sm" style={{ color: colors.text }}>{skills.length} skills</span>
                  </div>

                  {/* Skills grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="glass-card p-3.5 flex items-center gap-3 group hover:border-indigo-500/40 transition-all duration-300 cursor-default"
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center p-2 flex-shrink-0 transition-transform group-hover:scale-110"
                          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                        >
                          <SkillIcon name={skill.name} icon={skill.icon || undefined} />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-gray-200 group-hover:text-indigo-300 transition-colors truncate">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillPage;

