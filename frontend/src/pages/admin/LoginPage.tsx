import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Selamat datang kembali! 👋');
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Login gagal. Silakan periksa kembali email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)' }}
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="orb orb-1" style={{ opacity: 0.15 }} />
      <div className="orb orb-2" style={{ opacity: 0.1 }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)',
            } as any}
          >
            IS
          </motion.div>
          <h1 className="text-2xl font-black text-white">Portal Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Irfan Sopandi Portfolio CMS</p>
        </div>

        {/* Form */}
        <div className="glass-card-dark p-8">
          <h2 className="text-xl font-bold text-white mb-6">Masuk Ke Akun</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Alamat Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="admin-email"
                  type="email"
                  className="input-dark pl-10"
                  placeholder="Masukkan email Anda..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Kata Sandi</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-dark pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="spinner w-5 h-5" />
              ) : (
                <>
                  <Lock size={16} />
                  Masuk ke Dashboard
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
