import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Save, Shield, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setIsSaving(true);
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Settings <span className="gradient-text">& Security</span></h1>
        <p className="text-gray-400">Manage your account settings and security.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Account info */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield size={20} className="text-indigo-400" /> Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold">{user?.email}</p>
                <p className="text-gray-400 text-sm capitalize">Role: {user?.role}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Account Active</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">Your admin account is active and secure.</p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock size={20} className="text-indigo-400" /> Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { label: 'Current Password', field: 'currentPassword', key: 'current' },
              { label: 'New Password', field: 'newPassword', key: 'new' },
              { label: 'Confirm New Password', field: 'confirmPassword', key: 'confirm' },
            ].map(({ label, field, key }) => (
              <div key={field}>
                <label className="block text-gray-400 text-sm mb-2">{label}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id={`pwd-${field}`}
                    type={showPasswords[key as keyof typeof showPasswords] ? 'text' : 'password'}
                    className="input-dark pl-10 pr-10"
                    value={form[field as keyof typeof form]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    required
                  />
                  <button type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    onClick={() => setShowPasswords({ ...showPasswords, [key]: !showPasswords[key as keyof typeof showPasswords] })}>
                    {showPasswords[key as keyof typeof showPasswords] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}

            <button id="change-pwd-btn" type="submit" disabled={isSaving}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {isSaving ? <div className="spinner w-4 h-4" /> : <Save size={16} />}
              Update Password
            </button>
          </form>
        </div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-white mb-6">About This Application</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Application', value: 'Irfan Sopandi Portfolio CMS' },
              { label: 'Version', value: '1.0.0' },
              { label: 'Frontend', value: 'React + Vite + TypeScript' },
              { label: 'Backend', value: 'Node.js + Express + Prisma' },
              { label: 'Database', value: 'MySQL' },
              { label: 'Storage', value: 'Cloudinary' },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
