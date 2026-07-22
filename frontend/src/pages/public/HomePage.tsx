import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SkillIcon } from '../../components/SkillIcon';
import { 
  Github, 
  Linkedin, 
  Instagram, 
  MessageCircle, 
  ArrowRight, 
  Download, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Building, 
  Layers, 
  Wrench, 
  Database,
  Filter,
  ExternalLink,
  Award,
  Send,
  CheckCircle,
  Cpu,
  Smartphone,
  Monitor,
  X,
  Camera,
  Image as ImageIcon
} from 'lucide-react';


import { TypeAnimation } from 'react-type-animation';
import LanyardCard from '../../components/LanyardCard';
import { 
  profileService, 
  visitorService, 
  educationService, 
  skillService, 
  projectService, 
  certificateService, 
  socialService,
  messageService,
  experienceService
} from '../../services';
import type { Profile, Education, Skill, Project, Certificate, SocialMedia, Experience } from '../../types';
import toast from 'react-hot-toast';


const socialIcons: Record<string, React.ComponentType<any>> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  WhatsApp: MessageCircle,
};

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

const projectCategories = ['All', 'Web Application', 'Mobile Application', 'Machine Learning', 'Other'];

const projectCategoryColors: Record<string, string> = {
  'Web Application': 'rgba(99,102,241,0.2)',
  'Mobile Application': 'rgba(168,85,247,0.2)',
  'Machine Learning': 'rgba(6,182,212,0.2)',
  'Other': 'rgba(16,185,129,0.2)',
};

const FolderIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  // States for all sections
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [groupedSkills, setGroupedSkills] = useState<Record<string, Skill[]>>({});
  const [activeSkillCategory, setActiveSkillCategory] = useState('All');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeProjectCategory, setActiveProjectCategory] = useState('All');
  
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [socials, setSocials] = useState<SocialMedia[]>([]);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [activeExpCategory, setActiveExpCategory] = useState<'all' | 'work' | 'organization'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption?: string } | null>(null);


  // Contact form state
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Track home page visit
    visitorService.track('/').catch(() => {});

    // Fetch all data
    Promise.all([
      profileService.get().then(res => setProfile(res.data)),
      educationService.getAll().then(res => setEducation(res.data)),
      skillService.getAll().then(res => {
        setSkills(res.data.skills || []);
        setGroupedSkills(res.data.grouped || {});
      }),
      projectService.getAll().then(res => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      }),
      certificateService.getAll().then(res => setCertificates(res.data)),
      experienceService.getAll().then(res => {
        setExperiences(res.data);
        setFilteredExperiences(res.data);
      }),
      socialService.getAll().then(res => setSocials(res.data))
    ])
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);


  // Filter projects when category changes
  useEffect(() => {
    if (activeProjectCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === activeProjectCategory));
    }
  }, [activeProjectCategory, projects]);

  // Filter experiences when category changes
  useEffect(() => {
    if (activeExpCategory === 'all') {
      setFilteredExperiences(experiences);
    } else {
      setFilteredExperiences(experiences.filter(e => e.type === activeExpCategory));
    }
  }, [activeExpCategory, experiences]);


  // Handle URL hash scroll on load
  useEffect(() => {
    if (!isLoading && window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t('contact.fillAll'));
      return;
    }

    setIsSubmitting(true);
    try {
      await messageService.send(form);
      setIsSuccess(true);
      setForm({ name: '', email: '', message: '' });
      toast.success(t('contact.successToast'));
    } catch (error: any) {
      const msg = error?.response?.data?.error;
      toast.error(msg || t('contact.errorToast'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6 },
  };

  const topSkills = skills.slice(0, 6);
  const skillCategories = ['All', ...Object.keys(groupedSkills)];
  const displayedSkillGroups = activeSkillCategory === 'All'
    ? groupedSkills
    : { [activeSkillCategory]: groupedSkills[activeSkillCategory] || [] };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: profile?.email || 'irfansopandi1212@email.com', href: `mailto:${profile?.email || 'irfansopandi1212@email.com'}` },
    { icon: Phone, label: 'WhatsApp', value: profile?.phone || '+62 859-4665-3103', href: `https://wa.me/${(profile?.phone || '+6285946653103').replace(/\D/g, '')}` },
    { icon: MapPin, label: 'Location', value: profile?.location || 'Karawang, Indonesia', href: '#' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ background: '#0f0f1a' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-0 bg-transparent">
      {/* 1. HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px flex-1 max-w-12" style={{ background: 'linear-gradient(90deg, transparent, #6366f1)' }} />
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10">
                  {t('hero.greeting')}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4"
              >
                <span className="text-white">I'm </span>
                <span className="gradient-text">
                  {profile?.name?.split(' ')[0] || 'Irfan'}
                </span>
                <br />
                <span className="text-white text-4xl md:text-5xl lg:text-6xl">
                  {profile?.name?.split(' ').slice(1).join(' ') || 'Sopandi'}
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl md:text-2xl font-semibold text-gray-300 mb-4 h-8"
              >
                <TypeAnimation
                  sequence={[
                    'Web Development',
                    2000,
                    'UI/UX Designer',
                    2000,
                    'Mobile Application Development',
                    2000,
                    'Problem Solver',
                    2000,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                  className="text-indigo-400"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-400 leading-relaxed mb-6 max-w-lg"
              >
                {(isEn ? profile?.bioEn : null) || profile?.bio || t('hero.bio')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 mb-8"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-indigo-400 flex-shrink-0" />
                  <span>{profile?.location || 'Karawang, Indonesia'}</span>
                </div>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-600" />
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-indigo-400 flex-shrink-0" />
                  <span className="break-all sm:break-normal">{profile?.email || 'irfansopandi1212@email.com'}</span>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8"
              >
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Mail size={16} />
                  {t('hero.contactMe')}
                  <ArrowRight size={16} />
                </a>
                {profile?.cvUrl ? (
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Download size={16} />
                    {t('hero.downloadCV')}
                  </a>
                ) : (
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <FolderIcon size={16} />
                    {t('hero.viewProjects')}
                  </a>
                )}
              </motion.div>

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center gap-3 sm:gap-4"
              >
                <span className="text-gray-500 text-xs font-mono">{t('hero.followMe')}</span>
                <div className="h-px flex-1 max-w-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <div className="flex gap-2.5 sm:gap-3">
                  {socials.length > 0 ? (
                    socials
                      .filter((social) => social.url && social.url !== '#' && social.url.trim() !== '')
                      .map((social) => {
                        const Icon = socialIcons[social.platform] || Github;
                        return (
                          <motion.a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 social-icon-btn social-icon-${social.platform.toLowerCase()}`}
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                            } as any}
                            whileHover={{ scale: 1.15, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={social.platform}
                          >
                            <Icon size={18} />
                          </motion.a>
                        );
                      })
                  ) : (
                    <>
                      {[
                        { Icon: Github, platform: 'github', href: 'https://github.com/Irfansopandi/' },
                        { Icon: Instagram, platform: 'instagram', href: 'https://www.instagram.com/irfan_sopandi_/' },
                        { Icon: MessageCircle, platform: 'whatsapp', href: 'https://wa.me/6285946653103' }
                      ].map(({ Icon, platform, href }, i) => (
                        <motion.a
                          key={i}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 social-icon-btn social-icon-${platform}`}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' } as any}
                          whileHover={{ scale: 1.15, y: -2 }}
                        >
                          <Icon size={18} />
                        </motion.a>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>

              {/* Mobile Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-10 flex flex-col items-center gap-2 lg:hidden cursor-pointer"
                onClick={() => {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="text-indigo-400/80 text-[10px] font-mono tracking-widest uppercase font-semibold">{t('hero.scrollDown')}</span>
                <motion.div
                  className="w-5 h-8 rounded-full border-2 border-indigo-500/50 flex justify-center p-1"
                  style={{ background: 'rgba(15, 15, 26, 0.6)', backdropFilter: 'blur(8px)', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}
                >
                  <motion.div
                    className="w-1 h-2.5 bg-indigo-400 rounded-full"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Right side - 3D Lanyard Card (Desktop Only) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:flex justify-center items-start pt-8"
            >
              <LanyardCard
                name={profile?.name || 'Irfan Sopandi'}
                profession={profile?.profession || 'Full-Stack Developer'}
                profileImage={profile?.profileImage}
              />
            </motion.div>
          </div>
        </div>

        {/* Desktop Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-20 cursor-pointer"
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-indigo-400/80 text-xs font-mono tracking-widest uppercase font-semibold">{t('hero.scrollDown')}</span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-indigo-500/50 flex justify-center p-1.5"
            style={{ background: 'rgba(15, 15, 26, 0.6)', backdropFilter: 'blur(8px)', boxShadow: '0 0 15px rgba(99,102,241,0.3)' }}
          >
            <motion.div
              className="w-1.5 h-3 bg-indigo-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>

      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="orb orb-1" style={{ opacity: 0.05 }} />
        <div className="orb orb-2" style={{ opacity: 0.05 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
              {t('about.subtitle')}
            </span>
            <h2 className="section-title">
              <span className="text-white">{t('about.titleWhite')}</span>
              <span className="gradient-text">{t('about.titleGradient')}</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">

            {/* Profile Image */}
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

                {/* Floating active status */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-3 -right-2 sm:-bottom-6 sm:-right-6 glass-card px-3 py-1.5 sm:px-5 sm:py-3 shadow-xl z-20"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse" />
                    <div>
                      <p className="text-white text-[11px] sm:text-sm font-semibold whitespace-nowrap">{t('about.availableForWork')}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Experience Badge */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="absolute -top-3 -left-2 sm:-top-6 sm:-left-6 glass-card px-2.5 py-1 sm:px-4 sm:py-3 text-center shadow-xl z-20"
                >
                  <p className="gradient-text text-lg sm:text-2xl font-black">3+</p>
                  <p className="text-gray-400 text-[9px] sm:text-xs whitespace-nowrap">{t('about.yearsCoding')}</p>
                </motion.div>
              </div>

            </motion.div>

            {/* Content info */}
            <div className="w-full max-w-full overflow-hidden">
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight break-words">
                  {(isEn ? profile?.professionEn : null) || profile?.profession || 'Full-Stack Developer'}
                </h3>

                <div className="text-gray-400 text-sm sm:text-base leading-relaxed space-y-4 mb-8 break-words">
                  {((isEn ? profile?.aboutTextEn : null) || profile?.aboutText || `Hi! I'm Irfan Sopandi, a passionate Full-Stack Developer based in Karawang, Indonesia. I specialize in building modern, scalable web applications using cutting-edge technologies.\n\nWith a strong foundation in Computer Science from Bina Sarana Informatika University, I bring both theoretical knowledge and practical experience to every project.`)
                    .split('\n\n')
                    .map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <User size={18} className="text-indigo-400" />
                  {t('about.personalInfo')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: User, label: t('about.name'), value: profile?.name || 'Irfan Sopandi' },
                    { icon: Mail, label: t('about.email'), value: profile?.email || 'irfansopandi1212@email.com' },
                    { icon: Phone, label: t('about.phone'), value: profile?.phone || '+62 859-4665-3103' },
                    { icon: MapPin, label: t('about.location'), value: profile?.location || 'Karawang, Indonesia' },
                    { icon: Briefcase, label: t('about.status'), value: t('about.statusValue') },
                    { icon: Code2, label: t('about.profession'), value: (isEn ? profile?.professionEn : null) || profile?.profession || 'Full-Stack Developer' },
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
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Code2 size={18} className="text-indigo-400" />
                    {t('about.topSkills')}
                  </h4>
                  <div className="relative w-full overflow-hidden py-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    {/* Gradient fade edges */}
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
      </section>

      {/* 3. EDUCATION SECTION */}
      <section id="education" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="orb orb-1" style={{ opacity: 0.05 }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
              {t('education.subtitle')}
            </span>
            <h2 className="section-title">
              <span className="text-white">{t('education.titleWhite')}</span>
              <span className="gradient-text">{t('education.titleGradient')}</span>
            </h2>
            <p className="section-subtitle max-w-xl mx-auto">
              {t('education.description')}
            </p>
          </motion.div>

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
                            {edu.startDate} - {edu.endDate || t('education.present')}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{edu.institution}</h3>
                        <p className="text-indigo-400 font-medium mb-3">{(isEn ? edu.degreeEn : null) || edu.degree}</p>

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                          <Calendar size={14} className="text-indigo-400" />
                          <span>{edu.startDate} — {edu.endDate || t('education.present')}</span>
                        </div>

                        {((isEn ? edu.descriptionEn : null) || edu.description) && (
                          <p className="text-gray-400 text-sm leading-relaxed">{(isEn ? edu.descriptionEn : null) || edu.description}</p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SKILLS SECTION */}
      <section id="skills" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="orb orb-2" style={{ opacity: 0.05 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
              {t('skills.subtitle')}
            </span>
            <h2 className="section-title">
              <span className="text-white">{t('skills.titleWhite')}</span>
              <span className="gradient-text">{t('skills.titleGradient')}</span>
            </h2>
            <p className="section-subtitle max-w-xl mx-auto">
              {t('skills.description')}
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {skillCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveSkillCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSkillCategory === cat ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  background: activeSkillCategory === cat
                    ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                    : 'rgba(255,255,255,0.05)',
                  border: activeSkillCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: activeSkillCategory === cat ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <div className="space-y-12">
            {Object.entries(displayedSkillGroups).map(([category, catSkills], groupIndex) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons] || Code2;
              const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors.Programming;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                    >
                      <Icon size={20} style={{ color: colors.text }} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{category}</h3>
                    <div className="flex-1 h-px" style={{ background: colors.border }} />
                    <span className="text-sm" style={{ color: colors.text }}>{catSkills.length} skills</span>
                  </div>

                  {/* Skills Grid - Logo & Name Only */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {catSkills.map((skill, index) => (
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
        </div>
      </section>

      {/* 5. PROJECTS SECTION */}
      <section id="projects" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="orb orb-1" style={{ opacity: 0.05 }} />
        <div className="orb orb-3" style={{ opacity: 0.05 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
              {t('projects.subtitle')}
            </span>
            <h2 className="section-title">
              <span className="text-white">{t('projects.titleWhite')}</span>
              <span className="gradient-text">{t('projects.titleGradient')}</span>
            </h2>
            <p className="section-subtitle max-w-xl mx-auto">
              {t('projects.description')}
            </p>
          </motion.div>

          {/* Filter categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <Filter size={16} className="text-gray-500 self-center" />
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveProjectCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeProjectCategory === cat ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  background: activeProjectCategory === cat ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.05)',
                  border: activeProjectCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: activeProjectCategory === cat ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid / Mobile Carousel */}
          <motion.div 
            layout 
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:gap-6 -mx-4 px-4 md:mx-0 md:px-0"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="project-card group min-w-[285px] sm:min-w-[340px] max-w-[340px] md:max-w-none md:min-w-0 flex-shrink-0 snap-center"
              >
                {/* Image */}
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
                      style={{ background: projectCategoryColors[project.category] || 'rgba(99,102,241,0.1)' }}
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{
                        background: projectCategoryColors[project.category] || 'rgba(99,102,241,0.6)',
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
                    {(isEn ? project.titleEn : null) || project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {(isEn ? project.descriptionEn : null) || project.description}
                  </p>

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
                      {t('projects.viewProject')}
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

          {filteredProjects.length > 1 && (
            <p className="text-center text-xs text-indigo-400/70 font-mono mt-4 md:hidden">
              {isEn ? "← Swipe to see more projects →" : "← Geser untuk melihat proyek lainnya →"}
            </p>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400">{t('common.noData')}</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. CERTIFICATES SECTION */}
      <section id="certificates" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="orb orb-1" style={{ opacity: 0.05 }} />
        <div className="orb orb-2" style={{ opacity: 0.05 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
              {t('certificates.subtitle')}
            </span>
            <h2 className="section-title">
              <span className="text-white">{t('certificates.titleWhite')}</span>
              <span className="gradient-text">{t('certificates.titleGradient')}</span>
            </h2>
            <p className="section-subtitle max-w-xl mx-auto">
              {t('certificates.description')}
            </p>
          </motion.div>

          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:gap-6 -mx-4 px-4 md:mx-0 md:px-0">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="certificate-card cursor-pointer group min-w-[285px] sm:min-w-[340px] max-w-[340px] md:max-w-none md:min-w-0 flex-shrink-0 snap-center"
                onClick={() => setSelectedCertificate(cert)}
              >
                <div className="relative h-44 overflow-hidden">
                  {cert.image ? (
                    <>
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                        <span className="text-sm text-white font-mono bg-black/60 px-3 py-1 rounded">{isEn ? 'View' : 'Lihat'}</span>
                      </div>
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))' }}
                    >
                      <Award size={48} className="text-indigo-400 opacity-60" />
                      <p className="text-indigo-300 text-xs font-mono">Certificate</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {(isEn ? cert.titleEn : null) || cert.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Building size={13} className="text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Calendar size={13} className="text-indigo-400 flex-shrink-0" />
                    <span>{cert.date}</span>
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                      {t('certificates.viewCredential')}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {certificates.length > 1 && (
            <p className="text-center text-xs text-indigo-400/70 font-mono mt-4 md:hidden">
              {isEn ? "← Swipe to see more certificates →" : "← Geser untuk melihat sertifikat lainnya →"}
            </p>
          )}
        </div>

        {/* Modal Certificate Viewer */}
        <AnimatePresence>
          {selectedCertificate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCertificate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card max-w-2xl w-full overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10 transition-colors"
                >
                  <X size={20} />
                </button>
                {selectedCertificate.image && (
                  <img src={selectedCertificate.image} alt={selectedCertificate.title} className="w-full max-h-[65vh] object-contain bg-black/50" />
                )}
                <div className="p-6 bg-black/40">
                  <h3 className="text-2xl font-bold text-white mb-2">{(isEn ? selectedCertificate.titleEn : null) || selectedCertificate.title}</h3>
                  <p className="text-indigo-400 mb-1">{selectedCertificate.issuer}</p>
                  <p className="text-gray-500 mb-4">{selectedCertificate.date}</p>
                  {selectedCertificate.credentialUrl && (
                    <a href={selectedCertificate.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                      <ExternalLink size={16} />
                      {t('certificates.viewCredential')}
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 6.5. EXPERIENCE SECTION */}
      <section id="experiences" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="orb orb-2" style={{ opacity: 0.05 }} />
        <div className="orb orb-3" style={{ opacity: 0.05 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
              {t('experiences.subtitle')}
            </span>
            <h2 className="section-title">
              <span className="text-white">{t('experiences.titleWhite')}</span>
              <span className="gradient-text">{t('experiences.titleGradient')}</span>
            </h2>
            <p className="section-subtitle max-w-xl mx-auto">
              {t('experiences.description')}
            </p>
          </motion.div>

          {/* 3 Categories Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {([{key: 'all', labelKey: 'experiences.all'}, {key: 'work', labelKey: 'experiences.work'}, {key: 'organization', labelKey: 'experiences.organization'}] as const).map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveExpCategory(cat.key as any)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeExpCategory === cat.key ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  background: activeExpCategory === cat.key
                    ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                    : 'rgba(255,255,255,0.05)',
                  border: activeExpCategory === cat.key ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: activeExpCategory === cat.key ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {cat.key === 'work' && <Briefcase size={16} />}
                {cat.key === 'organization' && <User size={16} />}
                {t(cat.labelKey)}
              </button>
            ))}
          </motion.div>

          {/* Experience Cards Grid / Mobile Carousel */}
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 gap-5 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:gap-6 -mx-4 px-4 md:mx-0 md:px-0">
            {filteredExperiences.map((exp, index) => {
              const isWork = exp.type === 'work';
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 md:p-8 flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-300 relative overflow-hidden min-w-[285px] sm:min-w-[340px] max-w-[340px] md:max-w-none md:min-w-0 flex-shrink-0 snap-center"
                >

                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none opacity-20 transition-opacity group-hover:opacity-40"
                    style={{
                      background: isWork
                        ? 'radial-gradient(circle, #6366f1, transparent)'
                        : 'radial-gradient(circle, #a855f7, transparent)',
                    }}
                  />

                  <div>
                    {/* Badge & Date */}
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono border ${
                          isWork
                            ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                            : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                        }`}
                      >
                        {isWork ? <Briefcase size={13} /> : <User size={13} />}
                        {isWork ? t('experiences.work') : t('experiences.organization')}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        <Calendar size={13} />
                        <span>{exp.startDate} — {exp.endDate || t('experiences.present')}</span>
                      </div>
                    </div>

                    {/* Organization / Company Name */}
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                      {exp.organization}
                    </h3>

                    {/* Institution / Univ */}
                    {exp.institution && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                        <Building size={14} className="text-indigo-400 flex-shrink-0" />
                        <span>{exp.institution}</span>
                      </div>
                    )}

                    {/* Role / Jabatan */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-indigo-300 font-semibold text-sm mb-4">
                      <Briefcase size={14} className="text-indigo-400 flex-shrink-0" />
                      <span>{isEn ? 'Position: ' : 'Jabatan: '}<span className="text-white">{(isEn ? exp.roleEn : null) || exp.role}</span></span>
                    </div>


                    {/* Description */}
                    {((isEn ? exp.descriptionEn : null) || exp.description) && (
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {(isEn ? exp.descriptionEn : null) || exp.description}
                      </p>
                    )}
                  </div>

                  {/* Photo History Gallery */}
                  {exp.photos && exp.photos.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Camera size={14} className="text-indigo-400 flex-shrink-0" />
                        {isEn ? 'History Photos' : 'Foto History'} ({exp.photos.length})
                      </p>

                      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {exp.photos.map((photo, pIdx) => (
                          <motion.div
                            key={photo.id || pIdx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group/photo flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-indigo-400 transition-all"
                            onClick={() => setSelectedPhoto({ url: photo.url, caption: (isEn ? photo.captionEn : null) || photo.caption || `${exp.organization} - ${(isEn ? exp.roleEn : null) || exp.role}` })}
                          >
                            <img
                              src={photo.url}
                              alt={(isEn ? photo.captionEn : null) || photo.caption || 'History photo'}
                              className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-xs text-white font-mono bg-black/60 px-2 py-0.5 rounded">{isEn ? 'View' : 'Lihat'}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {filteredExperiences.length > 1 && (
            <p className="text-center text-xs text-indigo-400/70 font-mono mt-4 md:hidden">
              {isEn ? "← Swipe to see more experiences →" : "← Geser untuk melihat pengalaman lainnya →"}
            </p>
          )}

          {filteredExperiences.length === 0 && (
            <div className="text-center py-20 glass-card">
              <Briefcase size={48} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">{t('common.noData')}</p>
            </div>
          )}

        </div>

        {/* Modal Lightbox Photo History */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card max-w-4xl w-full overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10 transition-colors"
                >
                  <X size={20} />
                </button>
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption || 'History Photo'}
                  className="w-full max-h-[75vh] object-contain bg-black/50"
                />
                {selectedPhoto.caption && (
                  <div className="p-4 bg-black/60 text-center">
                    <p className="text-white font-medium text-sm">{selectedPhoto.caption}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 7. CONTACT SECTION */}

      <section id="contact" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="orb orb-1" style={{ opacity: 0.05 }} />
        <div className="orb orb-2" style={{ opacity: 0.05 }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
              {t('contact.subtitle')}
            </span>
            <h2 className="section-title">
              <span className="text-white">{t('contact.titleWhite')}</span>
              <span className="gradient-text">{t('contact.titleGradient')}</span>
            </h2>
            <p className="section-subtitle max-w-xl mx-auto">
              {t('contact.description')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-8">{t('contact.talkAbout')}</h3>

              <div className="space-y-4 mb-10">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-4 p-4 glass-card hover:border-indigo-500/40 transition-all duration-300 group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
                    >
                      <Icon size={20} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">{label}</p>
                      <p className="text-white font-medium">{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">{t('contact.followMe')}</h4>
                <div className="flex gap-3">
                  {socials.map((social) => {
                    const Icon = socialIcons[social.platform] || Github;
                    return (
                      <motion.a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 social-icon-btn social-icon-${social.platform.toLowerCase()}`}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' } as any}
                        whileHover={{ scale: 1.1, y: -3 }}
                        aria-label={social.platform}
                      >
                        <Icon size={20} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="glass-card p-10 text-center"
                >
                  <CheckCircle size={64} className="text-green-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-3">{t('contact.messageSent')}</h3>
                  <p className="text-gray-400 mb-6">{t('contact.thankYou')}</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="btn-primary"
                  >
                    {t('contact.sendAnother')}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                  <h3 className="text-xl font-bold text-white mb-2">{t('contact.sendMessage')}</h3>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">{t('contact.yourName')}</label>
                    <input
                      type="text"
                      className="input-dark"
                      placeholder={t('contact.namePlaceholder')}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">{t('contact.emailAddress')}</label>
                    <input
                      type="email"
                      className="input-dark"
                      placeholder={t('contact.emailPlaceholder')}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">{t('contact.message')}</label>
                    <textarea
                      rows={5}
                      className="input-dark resize-none"
                      placeholder={t('contact.messagePlaceholder')}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner w-5 h-5" />
                        <span>{isEn ? 'Sending...' : 'Mengirim...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        {t('contact.send')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

