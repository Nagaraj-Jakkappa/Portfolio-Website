/**
 * ProjectsPage.jsx
 * Path: client/src/pages/admin/ProjectsPage.jsx
 * Uses existing useAllProjects() hook — no hook changes needed.
 */

import { useState, useMemo } from 'react';
import { useAllProjects } from '../../hooks/useData';
import {
  Card,
  PageHeader,
  Badge,
  Btn,
  Input,
  Select,
  Textarea,
  Toggle,
  EmptyState,
  Spinner,
  Ic,
  ConfirmModal,
  Modal,
} from '../../components/admin/ui/ui';
import toast from 'react-hot-toast';

const IC = {
  plus: 'M12 5v14 M5 12h14',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  gh: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  close: 'M18 6L6 18 M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  prev: 'M15 18l-6-6 6-6',
  next: 'M9 18l6-6-6-6',
};

const CATS = ['all', 'web', 'fullstack', 'ml', 'other'];
const CAT_VARIANT = { web: 'blue', fullstack: 'green', ml: 'purple', other: 'slate' };
const PAGE_SIZE = 8;
const EMPTY_FORM = {
  title: '',
  description: '',
  longDescription: '',
  techStack: '',
  imageUrl: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  category: 'web',
  status: 'live',
  order: 0,
  caseStudy: {
    problem: '',
    solution: '',
    impact: '',
  },
};

// ── Project Form Modal ────────────────────────────────────────
function ProjectModal({ project, onClose, onCreate, onUpdate }) {
  const editing = !!project?._id;
  const [form, setForm] = useState(
    editing
      ? {
          ...project,
          techStack: project.techStack?.join(', ') ?? '',
          caseStudy: project.caseStudy ?? { problem: '', solution: '', impact: '' },
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        order: Number(form.order),
      };
      if (editing) await onUpdate(project._id, payload);
      else await onCreate(payload);
      toast.success(editing ? 'Project updated' : 'Project created');
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.error ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? 'Edit Project' : 'Add New Project'}
      subtitle={
        editing ? 'Update the project details below' : 'Fill in the details for your new project'
      }
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Spinner size={13} /> Saving…
              </>
            ) : editing ? (
              <>
                <Ic d={IC.check} size={13} /> Update
              </>
            ) : (
              <>
                <Ic d={IC.plus} size={13} /> Create
              </>
            )}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Project Title *"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Pothole Detection App"
          error={errors.title}
        />
        <Textarea
          label="Short Description *"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="One-two sentences shown on the portfolio card"
          error={errors.description}
        />
        <Input
          label="Tech Stack (comma-separated)"
          value={form.techStack}
          onChange={(e) => set('techStack', e.target.value)}
          placeholder="React, Node.js, MongoDB, TailwindCSS"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Live URL"
            value={form.liveUrl}
            onChange={(e) => set('liveUrl', e.target.value)}
            placeholder="https://…"
          />
          <Input
            label="GitHub URL"
            value={form.githubUrl}
            onChange={(e) => set('githubUrl', e.target.value)}
            placeholder="https://github.com/…"
          />
        </div>
        <Input
          label="Image URL"
          value={form.imageUrl}
          onChange={(e) => set('imageUrl', e.target.value)}
          placeholder="https://res.cloudinary.com/…"
          hint="Use Cloudinary free tier to host project screenshots"
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {['web', 'fullstack', 'ml', 'other'].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            {['live', 'draft', 'archived'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Input
            label="Display Order"
            type="number"
            value={form.order}
            onChange={(e) => set('order', e.target.value)}
            min={0}
          />
        </div>
        <Toggle
          value={form.featured}
          onChange={(v) => set('featured', v)}
          label="Mark as Featured"
        />

        <div className="pt-4 border-t border-navy-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Case Study (Optional)</h3>
          <Textarea
            label="Problem"
            value={form.caseStudy?.problem || ''}
            onChange={(e) =>
              set('caseStudy', { ...form.caseStudy, problem: e.target.value })
            }
            placeholder="Describe the problem you were trying to solve..."
          />
          <Textarea
            label="Solution"
            value={form.caseStudy?.solution || ''}
            onChange={(e) =>
              set('caseStudy', { ...form.caseStudy, solution: e.target.value })
            }
            placeholder="Describe your technical solution..."
          />
          <Textarea
            label="Impact"
            value={form.caseStudy?.impact || ''}
            onChange={(e) =>
              set('caseStudy', { ...form.caseStudy, impact: e.target.value })
            }
            placeholder="Describe the results, metrics, or lessons learned..."
          />
        </div>
      </div>
    </Modal>
  );
}



// ── Table row ─────────────────────────────────────────────────
function ProjectRow({ project, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <tr className="border-b border-navy-800 hover:bg-white/[0.015] transition-colors group">
      {/* Title */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy-800 flex-shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-blue-400">
            {project.imageUrl ? (
              <img 
                src={project.imageUrl} 
                alt={project.title || 'Project'} 
                loading="lazy" 
                decoding="async" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400/0f172a/38bdf8?text=No+Image';
                }}
              />
            ) : (
              project.title?.[0]
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate max-w-[160px]">
              {project.title}
            </p>
            <p className="text-xs text-slate-600 truncate max-w-[160px]">
              {project.description?.slice(0, 48)}…
            </p>
          </div>
        </div>
      </td>
      {/* Tech */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {project.techStack?.slice(0, 3).map((t) => (
            <span key={t} className="text-xs px-1.5 py-0.5 bg-navy-800 text-slate-500 rounded">
              {t}
            </span>
          ))}
          {(project.techStack?.length ?? 0) > 3 && (
            <span className="text-xs px-1.5 py-0.5 bg-navy-800 text-slate-700 rounded">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </td>
      {/* Category */}
      <td className="px-4 py-3">
        <Badge
          label={project.category ?? 'web'}
          variant={CAT_VARIANT[project.category] ?? 'slate'}
        />
      </td>
      {/* Status */}
      <td className="px-4 py-3">
        <Badge
          label={project.status ?? 'live'}
          variant={project.status === 'draft' ? 'slate' : project.status === 'archived' ? 'purple' : 'green'}
        />
      </td>
      {/* Featured */}
      <td className="px-4 py-3">
        {project.featured ? (
          <Badge label="Featured" variant="amber" />
        ) : (
          <span className="text-xs text-slate-700">—</span>
        )}
      </td>
      {/* Links */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-600 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
            >
              <Ic d={IC.link} size={12} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-600 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-all"
            >
              <Ic d={IC.gh} size={12} />
            </a>
          )}
        </div>
      </td>
      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 relative">
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 text-slate-600 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <Ic d={IC.edit} size={13} />
          </button>
          <div className="relative">
            <button
              onClick={() => setConfirmOpen((v) => !v)}
              className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Ic d={IC.trash} size={13} />
            </button>
            <ConfirmModal
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              onConfirm={() => {
                onDelete(project._id);
                setConfirmOpen(false);
              }}
              title="Delete Project"
              message={`Are you sure you want to permanently delete "${project.title}"? This cannot be undone.`}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function ProjectsPage() {
  const { projects, loading, createProject, updateProject, deleteProject } = useAllProjects();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [featFilter, setFeatFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | 'create' | project

  const filtered = useMemo(() => {
    let list = [...projects];
    if (search)
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.techStack?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      );
    if (catFilter !== 'all') list = list.filter((p) => p.category === catFilter);
    if (featFilter === 'featured') list = list.filter((p) => p.featured);
    if (featFilter === 'normal') list = list.filter((p) => !p.featured);
    return list;
  }, [projects, search, catFilter, featFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      toast.success('Project deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCatFilter('all');
    setFeatFilter('all');
    setPage(1);
  };

  return (
    <div className="p-5 md:p-7 max-w-[1400px] mx-auto">
      {modal && (
        <ProjectModal
          project={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onCreate={createProject}
          onUpdate={updateProject}
        />
      )}

      <PageHeader
        title="Projects"
        description={`${projects.length} project${projects.length !== 1 ? 's' : ''} in your portfolio`}
        action={
          <Btn variant="primary" onClick={() => setModal('create')}>
            <Ic d={IC.plus} size={14} /> Add Project
          </Btn>
        }
      />

      {/* Filter bar */}
      <Card className="mb-4" padding={false}>
        <div className="flex flex-wrap items-center gap-3 p-4">
          {/* Search */}
          <label className="flex items-center gap-2 bg-navy-950 border border-navy-800 focus-within:border-blue-400/40 rounded-lg px-3 py-2 flex-1 min-w-[200px] transition-colors cursor-text">
            <Ic d={IC.search} size={13} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title or tech…"
              className="bg-transparent text-sm text-slate-300 placeholder-slate-700 outline-none w-full"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="text-slate-700 hover:text-slate-400"
              >
                <Ic d={IC.close} size={11} />
              </button>
            )}
          </label>

          {/* Category pills */}
          <div className="flex items-center gap-1 bg-navy-950 border border-navy-800 rounded-lg p-1">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCatFilter(c);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${catFilter === c ? 'bg-blue-400 text-white shadow-sm' : 'text-slate-600 hover:text-slate-300'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Featured filter */}
          <select
            value={featFilter}
            onChange={(e) => {
              setFeatFilter(e.target.value);
              setPage(1);
            }}
            className="bg-navy-950 border border-navy-800 text-sm text-slate-400 rounded-lg px-3 py-2 outline-none"
          >
            <option value="all">All Status</option>
            <option value="featured">Featured</option>
            <option value="normal">Not Featured</option>
          </select>

          <span className="text-xs text-slate-700 ml-auto tabular-nums">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-800">
                {['Project', 'Tech Stack', 'Category', 'Status', 'Featured', 'Links', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-navy-800">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-8 bg-navy-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={<Ic d={IC.search} size={22} />}
                      title="No projects found"
                      description={
                        search
                          ? `No matches for "${search}"`
                          : 'Add your first project to get started.'
                      }
                      action={
                        search ? (
                          <Btn variant="ghost" size="sm" onClick={resetFilters}>
                            Clear filters
                          </Btn>
                        ) : (
                          <Btn variant="primary" size="sm" onClick={() => setModal('create')}>
                            <Ic d={IC.plus} size={13} /> Add Project
                          </Btn>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                paged.map((p) => (
                  <ProjectRow key={p._id} project={p} onEdit={setModal} onDelete={handleDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-navy-800">
            <span className="text-xs text-slate-700 tabular-nums">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="p-1.5 text-slate-600 hover:text-slate-300 hover:bg-white/5 rounded-lg disabled:opacity-30 transition-all"
              >
                <Ic d={IC.prev} size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${n === page ? 'bg-blue-400 text-white' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="p-1.5 text-slate-600 hover:text-slate-300 hover:bg-white/5 rounded-lg disabled:opacity-30 transition-all"
              >
                <Ic d={IC.next} size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
