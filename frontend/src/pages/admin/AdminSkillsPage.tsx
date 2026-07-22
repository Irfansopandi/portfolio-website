import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, ChevronDown, Search, Wrench } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { skillService } from '../../services';
import type { Skill } from '../../types';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { SkillIcon } from '../../components/SkillIcon';

const CATEGORIES = ['Programming', 'Framework', 'Tools', 'Database'];
const defaultForm = { name: '', category: 'Programming', icon: '', order: '0' };

const AVAILABLE_ICONS = [
  { value: '', label: 'Tidak Ada Ikon (Gunakan default)' },
  { value: 'angularjs', label: 'Angular' },
  { value: 'antigravity', label: 'Antigravity (AI)' },
  { value: 'aws', label: 'AWS (Amazon Web Services)' },
  { value: 'bootstrap', label: 'Bootstrap' },
  { value: 'c', label: 'C' },
  { value: 'cplusplus', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'canva', label: 'Canva' },
  { value: 'css3', label: 'CSS3' },
  { value: 'dart', label: 'Dart' },
  { value: 'digitalocean', label: 'DigitalOcean' },
  { value: 'docker', label: 'Docker' },
  { value: 'excel', label: 'Excel (Microsoft)' },
  { value: 'expressjs', label: 'Express.js' },
  { value: 'figma', label: 'Figma' },
  { value: 'firebase', label: 'Firebase' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'git', label: 'Git' },
  { value: 'github', label: 'GitHub' },
  { value: 'gitlab', label: 'GitLab' },
  { value: 'go', label: 'Go / Golang' },
  { value: 'googlecloud', label: 'Google Cloud Platform (GCP)' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'html5', label: 'HTML5' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'linux', label: 'Linux' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'npm', label: 'NPM' },
  { value: 'php', label: 'PHP' },
  { value: 'postman', label: 'Postman' },
  { value: 'powerpoint', label: 'PowerPoint (Microsoft)' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'prisma', label: 'Prisma' },
  { value: 'python', label: 'Python' },
  { value: 'react', label: 'React / React.js' },
  { value: 'redis', label: 'Redis' },
  { value: 'redux', label: 'Redux' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
  { value: 'sass', label: 'Sass / SCSS' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'swift', label: 'Swift' },
  { value: 'tailwindcss', label: 'Tailwind CSS' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'ubuntu', label: 'Ubuntu' },
  { value: 'vite', label: 'Vite' },
  { value: 'vscode', label: 'VS Code' },
  { value: 'vuejs', label: 'Vue.js' },
  { value: 'webpack', label: 'Webpack' },
  { value: 'wordpress', label: 'WordPress' },
  { value: 'yarn', label: 'Yarn' },
];

interface SearchableDropdownProps {
  options: { value: string, label: string }[];
  value: string;
  onChange: (val: string) => void;
}

const SearchableDropdown = ({ options, value, onChange }: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
        className="input-dark flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <SkillIcon name={selectedOption?.label || ''} icon={value} />
          </div>
          <span className={`truncate ${selectedOption?.value ? 'text-white' : 'text-gray-400'}`}>
            {selectedOption ? selectedOption.label : 'Pilih Ikon...'}
          </span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-60"
          style={{
            background: 'rgba(15, 15, 26, 0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Search input */}
          <div className="relative p-2 border-b border-white/5">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-8 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              placeholder="Cari ikon..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Options list */}
          <div className="overflow-y-auto flex-1 py-1">
            {filtered.length > 0 ? (
              filtered.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                    option.value === value
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <SkillIcon name={option.label} icon={option.value} />
                    </div>
                    <span className="truncate">{option.label}</span>
                  </div>
                  {option.value && (
                    <span className="text-[10px] opacity-70 font-mono ml-2 flex-shrink-0">({option.value})</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-gray-500 text-center">
                Ikon tidak ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


const AdminSkillsPage = () => {
  const { i18n } = useTranslation();
  const isGlobalId = i18n.language === 'id';
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Skill[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const fetchData = async () => {
    try {
      const res = await skillService.getAll();
      setSkills(res.data.skills);
      setGrouped(res.data.grouped);
    } catch { } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(defaultForm); setIsModalOpen(true); };
  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, icon: s.icon || '', order: String(s.order) });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = { ...form, percentage: 100, order: parseInt(form.order) };
      if (editing) { await skillService.update(editing.id, data); toast.success('Skill updated!'); }
      else { await skillService.create(data); toast.success('Skill added!'); }
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
      await skillService.delete(deleteId);
      toast.success('Berhasil dihapus!');
      fetchData();
    } catch {
      toast.error('Gagal menghapus keahlian');
    } finally {
      setDeleteId(null);
    }
  };

  const categoryColors: Record<string, string> = {
    Programming: '#6366f1', Framework: '#a855f7', Tools: '#06b6d4', Database: '#10b981',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            {isGlobalId ? 'Manajemen ' : 'Skills '}
            <span className="gradient-text">{isGlobalId ? 'Keahlian' : 'Management'}</span>
          </h1>
          <p className="text-gray-400">
            {skills.length} {isGlobalId ? 'total keahlian' : 'skills total'}
          </p>
        </div>
        <button id="add-skill-btn" onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> {isGlobalId ? 'Tambah Keahlian' : 'Add Skill'}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 custom-scrollbar">
        {['All', ...CATEGORIES].map((category) => {
          const isActive = activeCategory === category;
          const count = category === 'All' ? skills.length : (grouped[category]?.length || 0);
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border flex-shrink-0 ${
                isActive
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{category === 'All' ? (isGlobalId ? 'Semua Keahlian' : 'All Skills') : category}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : (
        <div className="space-y-8">
          {(activeCategory === 'All'
            ? Object.entries(grouped)
            : Object.entries(grouped).filter(([cat]) => cat === activeCategory)
          ).map(([category, catSkills]) => (
            <div key={category}>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: categoryColors[category] || '#6366f1' }} />
                {category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catSkills.map((skill) => (
                  <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-4 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 p-1.5 flex-shrink-0">
                          <SkillIcon name={skill.name} icon={skill.icon} />
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{skill.name}</span>
                          {skill.icon && (
                            <span className="text-[10px] text-gray-400 font-mono">({skill.icon})</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDeleteClick(skill.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card-dark w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit' : 'Add'} Skill</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Skill Name *</label>
                  <input type="text" className="input-dark" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Category</label>
                  <select className="input-dark" value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Icon</label>
                  <SearchableDropdown
                    options={AVAILABLE_ICONS}
                    value={form.icon}
                    onChange={val => setForm({ ...form, icon: val })}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-4 py-2">Cancel</button>
                  <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    {isSaving && <div className="spinner w-4 h-4" />}
                    {editing ? 'Update' : 'Add'} Skill
                  </button>
                </div>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Hapus Keahlian"
        message="Apakah Anda yakin ingin menghapus keahlian ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
};

export default AdminSkillsPage;
