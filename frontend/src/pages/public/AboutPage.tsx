import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, User, Code2, Briefcase } from 'lucide-react';
import { profileService, skillService } from '../../services';
import type { Profile } from '../../types';
import { SkillIcon } from '../../components/SkillIcon';

const AboutPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    profileService.get().then(res => setProfile(res.data)).catch(console.error);
    skillService.getAll().then(res => setSkills(res.data.skills || [])).catch(console.error);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const topSkills = skills.slice(0, 6);

  return (
    <div className="relative min-h-screen py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="orb orb-1" style={{ opacity: 0.1 }} />
      <div className="orb orb-2" style={{ opacity: 0.1 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
            — About Me —
          </span>
          <h1 className="section-title">
            <span className="text-white">Who </span>
            <span className="gradient-text">Am I?</span>
          </h1>
          <p className="section-subtitle max-w-xl mx-auto">
            Get to know more about me, my background, and what drives my passion for development.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Profile image */}
          <motion.div

            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center w-full"
          >
            <div className="relative inline-block my-4">
              <div
                className="w-[220px] xs:w-[260px] sm:w-[340px] aspect-square rounded-3xl overflow-hidden mx-auto"
                style={{ border: '2px solid rgba(99,102,241,0.4)', boxShadow: '0 0 40px rgba(99,102,241,0.2)' }}
              >
                {profile?.aboutImage || profile?.profileImage ? (
                  <img
                    src={profile.aboutImage || profile.profileImage}
                    alt={profile?.name || 'Irfan Sopandi'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-6xl xs:text-7xl sm:text-8xl font-black"
                    style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                  >
                    <span className="gradient-text">
                      {profile?.name?.split(' ').map(n => n[0]).join('') || 'IS'}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-3 -right-2 sm:-bottom-6 sm:-right-6 glass-card px-3 py-1.5 sm:px-5 sm:py-3 shadow-xl z-20"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse" />
                  <div>
                    <p className="text-white text-[11px] sm:text-sm font-semibold whitespace-nowrap">Available for work</p>
                  </div>
                </div>
              </motion.div>

              {/* Experience badge */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -top-3 -left-2 sm:-top-6 sm:-left-6 glass-card px-2.5 py-1 sm:px-4 sm:py-3 text-center shadow-xl z-20"
              >
                <p className="gradient-text text-lg sm:text-2xl font-black">3+</p>
                <p className="text-gray-400 text-[9px] sm:text-xs whitespace-nowrap">Years Coding</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="w-full max-w-full overflow-hidden">
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight break-words">
                Full-Stack Developer &{' '}
                <span className="gradient-text">UI/UX Designer</span>
              </h2>

              <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-4 mb-8 break-words">
                {(profile?.aboutText || `Hi! I'm Irfan Sopandi, a passionate Full-Stack Developer based in Karawang, Indonesia. I specialize in building modern, scalable web applications using cutting-edge technologies.\n\nWith a strong foundation in Computer Science from Bina Sarana Informatika University, I bring both theoretical knowledge and practical experience to every project.`)

                  .split('\n\n')
                  .map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
              </div>
            </motion.div>

            {/* Personal info */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <User size={18} className="text-indigo-400" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  { icon: User, label: 'Name', value: profile?.name || 'Irfan Sopandi' },
                  { icon: Mail, label: 'Email', value: profile?.email || 'irfansopandi1212@email.com' },
                  { icon: Phone, label: 'Phone', value: profile?.phone || '+62 859-4665-3103' },
                  { icon: MapPin, label: 'Location', value: profile?.location || 'Karawang, Indonesia' },
                  { icon: Briefcase, label: 'Status', value: 'Student' },
                  { icon: Code2, label: 'Profession', value: profile?.profession || 'Full-Stack Developer' },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Icon size={16} className="text-indigo-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs">{label}</p>
                      <p className="text-white text-sm font-medium truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top skills preview - Auto Scroll Marquee */}
            {skills.length > 0 && (
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }}>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Code2 size={18} className="text-indigo-400" />
                  Top Skills
                </h3>
                <div className="relative w-full overflow-hidden py-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="absolute top-0 bottom-0 left-0 w-8 z-10 bg-gradient-to-r from-[#0f0f1a] to-transparent pointer-events-none" />
                  <div className="absolute top-0 bottom-0 right-0 w-8 z-10 bg-gradient-to-l from-[#0f0f1a] to-transparent pointer-events-none" />
                  
                  <div className="flex w-max animate-marquee gap-3">
                    {[...skills, ...skills].map((skill, index) => (
                      <div
                        key={`${skill.id}-${index}`}
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl glass-card border border-white/10 hover:border-indigo-500/40 transition-colors flex-shrink-0"
                      >
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center p-1 bg-white/5 border border-white/10">
                          <SkillIcon name={skill.name} icon={skill.icon || undefined} />
                        </div>
                        <span className="text-xs font-semibold text-gray-200 whitespace-nowrap">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

