import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Briefcase, Users, Image as ImageIcon, Upload, MapPin, Calendar, Globe } from 'lucide-react';

import { experienceService } from '../../services';
import type { Experience } from '../../types';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const defaultForm = {
  type: 'work' as 'work' | 'organization',
  organization: '',
  institution: '',
  role: '',
  roleEn: '',
  startDate: '',
  endDate: '',
  description: '',
  descriptionEn: '',
  order: '0',
};

interface NewPhotoItem {
  file: File;
  preview: string;
}

const NewPhotoPreviewCard = ({ item, onRemove }: { item: NewPhotoItem; onRemove: () => void }) => {
  const [hasError, setHasError] = useState(false);
  const isHeic = item.file.name.toLowerCase().endsWith('.heic') || item.file.name.toLowerCase().endsWith('.heif');

  return (
    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-indigo-500/40 bg-white/5 flex flex-col items-center justify-center p-1 text-center">
      {!hasError && !isHeic ? (
        <img
          src={item.preview}
          alt={item.file.name}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center px-1">
          <ImageIcon size={20} className="text-indigo-400 mb-0.5" />
          <span className="text-[9px] text-gray-300 font-mono line-clamp-2 leading-tight break-all">
            {item.file.name}
          </span>
          <span className="text-[8px] text-indigo-300 font-mono bg-indigo-500/20 px-1 rounded mt-0.5">
            {isHeic ? 'HEIC' : 'FILE'}
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X size={12} />
      </button>
    </div>
  );
};

const ExistingPhotoPreviewCard = ({ photo, onRemove }: { photo: { id?: string; url: string; caption?: string }; onRemove: () => void }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex flex-col items-center justify-center p-1 text-center">
      {!hasError ? (
        <img
          src={photo.url}
          alt={photo.caption || 'Photo'}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center px-1">
          <ImageIcon size={20} className="text-gray-400 mb-0.5" />
          <span className="text-[9px] text-gray-400 font-mono">Image</span>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X size={12} />
      </button>
    </div>
  );
};

const AdminExperiencesPage = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'work' | 'organization'>('all');
  const [items, setItems] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [activeLang, setActiveLang] = useState<'id' | 'en'>('id');
  const [form, setForm] = useState(defaultForm);
  const [photoFiles, setPhotoFiles] = useState<NewPhotoItem[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<{ id?: string; url: string; caption?: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await experienceService.getAll();
      setItems(res.data);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setPhotoFiles([]);
    setExistingPhotos([]);
    setActiveLang('id');
    setIsModalOpen(true);
  };

  const openEdit = (item: Experience) => {
    setEditing(item);
    setForm({
      type: item.type,
      organization: item.organization,
      institution: item.institution || '',
      role: item.role,
      roleEn: item.roleEn || '',
      startDate: item.startDate,
      endDate: item.endDate || '',
      description: item.description || '',
      descriptionEn: item.descriptionEn || '',
      order: String(item.order || 0),
    });
    setExistingPhotos(item.photos || []);
    setPhotoFiles([]);
    setActiveLang('id');
    setIsModalOpen(true);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoFiles(prev => [...prev, { file, preview: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const removeNewPhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.organization || !form.role || !form.startDate) {
      toast.error('Harap isi field wajib (Nama, Jabatan, Tanggal Mulai)');
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('type', form.type);
      fd.append('organization', form.organization);
      fd.append('institution', form.institution);
      fd.append('role', form.role);
      fd.append('roleEn', form.roleEn);
      fd.append('startDate', form.startDate);
      fd.append('endDate', form.endDate);
      fd.append('description', form.description);
      fd.append('descriptionEn', form.descriptionEn);
      fd.append('order', form.order);

      // Append existing photos if any remain
      if (existingPhotos.length > 0) {
        fd.append('photos', JSON.stringify(existingPhotos));
      }

      // Append new photo files
      photoFiles.forEach(item => {
        fd.append('photos', item.file);
      });

      if (editing) {
        await experienceService.update(editing.id, fd);
        toast.success('Pengalaman berhasil diperbarui!');
      } else {
        await experienceService.create(fd);
        toast.success('Pengalaman baru berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      const msg = error?.response?.data?.error;
      toast.error(msg || 'Gagal menyimpan pengalaman');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await experienceService.delete(deleteId);
      toast.success('Pengalaman berhasil dihapus!');
      fetchData();
    } catch {
      toast.error('Gagal menghapus data pengalaman');
    } finally {
      setDeleteId(null);
    }
  };

  const experienceTabs = [
    { id: 'all', label: 'Semua Pengalaman', count: items.length, icon: null },
    { id: 'work', label: 'Pengalaman Kerja', count: items.filter(i => i.type === 'work').length, icon: Briefcase },
    { id: 'organization', label: 'Pengalaman Organisasi', count: items.filter(i => i.type === 'organization').length, icon: Users },
  ];

  const filteredItems = items.filter(item => {
    if (activeCategory === 'all') return true;
    return item.type === activeCategory;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            Experience <span className="gradient-text">Management</span>
          </h1>
          <p className="text-gray-400">{items.length} total experiences</p>
        </div>
        <button id="add-experience-btn" onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Tambah Pengalaman
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white/5 p-1 rounded-2xl border border-white/10 self-start w-fit">
        {experienceTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              {Icon && <Icon size={14} />}
              {tab.label}
              <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                isActive ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isWork = item.type === 'work';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      isWork
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}
                  >
                    {isWork ? <Briefcase size={20} /> : <Users size={20} />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isWork
                            ? 'bg-indigo-500/15 text-indigo-400'
                            : 'bg-purple-500/15 text-purple-400'
                        }`}
                      >
                        {isWork ? 'Pengalaman Kerja' : 'Organisasi'}
                      </span>
                      <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                        <Calendar size={12} />
                        {item.startDate} — {item.endDate || 'Sekarang'}
                      </span>
                    </div>

                    {/* Organization / Company Name */}
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                      {item.organization}
                    </h3>

                    {/* Institution / Univ */}
                    {item.institution && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                        <MapPin size={13} className="text-gray-500 flex-shrink-0" />
                        <span>{item.institution}</span>
                      </div>
                    )}

                    {/* Role / Jabatan */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-indigo-300 font-semibold text-xs mb-3">
                      <span>Jabatan: <span className="text-white">{item.role}</span></span>
                    </div>

                    {item.description && (
                      <p className="text-gray-400 text-sm mt-2 leading-relaxed">{item.description}</p>
                    )}

                    {/* Photos list preview */}
                    {item.photos && item.photos.length > 0 && (
                      <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                        {item.photos.map((p, i) => (
                          <img
                            key={p.id || i}
                            src={p.url}
                            alt={p.caption || 'History Photo'}
                            className="w-14 h-14 rounded-lg object-cover border border-white/10 hover:border-indigo-400/50 transition-all"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 self-end md:self-start">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                    title="Edit Pengalaman"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Hapus Pengalaman"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {items.length === 0 && (
            <div className="text-center py-16 glass-card">
              <Briefcase size={48} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                Belum ada pengalaman.{' '}
                <button onClick={openCreate} className="text-indigo-400 underline font-medium">
                  Tambah sekarang!
                </button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card-dark w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                <h2 className="text-xl font-bold text-white">
                  {editing ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
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
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                {/* Type selection */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-medium">Kategori Pengalaman *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'work' })}
                      className={`p-3 rounded-xl flex items-center justify-center gap-2 border text-sm font-semibold transition-all ${
                        form.type === 'work'
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Briefcase size={16} /> Pengalaman Kerja
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'organization' })}
                      className={`p-3 rounded-xl flex items-center justify-center gap-2 border text-sm font-semibold transition-all ${
                        form.type === 'organization'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Users size={16} /> Pengalaman Organisasi
                    </button>
                  </div>
                </div>

                {/* Organization / Company name */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1 font-medium">
                    {form.type === 'work' ? 'Nama Perusahaan / Perusahaan Tempat Kerja *' : 'Nama Organisasi *'}
                  </label>
                  <input
                    type="text"
                    className="input-dark"
                    placeholder={form.type === 'work' ? 'e.g. PT Digital Solusi Indonesia' : 'e.g. Himpunan Mahasiswa Teknik Informatika'}
                    value={form.organization}
                    onChange={e => setForm({ ...form, organization: e.target.value })}
                    required
                  />
                </div>

                {/* Institution / Univ */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1 font-medium">
                    {form.type === 'work' ? 'Instansi / Cabang / Lokasi' : 'Nama Univ / Sekolah / Kampus'}
                  </label>
                  <input
                    type="text"
                    className="input-dark"
                    placeholder={form.type === 'work' ? 'e.g. Headquarter Jakarta Pusat' : 'e.g. Bina Sarana Informatika University'}
                    value={form.institution}
                    onChange={e => setForm({ ...form, institution: e.target.value })}
                  />
                </div>

                {/* Position / Role */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1 font-medium flex items-center gap-1">
                    Nama Jabatan / Position {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'} *
                  </label>
                  {activeLang === 'id' ? (
                    <input
                      type="text"
                      className="input-dark"
                      placeholder={form.type === 'work' ? 'e.g. Senior Full-Stack Developer' : 'e.g. Ketua Divisi IPTEK & Riset'}
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                      required
                    />
                  ) : (
                    <input
                      type="text"
                      className="input-dark"
                      placeholder={form.type === 'work' ? 'e.g. Senior Full-Stack Developer (English)' : 'e.g. Head of IT Division'}
                      value={form.roleEn}
                      onChange={e => setForm({ ...form, roleEn: e.target.value })}
                      required
                    />
                  )}
                </div>

                {/* Period: Start date & End date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1 font-medium">Tanggal Mulai (Bulan & Tahun) *</label>
                    <input
                      type="text"
                      className="input-dark"
                      placeholder="e.g. Januari 2022"
                      value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1 font-medium">Tanggal Selesai</label>
                    <input
                      type="text"
                      className="input-dark"
                      placeholder="e.g. Desember 2023 / Sekarang"
                      value={form.endDate}
                      onChange={e => setForm({ ...form, endDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1 font-medium flex items-center gap-1">
                    <Globe size={14} className="text-indigo-400" />
                    Deskripsi Kegiatan / Responsibilities {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'}
                  </label>
                  {activeLang === 'id' ? (
                    <textarea
                      rows={4}
                      className="input-dark resize-none"
                      placeholder="Tuliskan tugas, tanggung jawab, dan pencapaian selama menjabat..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  ) : (
                    <textarea
                      rows={4}
                      className="input-dark resize-none"
                      placeholder="Describe duties, responsibilities, and achievements..."
                      value={form.descriptionEn}
                      onChange={e => setForm({ ...form, descriptionEn: e.target.value })}
                    />
                  )}
                </div>

                {/* History Photos Upload Section */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-medium flex items-center gap-2">
                    <ImageIcon size={16} className="text-indigo-400" /> Foto History / Dokumentasi
                  </label>

                  {/* Existing photos preview */}
                  {existingPhotos.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Foto Terimpan:</p>
                      <div className="flex flex-wrap gap-2">
                        {existingPhotos.map((photo, idx) => (
                          <ExistingPhotoPreviewCard
                            key={photo.id || idx}
                            photo={photo}
                            onRemove={() => removeExistingPhoto(idx)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New photo files preview */}
                  {photoFiles.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Foto Baru Ditambahkan:</p>
                      <div className="flex flex-wrap gap-2">
                        {photoFiles.map((item, idx) => (
                          <NewPhotoPreviewCard
                            key={idx}
                            item={item}
                            onRemove={() => removeNewPhoto(idx)}
                          />
                        ))}
                      </div>
                    </div>
                  )}



                  {/* Upload button */}
                  <label className="border-2 border-dashed border-white/15 hover:border-indigo-500/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02]">
                    <Upload size={24} className="text-indigo-400 mb-1" />
                    <span className="text-xs text-gray-300 font-medium">Klik untuk upload foto history</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">JPEG, PNG, WebP, HEIC (Bisa pilih beberapa foto sekaligus)</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, image/heif, .heic, .heif"
                      multiple
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />

                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary px-4 py-2"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving && <div className="spinner w-4 h-4" />}
                    {editing ? 'Simpan Perubahan' : 'Tambah Pengalaman'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Hapus Pengalaman"
        message="Apakah Anda yakin ingin menghapus data pengalaman ini beserta seluruh fotonya?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
};

export default AdminExperiencesPage;
