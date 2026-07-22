import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, ExternalLink, Github, X, Upload, Search, Folder, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { projectService } from '../../services';
import type { Project } from '../../types';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const CATEGORIES = ['Web Application', 'Mobile Application', 'Machine Learning', 'Other'];

const defaultForm = {
  title: '', titleEn: '', category: 'Web Application', description: '', descriptionEn: '',
  features: '', featuresEn: '', githubUrl: '', demoUrl: '',
  technologies: '', featured: false,
};

const AdminProjectsPage = () => {
  const { i18n } = useTranslation();
  const isGlobalId = i18n.language === 'id';

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeLang, setActiveLang] = useState<'id' | 'en'>('id');
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.data);
    } catch { } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditingProject(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setActiveLang('id');
    setIsModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      titleEn: project.titleEn || '',
      category: project.category,
      description: project.description,
      descriptionEn: project.descriptionEn || '',
      features: project.features || project.solution || project.challenge || '',
      featuresEn: project.featuresEn || '',
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      technologies: project.technologies?.map(t => t.technology).join(', ') || '',
      featured: project.featured,
    });
    setImagePreview(project.image || null);
    setImageFile(null);
    setActiveLang('id');
    setIsModalOpen(true);
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'technologies') {
          const techs = val.toString().split(',').map(t => t.trim()).filter(Boolean);
          fd.append('technologies', JSON.stringify(techs));
        } else {
          fd.append(key, val.toString());
        }
      });
      if (imageFile) fd.append('image', imageFile);

      if (editingProject) {
        await projectService.update(editingProject.id, fd);
        toast.success('Project updated!');
      } else {
        await projectService.create(fd);
        toast.success('Project created!');
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || 'Failed to save project');
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
      await projectService.delete(deleteId);
      toast.success('Proyek berhasil dihapus!');
      fetchProjects();
    } catch {
      toast.error('Gagal menghapus proyek');
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            {isGlobalId ? 'Manajemen ' : 'Projects '}
            <span className="gradient-text">{isGlobalId ? 'Proyek' : 'Management'}</span>
          </h1>
          <p className="text-gray-400">
            {projects.length} {isGlobalId ? 'total proyek' : 'projects total'}
          </p>
        </div>
        <button id="add-project-btn" onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> {isGlobalId ? 'Tambah Proyek' : 'Add Project'}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          type="text"
          className="input-dark pl-10"
          placeholder={isGlobalId ? 'Cari proyek...' : 'Search projects...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Image', 'Title', 'Category', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/3 transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' } as any}
                >
                  <td className="px-6 py-4">
                    <div className="w-14 h-10 rounded-lg overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                      {project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-indigo-400"
                          style={{ background: 'rgba(99,102,241,0.1)' }}>
                          <Folder size={18} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{project.title}</p>
                    <p className="text-gray-500 text-xs">{project.technologies?.slice(0, 3).map(t => t.technology).join(', ')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="tech-tag text-xs">{project.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      project.featured ? 'text-yellow-400 bg-yellow-500/20' : 'text-gray-500 bg-white/5'
                    }`}>
                      {project.featured ? '⭐ Featured' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(project)}
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDeleteClick(project.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 size={15} />
                      </button>
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                          <ExternalLink size={15} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                          <Github size={15} />
                        </a>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Folder size={48} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                {isGlobalId ? 'Belum ada data proyek. ' : 'No projects found. '}
                <button onClick={openCreate} className="text-indigo-400 hover:underline">
                  {isGlobalId ? 'Tambahkan sekarang!' : 'Add one!'}
                </button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card-dark w-full max-w-2xl my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
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

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image upload */}
                <label className="block cursor-pointer">
                  <div className="h-40 rounded-xl overflow-hidden flex items-center justify-center transition-all hover:opacity-80"
                    style={{ border: '2px dashed rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.05)' }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Upload size={28} className="text-indigo-400" />
                        <span className="text-sm">Click to upload image</span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">
                      Title {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'} *
                    </label>
                    {activeLang === 'id' ? (
                      <input id="proj-title" type="text" className="input-dark" required
                        value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    ) : (
                      <input id="proj-title-en" type="text" className="input-dark" required
                        value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} />
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Category *</label>
                    <select className="input-dark" value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1 flex items-center gap-1">
                    <Globe size={14} className="text-indigo-400" />
                    Description {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'} *
                  </label>
                  {activeLang === 'id' ? (
                    <textarea id="proj-desc" rows={3} className="input-dark resize-none" required
                      value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  ) : (
                    <textarea id="proj-desc-en" rows={3} className="input-dark resize-none" required
                      value={form.descriptionEn} onChange={e => setForm({ ...form, descriptionEn: e.target.value })} />
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1 flex items-center gap-1">
                    <Globe size={14} className="text-indigo-400" />
                    Key Features / Fitur Utama {activeLang === 'id' ? '(🇮🇩)' : '(🇬🇧)'}
                  </label>
                  {activeLang === 'id' ? (
                    <textarea rows={3} className="input-dark resize-none" placeholder="Fitur-fitur utama dari proyek ini..."
                      value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
                  ) : (
                    <textarea rows={3} className="input-dark resize-none" placeholder="Key features of this project..."
                      value={form.featuresEn} onChange={e => setForm({ ...form, featuresEn: e.target.value })} />
                  )}
                </div>


                <div>
                  <label className="block text-gray-400 text-sm mb-1">Technologies (comma separated)</label>
                  <input type="text" className="input-dark" placeholder="React, Node.js, PostgreSQL"
                    value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">GitHub URL</label>
                    <input type="url" className="input-dark"
                      value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Demo URL</label>
                    <input type="url" className="input-dark"
                      value={form.demoUrl} onChange={e => setForm({ ...form, demoUrl: e.target.value })} />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative`}
                    style={{ background: form.featured ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.1)' }}
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${form.featured ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="text-gray-400 text-sm">Mark as Featured</span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-4 py-2">Cancel</button>
                  <button id="proj-save-btn" type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    {isSaving ? <div className="spinner w-4 h-4" /> : null}
                    {editingProject ? 'Update' : 'Create'} Project
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Hapus Proyek"
        message="Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
};

export default AdminProjectsPage;
