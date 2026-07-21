import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, FolderOpen, GraduationCap, Briefcase,
  Code2, Award, MessageSquare, Settings, LogOut,
  Menu, Bell, ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import LanguageSwitcher from '../components/LanguageSwitcher';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, labelKey: 'admin.dashboard' },
  { path: '/admin/profile', icon: User, labelKey: 'admin.profile' },
  { path: '/admin/projects', icon: FolderOpen, labelKey: 'admin.projects' },
  { path: '/admin/education', icon: GraduationCap, labelKey: 'admin.education' },
  { path: '/admin/skills', icon: Code2, labelKey: 'admin.skills' },
  { path: '/admin/certificate', icon: Award, labelKey: 'admin.certificates' },
  { path: '/admin/experiences', icon: Briefcase, labelKey: 'admin.experiences' },
  { path: '/admin/messages', icon: MessageSquare, labelKey: 'admin.messages' },
  { path: '/admin/settings', icon: Settings, labelKey: 'admin.settings' },
];

interface SidebarProps {
  mobile?: boolean;
  userEmail?: string;
  userRole?: string;
  onClose?: () => void;
  onLogout: () => void;
}

const Sidebar = ({ mobile = false, userEmail, userRole, onClose, onLogout }: SidebarProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col h-full ${mobile ? 'p-4' : 'p-6'}`}
      style={{
        background: 'rgba(15, 15, 26, 0.98)',
        borderRight: '1px solid rgba(99, 102, 241, 0.2)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
        >
          IS
        </div>
        <div>
          <p className="font-bold text-white text-sm">{t('admin.cmsTitle')}</p>
          <p className="text-gray-500 text-xs">{t('admin.cmsSubtitle')}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ path, icon: Icon, labelKey }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => mobile && onClose?.()}
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span className="text-sm">{t(labelKey)}</span>
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100" />
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="border-t border-white/10 pt-4 mt-4">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            {userEmail?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{userEmail}</p>
            <p className="text-gray-500 text-xs capitalize">{userRole}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="admin-nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          <span className="text-sm">{t('admin.logout')}</span>
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUnreadCount = async () => {
    try {
      const res = await messageService.getUnreadCount();
      setUnreadCount(res.data.count);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutConfirmOpen(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a14' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 flex-col fixed left-0 top-0 bottom-0 z-20">
        <Sidebar
          userEmail={user?.email}
          userRole={user?.role}
          onLogout={handleLogoutClick}
        />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-40 lg:hidden"
            >
              <Sidebar
                mobile
                userEmail={user?.email}
                userRole={user?.role}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogoutClick}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top header */}
        <header
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{
            background: 'rgba(10, 10, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <button
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="lg:flex-1" />

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <NavLink
              to="/admin/messages"
              className="relative p-2 rounded-xl text-gray-400 hover:text-white transition-colors flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="Messages Inbox"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-md border border-slate-900">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-2 rounded-xl text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 transition-all font-medium"
            >
              {t('admin.viewPortfolio')}
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title={t('admin.confirmLogoutTitle')}
        message={t('admin.confirmLogoutMessage')}
        confirmLabel={t('admin.confirmLogoutButton')}
        cancelLabel={t('admin.cancelButton')}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        isDanger={true}
      />
    </div>
  );
};

export default AdminLayout;
