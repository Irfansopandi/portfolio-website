import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Building } from 'lucide-react';
import { educationService } from '../../services';
import type { Education } from '../../types';

const EducationPage = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    educationService.getAll()
      .then(res => setEducation(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="orb orb-1" style={{ opacity: 0.08 }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
            — Education Journey —
          </span>
          <h1 className="section-title">
            <span className="text-white">My </span>
            <span className="gradient-text">Education</span>
          </h1>
          <p className="section-subtitle max-w-xl mx-auto">
            Academic journey that shaped my foundation in technology and problem-solving.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.6) 10%, rgba(168,85,247,0.6) 90%, transparent)' }}
            />

            <div className="space-y-12">
              {education.map((edu, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative flex items-start gap-8 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    } flex-row`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                          boxShadow: '0 0 20px rgba(99,102,241,0.5)',
                        }}
                      >
                        <GraduationCap size={20} className="text-white" />
                      </div>
                    </div>

                    {/* Spacer for center alignment */}
                    <div className="hidden md:block flex-1" />

                    {/* Card */}
                    <div className={`flex-1 ml-20 md:ml-0 ${isLeft ? 'md:mr-8' : 'md:ml-8'}`}>
                      <motion.div
                        className="glass-card p-6 hover:border-indigo-500/40 transition-all duration-300"
                        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.15)' } as any}
                      >
                        {/* Institution logo/icon */}
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black mr-4"
                            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
                          >
                            {edu.logo ? (
                              <img src={edu.logo} alt={edu.institution} className="w-10 h-10 object-cover rounded-lg" />
                            ) : (
                              <Building size={22} className="text-indigo-400" />
                            )}
                          </div>
                          <span className="text-xs font-mono text-indigo-400 px-2 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10">
                            {edu.startDate} - {edu.endDate || 'Present'}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{edu.institution}</h3>
                        <p className="text-indigo-400 font-medium mb-3">{edu.degree}</p>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                          <Calendar size={14} className="text-indigo-400" />
                          <span>{edu.startDate} — {edu.endDate || 'Present'}</span>
                        </div>

                        {edu.description && (
                          <p className="text-gray-400 text-sm leading-relaxed">{edu.description}</p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPage;
