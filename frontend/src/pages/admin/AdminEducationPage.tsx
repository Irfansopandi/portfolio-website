import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, GraduationCap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { educationService } from '../../services';
import type { Education } from '../../types';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const defaultForm = {
  institution: '',
  degree: '',
  degreeEn: '',
  startDate: '',
  endDate: '',
  description: '',
  descriptionEn: '',
  order: '0',
};

const AdminEducationPage = () => {
  const { i18n } = useTranslation();
  const isGlobalId = i18n.language === 'id';

  const [items, setItems] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [activeLang, setActiveLang] = useState<'id' | 'en'>('id');
  const [form, setForm] = useState(defaultForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await educationService.getAll();
      setItems(res.data);
    } catch { } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setActiveLang('id');
    setIsModalOpen(true);
  };

  const openEdit = (item: Education) => {
    setEditing(item);
    setForm({
      institution: item.institution,
      degree: item.degree,
      degreeEn: item.degreeEn || '',
      startDate: item.startDate,
      endDate: item.endDate || '',
      description: item.description || '',
      descriptionEn: item.descriptionEn || '',
      order: String(item.order),
    });
    setActiveLang('id');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      if (editing) {
        await educationService.update(editing.id, fd);
        toast.success('Education updated!');
      } else {
        await educationService.create(fd);
        toast.success('Education added!');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Failed to save');
    } finally { setIsSaving(false); }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await educationService.delete(deleteId);
      toast.success('Pendidikan berhasil dihapus!');
      fetchData();
    } catch {
      toast.error('Gagal menghapus data pendidikan');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            {isGlobalId ? 'Manajemen ' : 'Education '}
            <span className="gradient-text">{isGlobalId ? 'Pendidikan' : 'Management'}</span>
          </h1>
          <p className="text-gray-400">
            {items.length} {isGlobalId ? 'data pendidikan' : 'education records'}
          </p>
        </div>
        <button id="add-education-btn" onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> {isGlobalId ? 'Tambah Pendidikan' : 'Add Education'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }} className="glass-card p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <GraduationCap size={22} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">{item.institution}</h3>
                <p className="text-indigo-400 text-sm mb-1">{isGlobalId && item.degreeEn ? item.degree : (item.degreeEn || item.degree)}</p>
                <p className="text-gray-500 text-sm">{item.startDate} — {item.endDate || (isGlobalId ? 'Sekarang' : 'Present')}</p>
                {item.description && <p className="text-gray-400 text-sm mt-2">{isGlobalId && item.descriptionEn ? item.description : (item.descriptionEn || item.description)}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)}
                  className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteClick(item.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-16 glass-card">
              <GraduationCap size={48} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                {isGlobalId ? 'Belum ada data pendidikan. ' : 'No education records. '}
                <button onClick={openCreate} className="text-indigo-400">
                  {isGlobalId ? 'Tambahkan sekarang!' : 'Add one!'}
                </button>
              </p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card-dark w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">
                  {editing ? (activeLang === 'id' ? 'Edit Pendidikan' : 'Edit Education') : (activeLang === 'id' ? 'Tambah Pendidikan' : 'Add Education')}
                </h2>
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
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    {activeLang === 'id' ? 'Institusi *' : 'Institution *'}
                  </label>
                  <input type="text" className="input-dark" placeholder={activeLang === 'id' ? "Contoh: Universitas Indonesia" : "e.g. Harvard University"}
                    value={form.institution}
                    onChange={e => setForm({ ...form, institution: e.target.value })}
                    required />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Degree {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'} *
                  </label>
                  {activeLang === 'id' ? (
                    <input type="text" className="input-dark" placeholder="Diploma Tiga Sistem Informasi"
                      value={form.degree}
                      onChange={e => setForm({ ...form, degree: e.target.value })}
                      required />
                  ) : (
                    <input type="text" className="input-dark" placeholder="Associate's Degree of Information Systems"
                      value={form.degreeEn}
                      onChange={e => setForm({ ...form, degreeEn: e.target.value })}
                      required />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">
                      {activeLang === 'id' ? 'Tahun Mulai *' : 'Start Year *'}
                    </label>
                    <input type="text" className="input-dark" placeholder="2020"
                      value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      required />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">
                      {activeLang === 'id' ? 'Tahun Selesai' : 'End Year'}
                    </label>
                    <input type="text" className="input-dark" placeholder={activeLang === 'id' ? "2024 / Sekarang" : "2024 / Present"}
                      value={form.endDate}
                      onChange={e => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    {activeLang === 'id' ? 'Urutan' : 'Order'}
                  </label>
                  <input type="number" className="input-dark" placeholder="1"
                    value={form.order}
                    onChange={e => setForm({ ...form, order: e.target.value })} />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1 flex items-center gap-1">
                    <Globe size={14} className="text-indigo-400" />
                    Description {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'}
                  </label>
                  {activeLang === 'id' ? (
                    <textarea rows={3} className="input-dark resize-none" placeholder="Deskripsi studi..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })} />
                  ) : (
                    <textarea rows={3} className="input-dark resize-none" placeholder="Study description (English)..."
                      value={form.descriptionEn}
                      onChange={e => setForm({ ...form, descriptionEn: e.target.value })} />
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-4 py-2">
                    {activeLang === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    {isSaving && <div className="spinner w-4 h-4" />}
                    {isSaving 
                      ? (activeLang === 'id' ? 'Memproses...' : 'Processing...') 
                      : editing 
                        ? (activeLang === 'id' ? 'Simpan Perubahan' : 'Update Education') 
                        : (activeLang === 'id' ? 'Tambah Pendidikan' : 'Add Education')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title={activeLang === 'id' ? 'Hapus Pendidikan' : 'Delete Education'}
        message={activeLang === 'id' ? 'Apakah Anda yakin ingin menghapus pendidikan ini? Tindakan ini tidak dapat dibatalkan.' : 'Are you sure you want to delete this education record? This action cannot be undone.'}
        confirmLabel={activeLang === 'id' ? 'Hapus' : 'Delete'}
        cancelLabel={activeLang === 'id' ? 'Batal' : 'Cancel'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
};

export default AdminEducationPage;
