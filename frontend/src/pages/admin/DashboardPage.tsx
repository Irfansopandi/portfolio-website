import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Award, MessageSquare, Eye, Mail, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { visitorService, messageService } from '../../services';
import type { DashboardStats, Message } from '../../types';

const DashboardPage = () => {
  const { i18n } = useTranslation();
  const isGlobalId = i18n.language === 'id';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      visitorService.getStats(),
      messageService.getAll(),
    ]).then(([statsRes, msgRes]) => {
      setStats(statsRes.data);
      setRecentMessages(msgRes.data.messages?.slice(0, 5) || []);
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = [
    {
      label: isGlobalId ? 'Total Proyek' : 'Total Projects',
      value: stats?.totalProjects ?? 0,
      icon: FolderOpen,
      color: '#6366f1',
      href: '/admin/projects',
      change: isGlobalId ? 'Data proyek' : 'Project data',
    },
    {
      label: isGlobalId ? 'Sertifikat' : 'Certificates',
      value: stats?.totalCertificates ?? 0,
      icon: Award,
      color: '#a855f7',
      href: '/admin/certificate',
      change: isGlobalId ? 'Sertifikat keahlian' : 'Skill certificates',
    },
    {
      label: isGlobalId ? 'Pesan' : 'Messages',
      value: stats?.totalMessages ?? 0,
      icon: MessageSquare,
      color: '#06b6d4',
      href: '/admin/messages',
      change: `${stats?.unreadMessages ?? 0} ${isGlobalId ? 'belum dibaca' : 'unread'}`,
    },
    {
      label: isGlobalId ? 'Total Pengunjung' : 'Total Visitors',
      value: stats?.totalVisitors ?? 0,
      icon: Eye,
      color: '#10b981',
      href: '#',
      change: isGlobalId ? 'Sepanjang waktu' : 'All time',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">
          Dashboard <span className="gradient-text">{isGlobalId ? 'Ringkasan' : 'Overview'}</span>
        </h1>
        <p className="text-gray-400">
          {isGlobalId ? 'Selamat datang kembali! Berikut ringkasan portofolio Anda.' : "Welcome back! Here's what's happening with your portfolio."}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, href, change }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Link to={href}>
              <div
                className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
                style={{ '--card-color': color } as any}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `${color}20`, border: `1px solid ${color}40` }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <TrendingUp size={16} className="text-gray-600 group-hover:text-green-400 transition-colors" />
                </div>

                {isLoading ? (
                  <div className="h-8 w-16 rounded animate-pulse bg-white/10 mb-2" />
                ) : (
                  <p className="text-4xl font-black text-white mb-1">{value.toLocaleString()}</p>
                )}

                <p className="text-gray-400 text-sm font-medium">{label}</p>
                <p className="text-xs mt-1" style={{ color: `${color}aa` }}>{change}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail size={20} className="text-indigo-400" />
            Recent Messages
          </h2>
          <Link to="/admin/messages" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            View all →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{msg.name}</span>
                    {msg.status === 'unread' && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mb-1">{msg.email}</p>
                  <p className="text-gray-400 text-sm truncate">{msg.message}</p>
                </div>
                <span className="text-gray-600 text-xs whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
      >
        {[
          { label: 'Add Project', href: '/admin/projects', emoji: '➕' },
          { label: 'Add Certificate', href: '/admin/certificate', emoji: '🏆' },
          { label: 'Edit Profile', href: '/admin/profile', emoji: '✏️' },
          { label: 'View Portfolio', href: '/', emoji: '👁️', external: true },
        ].map(({ label, href, emoji, external }) => (
          <Link
            key={label}
            to={href}
            target={external ? '_blank' : undefined}
            className="glass-card p-4 flex items-center gap-3 hover:border-indigo-500/40 transition-all duration-200 group"
          >
            <span className="text-xl">{emoji}</span>
            <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{label}</span>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
