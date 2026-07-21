import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Upload, Award, ExternalLink } from 'lucide-react';
import { certificateService } from '../../services';
import type { Certificate } from '../../types';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const defaultForm = { title: '', titleEn: '', issuer: '', date: '', credentialUrl: '' };

const AdminCertificatesPage = () => {
  const [items, setItems] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [activeLang, setActiveLang] = useState<'id' | 'en'>('id');
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    try { const res = await certificateService.getAll(); setItems(res.data); }
    catch { } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setActiveLang('id');
    setIsModalOpen(true);
  };

  const openEdit = (item: Certificate) => {
    setEditing(item);
    setForm({
      title: item.title,
      titleEn: item.titleEn || '',
      issuer: item.issuer,
      date: item.date,
      credentialUrl: item.credentialUrl || '',
    });
    setImagePreview(item.image || null);
    setImageFile(null);
    setActiveLang('id');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editing) { await certificateService.update(editing.id, fd); toast.success('Certificate updated!'); }
      else { await certificateService.create(fd); toast.success('Certificate added!'); }

      setIsModalOpen(false);
      fetchData();
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Failed');
    } finally { setIsSaving(false); }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await certificateService.delete(deleteId);
      toast.success('Sertifikat berhasil dihapus!');
      fetchData();
    } catch {
      toast.error('Gagal menghapus sertifikat');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Certificates <span className="gradient-text">Management</span></h1>
          <p className="text-gray-400">{items.length} certificates</p>
        </div>
        <button id="add-cert-btn" onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Certificate
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }} className="glass-card overflow-hidden group">
              <div className="h-40 overflow-hidden relative">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))' }}>
                    <Award size={40} className="text-indigo-400 opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-black/60 text-white hover:text-indigo-400">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDeleteClick(item.id)} className="p-2 rounded-lg bg-black/60 text-white hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-indigo-400 text-xs mb-1">{item.issuer}</p>
                <p className="text-gray-500 text-xs mb-3">{item.date}</p>
                {item.credentialUrl && (
                  <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
                    <ExternalLink size={12} /> View Credential
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {items.length === 0 && (
            <div className="col-span-3 text-center py-16 glass-card">
              <Award size={48} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No certificates yet. <button onClick={openCreate} className="text-indigo-400">Add one!</button></p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card-dark w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit' : 'Add'} Certificate</h2>
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 mr-4">
                  <button
                    type="button"
                    onClick={() => setActiveLang('id')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeLang === 'id' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>🇮🇩</span> Indo
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLang('en')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeLang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>🇬🇧</span> English
                  </button>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <label className="block cursor-pointer">
                  <div className="h-36 rounded-xl overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{ border: '2px dashed rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.05)' }}>
                    {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : (
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Upload size={24} className="text-indigo-400" />
                        <span className="text-xs">Upload certificate image</span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
                </label>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Certificate Name {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'} *
                  </label>
                  {activeLang === 'id' ? (
                    <input type="text" className="input-dark" placeholder="Sertifikat Keahlian React"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      required />
                  ) : (
                    <input type="text" className="input-dark" placeholder="React Certification of Expertise"
                      value={form.titleEn}
                      onChange={e => setForm({ ...form, titleEn: e.target.value })}
                      required />
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Issuer *</label>
                  <input type="text" className="input-dark" placeholder="Udemy, Google, AWS..."
                    value={form.issuer}
                    onChange={e => setForm({ ...form, issuer: e.target.value })}
                    required />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Date *</label>
                  <input type="text" className="input-dark" placeholder="2023-06"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    required />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Credential URL</label>
                  <input type="text" className="input-dark" placeholder="https://..."
                    value={form.credentialUrl}
                    onChange={e => setForm({ ...form, credentialUrl: e.target.value })} />
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-4 py-2">Cancel</button>
                  <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    {isSaving && <div className="spinner w-4 h-4" />}
                    {editing ? 'Update' : 'Add'} Certificate
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Hapus Sertifikat"
        message="Apakah Anda yakin ingin menghapus sertifikat ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
};

export default AdminCertificatesPage;
