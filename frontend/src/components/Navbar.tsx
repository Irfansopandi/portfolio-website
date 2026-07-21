import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const navLinkKeys = [
  { path: '/', labelKey: 'navbar.home', sectionId: 'home' },
  { path: '/#about', labelKey: 'navbar.about', sectionId: 'about' },
  { path: '/#education', labelKey: 'navbar.education', sectionId: 'education' },
  { path: '/#skills', labelKey: 'navbar.skills', sectionId: 'skills' },
  { path: '/#projects', labelKey: 'navbar.projects', sectionId: 'projects' },
  { path: '/#certificates', labelKey: 'navbar.certificates', sectionId: 'certificates' },
  { path: '/#experiences', labelKey: 'navbar.experiences', sectionId: 'experiences' },
  { path: '/#contact', labelKey: 'navbar.contact', sectionId: 'contact' },
];

const Navbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active section based on scroll position
  useEffect(() => {
    const handleScrollActive = () => {
      const scrollPosition = window.scrollY + 180; // Offset for header height
      
      const sections = ['home', 'about', 'education', 'skills', 'projects', 'certificates', 'experiences', 'contact'];

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollActive);
    handleScrollActive(); // Run initially
    return () => window.removeEventListener('scroll', handleScrollActive);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const handleNavLinkClick = (e: React.MouseEvent, sectionId: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', sectionId === 'home' ? '/' : `#${sectionId}`);
        setActiveSection(sectionId);
      }
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="fixed top-4 inset-x-4 max-w-6xl mx-auto z-40 transition-all duration-300"
      >
        <div 
          className="rounded-full px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between transition-all duration-300 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          style={{
            background: isScrolled 
              ? 'rgba(15, 15, 26, 0.92)' 
              : 'rgba(20, 20, 35, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <Link 
            to="/" 
            onClick={(e) => handleNavLinkClick(e, 'home')}
            className="flex items-center gap-2.5 group pl-1"
          >
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-black text-white transition-all duration-300 group-hover:scale-110 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
              }}
            >
              IS
            </div>
            <span className="font-bold text-white text-xs sm:text-sm">
              Irfan <span className="gradient-text">Sopandi</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
            {navLinkKeys.map((link) => {
              const isActive = activeSection === link.sectionId && location.pathname === '/';
              return (
                <Link
                  key={link.sectionId}
                  to={link.path}
                  onClick={(e) => handleNavLinkClick(e, link.sectionId)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'rgba(99, 102, 241, 0.3)', border: '1px solid rgba(99, 102, 241, 0.5)' } as any}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{t(link.labelKey)}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden sm:flex items-center gap-2 pr-1">
            <LanguageSwitcher />
            <Link to="/admin/login" className="text-xs text-gray-400 hover:text-white transition-colors">
              {t('navbar.admin')}
            </Link>
            <a 
              href="#contact" 
              onClick={(e) => handleNavLinkClick(e, 'contact')}
              className="bg-white hover:bg-gray-100 text-slate-950 font-bold text-xs px-4 py-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
            >
              {t('navbar.hireMe')}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 inset-x-4 max-w-md mx-auto z-40 lg:hidden"
          >
            <div 
              className="rounded-3xl p-4 flex flex-col gap-1 border border-white/15 shadow-2xl"
              style={{
                background: 'rgba(15, 15, 26, 0.95)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {navLinkKeys.map((link) => {
                const isActive = activeSection === link.sectionId && location.pathname === '/';
                return (
                  <Link
                    key={link.sectionId}
                    to={link.path}
                    onClick={(e) => handleNavLinkClick(e, link.sectionId)}
                    className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-indigo-500/20 border border-indigo-500/40'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                );
              })}
              <div className="border-t border-white/10 mt-2 pt-3 flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <LanguageSwitcher align="left" />
                  <Link to="/admin/login" className="text-xs text-gray-400 hover:text-white">
                    {t('navbar.admin')}
                  </Link>
                </div>
                <a 
                  href="#contact" 
                  onClick={(e) => handleNavLinkClick(e, 'contact')}
                  className="bg-white text-slate-950 font-bold text-xs px-5 py-2 rounded-full text-center"
                >
                  {t('navbar.hireMe')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

};

export default Navbar;
