import { useEffect, useState } from 'react';
import { Save, Upload, User, FileText, Globe } from 'lucide-react';
import { profileService, socialService } from '../../services';
import type { Profile, SocialMedia } from '../../types';
import toast from 'react-hot-toast';

const AdminProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [activeLang, setActiveLang] = useState<'id' | 'en'>('id');
  const [form, setForm] = useState({
    name: '', profession: '', professionEn: '', bio: '', bioEn: '', aboutText: '', aboutTextEn: '',
    email: '', phone: '', location: '', cvUrl: '',
  });

  useEffect(() => {
    Promise.all([
      profileService.get(),
      socialService.getAll(),
    ]).then(([profileRes, socialRes]) => {
      const p = profileRes.data;
      setProfile(p);
      setSocials(socialRes.data);
      setForm({
        name: p.name || '',
        profession: p.profession || '',
        professionEn: p.professionEn || '',
        bio: p.bio || '',
        bioEn: p.bioEn || '',
        aboutText: p.aboutText || '',
        aboutTextEn: p.aboutTextEn || '',
        email: p.email || '',
        phone: p.phone || '',
        location: p.location || '',
        cvUrl: p.cvUrl || '',
      });
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileService.update(form);
      toast.success('Profile updated successfully!');
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'about') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('imageType', type);

    try {
      await profileService.updateImage(formData);
      toast.success(`${type === 'profile' ? 'Profile' : 'About'} image updated!`);
      // Refresh profile data
      const refreshed = await profileService.get();
      setProfile(refreshed.data);
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to upload image';
      toast.error(msg);
      console.error('Upload error:', error);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cv', file);

    setIsUploadingCV(true);
    try {
      const res = await profileService.updateCV(formData);
      const newCvUrl = res.data.cvUrl;
      setForm((prev) => ({ ...prev, cvUrl: newCvUrl }));
      toast.success('CV uploaded successfully!');
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to upload CV';
      toast.error(msg);
      console.error('CV upload error:', error);
    } finally {
      setIsUploadingCV(false);
    }
  };

  const handleSocialUpdate = async (platform: string, url: string) => {
    try {
      await socialService.upsert({ platform, url });
      toast.success(`${platform} updated!`);
    } catch {
      toast.error('Failed to update social media');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="spinner" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">
          Profile <span className="gradient-text">Management</span>
        </h1>
        <p className="text-gray-400">Update your personal information and public profile.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="space-y-6">
          {/* Profile image */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-indigo-400" /> Profile Photo
            </h3>
            <div className="aspect-square rounded-2xl overflow-hidden mb-4"
              style={{ border: '2px solid rgba(99,102,241,0.3)' }}>
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl"
                  style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
                  <span className="gradient-text font-black">IS</span>
                </div>
              )}
            </div>
            <label className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer">
              <Upload size={16} /> Upload Photo
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => handleImageUpload(e, 'profile')} />
            </label>
          </div>

          {/* About image */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-purple-400" /> About Photo
            </h3>
            <div className="aspect-square rounded-2xl overflow-hidden mb-4"
              style={{ border: '2px solid rgba(168,85,247,0.3)' }}>
              {profile?.aboutImage ? (
                <img src={profile.aboutImage} alt="About" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: 'rgba(168,85,247,0.1)' }}>
                  <User size={48} className="text-purple-400 opacity-30" />
                </div>
              )}
            </div>
            <label className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer border-purple-500/30 text-purple-400">
              <Upload size={16} /> Upload Photo
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => handleImageUpload(e, 'about')} />
            </label>
          </div>
        </div>

        {/* Profile form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-white/10 pb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-indigo-400" /> Basic Information
              </h3>
              {/* Language Tabs */}
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveLang('id')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeLang === 'id' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>🇮🇩</span> Indo
                </button>
                <button
                  onClick={() => setActiveLang('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeLang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>🇬🇧</span> English
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Common global fields */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  className="input-dark"
                  placeholder="Irfan Sopandi"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Language dependent field (Profession) */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Profession {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'}
                </label>
                {activeLang === 'id' ? (
                  <input
                    id="profile-profession-id"
                    type="text"
                    className="input-dark"
                    placeholder="Full-Stack Developer"
                    value={form.profession}
                    onChange={(e) => setForm({ ...form, profession: e.target.value })}
                  />
                ) : (
                  <input
                    id="profile-profession-en"
                    type="text"
                    className="input-dark"
                    placeholder="Full-Stack Developer (English)"
                    value={form.professionEn}
                    onChange={(e) => setForm({ ...form, professionEn: e.target.value })}
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input
                  id="profile-email"
                  type="text"
                  className="input-dark"
                  placeholder="irfan@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Phone</label>
                <input
                  id="profile-phone"
                  type="text"
                  className="input-dark"
                  placeholder="+62 812-xxx-xxxx"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Location</label>
                <input
                  id="profile-location"
                  type="text"
                  className="input-dark"
                  placeholder="Karawang, Indonesia"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">CV URL</label>
                <div className="flex gap-2">
                  <input
                    id="profile-cvUrl"
                    type="text"
                    className="input-dark flex-1"
                    placeholder="https://..."
                    value={form.cvUrl}
                    onChange={(e) => setForm({ ...form, cvUrl: e.target.value })}
                  />
                  <label className={`btn-secondary px-4 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 ${isUploadingCV ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isUploadingCV ? (
                      <div className="spinner w-4 h-4" />
                    ) : (
                      <Upload size={16} />
                    )}
                    <span>Upload CV</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      disabled={isUploadingCV}
                      onChange={handleCVUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Bio depending on active language */}
            <div className="mt-4">
              <label className="block text-gray-400 text-sm mb-2 flex items-center gap-1.5">
                <Globe size={14} className="text-indigo-400" />
                Short Bio (Hero section) {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'}
              </label>
              {activeLang === 'id' ? (
                <textarea
                  id="profile-bio-id"
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="Short bio shown on the homepage..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              ) : (
                <textarea
                  id="profile-bio-en"
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="Short bio shown on the homepage (English)..."
                  value={form.bioEn}
                  onChange={(e) => setForm({ ...form, bioEn: e.target.value })}
                />
              )}
            </div>

            {/* About Text depending on active language */}
            <div className="mt-4">
              <label className="block text-gray-400 text-sm mb-2 flex items-center gap-1.5">
                <Globe size={14} className="text-indigo-400" />
                About Text (About page) {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'}
              </label>
              {activeLang === 'id' ? (
                <textarea
                  id="profile-about-id"
                  rows={5}
                  className="input-dark resize-none"
                  placeholder="Full about me text..."
                  value={form.aboutText}
                  onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
                />
              ) : (
                <textarea
                  id="profile-about-en"
                  rows={5}
                  className="input-dark resize-none"
                  placeholder="Full about me text (English)..."
                  value={form.aboutTextEn}
                  onChange={(e) => setForm({ ...form, aboutTextEn: e.target.value })}
                />
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                id="profile-save-btn"
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <div className="spinner w-4 h-4" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Social media */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-white mb-6">Social Media Links</h3>
            <div className="space-y-4">
              {['GitHub', 'LinkedIn', 'Instagram', 'WhatsApp'].map((platform) => {
                const social = socials.find(s => s.platform === platform);
                return (
                  <div key={platform} className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-24 flex-shrink-0">{platform}</span>
                    <input
                      type="text"
                      className="input-dark flex-1"
                      placeholder={`https://${platform.toLowerCase()}.com/...`}
                      defaultValue={social?.url || ''}
                      onBlur={(e) => {
                        if (e.target.value !== (social?.url || '')) {
                          handleSocialUpdate(platform, e.target.value);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
