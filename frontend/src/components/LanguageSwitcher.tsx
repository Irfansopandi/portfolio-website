import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

interface LanguageSwitcherProps {
  align?: 'left' | 'right';
  direction?: 'down' | 'up';
}

const LanguageSwitcher = ({ align = 'right', direction = 'down' }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLanguage = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        aria-label="Switch language"
      >
        <Globe size={13} className="text-indigo-400" />
        <span className="hidden sm:inline">{currentLang.flag}</span>
        <span className="text-[10px] uppercase font-bold">{currentLang.code}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'up' ? 8 : -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'up' ? 8 : -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} ${
              direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
            } rounded-xl overflow-hidden shadow-2xl border border-white/10 z-50 min-w-[140px]`}
            style={{
              background: 'rgba(15, 15, 26, 0.98)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2.5 transition-colors ${
                  i18n.language === lang.code
                    ? 'bg-indigo-600/30 text-white font-bold'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
