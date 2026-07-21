import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, MessageCircle, Heart, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { socialService } from '../services';
import type { SocialMedia } from '../types';

const Footer = () => {
  const { t } = useTranslation();
  const [socials, setSocials] = useState<SocialMedia[]>([]);

  useEffect(() => {
    socialService.getAll()
      .then((res) => setSocials(res.data))
      .catch((err) => console.error('Failed to fetch socials in footer:', err));
  }, []);

  const navLinks = [
    { path: '/', labelKey: 'navbar.home' },
    { path: '/about', labelKey: 'navbar.about' },
    { path: '/projects', labelKey: 'navbar.projects' },
    { path: '/skills', labelKey: 'navbar.skills' },
    { path: '/certificates', labelKey: 'navbar.certificates' },
    { path: '/contact', labelKey: 'navbar.contact' },
  ];

  const socialIconMap: Record<string, any> = {
    GitHub: Github,
    LinkedIn: Linkedin,
    Instagram: Instagram,
    WhatsApp: MessageCircle,
  };

  const defaultSocialLinks = [
    { icon: Github, href: 'https://github.com/Irfansopandi/', label: 'GitHub', platform: 'github' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', platform: 'linkedin' },
    { icon: Instagram, href: 'https://www.instagram.com/irfan_sopandi_/', label: 'Instagram', platform: 'instagram' },
    { icon: MessageCircle, href: 'https://wa.me/6285946653103', label: 'WhatsApp', platform: 'whatsapp' },
  ];

  return (
    <footer className="relative border-t border-white/10 py-12">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
              >
                IS
              </div>
              <span className="font-bold text-white text-lg">
                Irfan <span className="gradient-text">Sopandi</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.navigation')}</h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.connect')}</h4>
            <div className="flex gap-3">
              {socials.length > 0 ? (
                socials
                  .filter((social) => social.url && social.url !== '#' && social.url.trim() !== '')
                  .map((social) => {
                    const Icon = socialIconMap[social.platform] || Github;
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 social-icon-btn social-icon-${social.platform.toLowerCase()}`}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                        aria-label={social.platform}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })
              ) : (
                defaultSocialLinks
                  .filter((link) => link.href && link.href !== '#' && link.href.trim() !== '')
                  .map(({ icon: Icon, href, label, platform }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 social-icon-btn social-icon-${platform}`}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      aria-label={label}
                    >
                      <Icon size={18} />
                    </a>
                  ))
              )}
            </div>
            <p className="text-gray-500 text-sm mt-4 flex items-center gap-1.5">
              <MapPin size={14} className="text-indigo-400" /> Karawang, Indonesia
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            {t('footer.madeWith')} <Heart size={14} className="text-pink-500 animate-pulse" /> using React & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
