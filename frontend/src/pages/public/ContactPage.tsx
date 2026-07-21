import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { messageService, profileService, socialService } from '../../services';
import type { Profile, SocialMedia } from '../../types';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    profileService.get().then(res => setProfile(res.data)).catch(console.error);
    socialService.getAll().then(res => setSocials(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await messageService.send(form);
      setIsSuccess(true);
      setForm({ name: '', email: '', message: '' });
      toast.success('Message sent successfully! I will get back to you soon.');
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialIconMap: Record<string, any> = {
    GitHub: Github, LinkedIn: Linkedin, Instagram: Instagram, WhatsApp: MessageCircle,
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: profile?.email || 'irfansopandi1212@email.com', href: `mailto:${profile?.email || 'irfansopandi1212@email.com'}` },
    { icon: Phone, label: 'WhatsApp', value: profile?.phone || '+62 859-4665-3103', href: `https://wa.me/${(profile?.phone || '+6285946653103').replace(/\D/g, '')}` },
    { icon: MapPin, label: 'Location', value: profile?.location || 'Karawang, Indonesia', href: '#' },
  ];

  return (
    <div className="relative min-h-screen py-24">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="orb orb-1" style={{ opacity: 0.1 }} />
      <div className="orb orb-2" style={{ opacity: 0.08 }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest mb-4 block">
            — Get In Touch —
          </span>
          <h1 className="section-title">
            <span className="text-white">Contact </span>
            <span className="gradient-text">Me</span>
          </h1>
          <p className="section-subtitle max-w-xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8">Let's talk about your project</h2>

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

            {/* Social links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Me</h3>
              <div className="flex gap-3">
                {socials
                  .filter((social) => social.url && social.url !== '#' && social.url.trim() !== '')
                  .map((social) => {
                    const Icon = socialIconMap[social.platform] || Github;
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

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-10 text-center"
              >
                <CheckCircle size={64} className="text-green-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                <p className="text-gray-400 mb-6">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="btn-primary"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                <h2 className="text-xl font-bold text-white mb-2">Send Me a Message</h2>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Your Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    className="input-dark"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    id="contact-email"
                    className="input-dark"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className="input-dark resize-none"
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="spinner w-5 h-5" />
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
