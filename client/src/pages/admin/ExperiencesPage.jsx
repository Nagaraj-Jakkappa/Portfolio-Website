import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  PageHeader,
  Btn,
  Input,
  Textarea,
  Modal,
  Ic,
  Spinner,
  ConfirmModal,
  EmptyState,
} from '../../components/admin/ui/ui';
import toast from 'react-hot-toast';

// ── Icon paths ────────────────────────────────────────────────────────────────
const IC = {
  plus: 'M12 5v14 M5 12h14',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
  check: 'M20 6L9 17l-5-5',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  eyeOff:
    'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22',
  briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
};

// ── Empty form state ──────────────────────────────────────────────────────────
const EMPTY = {
  title: '',
  organization: '',
  location: '',
  duration: '',
  type: 'Internship',
  description: '',
  highlights: '',   // newline-separated string for textarea
  techStack: '',    // comma-separated string for input
  startDate: '',
  endDate: '',
  displayOrder: 0,
  isVisible: true,
  // Breakdown fields (textarea strings for the form)
  breakdownSkills: '',      // comma-separated → skillsApplied array
  breakdownPractices: '',   // newline-separated → practices array
  breakdownTakeaways: '',   // newline-separated → takeaways array
};

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function ExperienceModal({ item, onClose, onSave }) {
  const editing = !!item?._id;

  const [form, setForm] = useState(() => {
    if (editing && item) {
      return {
        ...item,
        highlights: Array.isArray(item.highlights) ? item.highlights.join('\n') : '',
        techStack: Array.isArray(item.techStack) ? item.techStack.join(', ') : '',
        // Breakdown fields: deserialise arrays back to strings for textarea
        breakdownSkills: Array.isArray(item.breakdown?.skillsApplied)
          ? item.breakdown.skillsApplied.join(', ')
          : '',
        breakdownPractices: Array.isArray(item.breakdown?.practices)
          ? item.breakdown.practices.join('\n')
          : '',
        breakdownTakeaways: Array.isArray(item.breakdown?.takeaways)
          ? item.breakdown.takeaways.join('\n')
          : '',
      };
    }
    return { ...EMPTY };
  });

  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.organization.trim()) {
      toast.error('Title and Organization are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights
          ? form.highlights.split('\n').map((l) => l.trim()).filter(Boolean)
          : [],
        techStack: form.techStack
          ? form.techStack.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        displayOrder: Number(form.displayOrder) || 0,
        isVisible: Boolean(form.isVisible),
        breakdown: {
          skillsApplied: form.breakdownSkills
            ? form.breakdownSkills.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          practices: form.breakdownPractices
            ? form.breakdownPractices.split('\n').map((l) => l.trim()).filter(Boolean)
            : [],
          takeaways: form.breakdownTakeaways
            ? form.breakdownTakeaways.split('\n').map((l) => l.trim()).filter(Boolean)
            : [],
        },
      };
      // Remove the flat textarea fields – API doesn't need them
      delete payload.breakdownSkills;
      delete payload.breakdownPractices;
      delete payload.breakdownTakeaways;
      await onSave(payload, item?._id);
      onClose();
    } catch {
      toast.error('Save failed. Check your connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? 'Edit Experience' : 'Add Experience'}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size={13} /> : <Ic d={IC.check} size={13} />} Save
          </Btn>
        </>
      }
    >
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        {/* Title + Organization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Title *"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g., Frontend Development Intern"
          />
          <Input
            label="Organization *"
            value={form.organization}
            onChange={(e) => set('organization', e.target.value)}
            placeholder="e.g., Saiket Systems"
          />
        </div>

        {/* Location + Duration + Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g., Remote"
          />
          <Input
            label="Duration"
            value={form.duration}
            onChange={(e) => set('duration', e.target.value)}
            placeholder="e.g., 1 Month"
          />
          <Input
            label="Type"
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
            placeholder="e.g., Internship"
          />
        </div>

        {/* Start + End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Start Date"
            value={form.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            placeholder="e.g., Jan 2024"
          />
          <Input
            label="End Date"
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
            placeholder="e.g., Feb 2024"
          />
        </div>

        {/* Description */}
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Brief summary of the role and responsibilities…"
          rows={3}
        />

        {/* Highlights */}
        <Textarea
          label="Highlights (one per line)"
          value={form.highlights}
          onChange={(e) => set('highlights', e.target.value)}
          placeholder={"Built responsive components using HTML, CSS, JS.\nDeveloped quiz app and to-do app mini projects."}
          rows={5}
        />

        {/* Tech Stack */}
        <Input
          label="Tech Stack (comma-separated)"
          value={form.techStack}
          onChange={(e) => set('techStack', e.target.value)}
          placeholder="HTML, CSS, JavaScript, React"
        />

        {/* ── Breakdown section ─────────────────────────────── */}
        <div className="pt-2 border-t border-navy-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Experience Breakdown (optional expandable panel)
          </p>

          <div className="space-y-4">
            {/* Skills Applied */}
            <Input
              label="Skills Applied (comma-separated)"
              value={form.breakdownSkills}
              onChange={(e) => set('breakdownSkills', e.target.value)}
              placeholder="Responsive Design, Git Workflow, JavaScript DOM Logic"
            />

            {/* Development Practices */}
            <Textarea
              label="Development Practices (one per line)"
              value={form.breakdownPractices}
              onChange={(e) => set('breakdownPractices', e.target.value)}
              placeholder={"Broke UI tasks into smaller frontend components.\nTested layouts across different screen sizes."}
              rows={4}
            />

            {/* Practical Takeaways */}
            <Textarea
              label="Practical Takeaways (one per line)"
              value={form.breakdownTakeaways}
              onChange={(e) => set('breakdownTakeaways', e.target.value)}
              placeholder={"Improved confidence in building responsive frontend interfaces.\nStrengthened HTML, CSS, and JavaScript fundamentals."}
              rows={4}
            />
          </div>
        </div>

        {/* Display Order + Visibility */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Display Order"
            type="number"
            value={form.displayOrder}
            onChange={(e) => set('displayOrder', e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Visibility
            </label>
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => set('isVisible', !form.isVisible)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  form.isVisible ? 'bg-blue-500' : 'bg-navy-700'
                }`}
                aria-label="Toggle visibility"
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform ${
                    form.isVisible ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-xs ${form.isVisible ? 'text-emerald-400' : 'text-slate-500'}`}>
                {form.isVisible ? 'Visible' : 'Hidden'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Experience row card ───────────────────────────────────────────────────────
function ExperienceRow({ item, onEdit, onDelete, onToggleVisibility }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onToggleVisibility(item);
    setToggling(false);
  };

  return (
    <div className="bg-navy-900 border border-navy-800 rounded-xl p-4 sm:p-5 hover:border-blue-400/30 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">{item.title}</span>
            {item.type && (
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {item.type}
              </span>
            )}
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                item.isVisible
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-slate-700/30 text-slate-500 border-slate-700'
              }`}
            >
              {item.isVisible ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <p className="text-xs text-blue-400 font-medium">{item.organization}</p>
          <div className="flex flex-wrap gap-3 mt-1 text-[11px] text-slate-500">
            {item.duration && <span>{item.duration}</span>}
            {item.location && <span>📍 {item.location}</span>}
            <span>Order: {item.displayOrder}</span>
          </div>
          {item.highlights?.length > 0 && (
            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-1">
              {item.highlights.length} highlight{item.highlights.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Toggle visibility */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-500/10"
            title={item.isVisible ? 'Hide' : 'Show'}
          >
            {toggling ? <Spinner size={13} /> : <Ic d={item.isVisible ? IC.eye : IC.eyeOff} size={14} />}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title="Edit"
          >
            <Ic d={IC.edit} size={14} />
          </button>

          {/* Delete */}
          <div className="relative">
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
              title="Delete"
            >
              <Ic d={IC.trash} size={14} />
            </button>
            <ConfirmModal
              open={confirmDelete}
              onClose={() => setConfirmDelete(false)}
              onConfirm={() => { onDelete(item._id); setConfirmDelete(false); }}
              title="Delete Experience"
              message={`Delete "${item.title}"? This cannot be undone.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function ExperiencesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | <item object>

  // Fetch all (admin endpoint shows hidden too)
  useEffect(() => {
    api
      .get('/experiences/admin')
      .then((r) => setItems(r.data))
      .catch(() => toast.error('Could not load experiences'))
      .finally(() => setLoading(false));
  }, []);

  // Create / Update
  const handleSave = async (payload, id) => {
    const { data } = id
      ? await api.put(`/experiences/${id}`, payload)
      : await api.post('/experiences', payload);
    setItems((prev) =>
      id ? prev.map((x) => (x._id === id ? data : x)) : [data, ...prev]
    );
    toast.success(id ? 'Experience updated' : 'Experience added');
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/experiences/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast.success('Deleted successfully');
    } catch {
      toast.error('Delete failed');
    }
  };

  // Toggle visibility
  const handleToggleVisibility = async (item) => {
    try {
      const payload = {
        title: item.title,
        organization: item.organization,
        location: item.location,
        duration: item.duration,
        type: item.type,
        description: item.description,
        highlights: item.highlights,
        techStack: item.techStack,
        startDate: item.startDate,
        endDate: item.endDate,
        displayOrder: item.displayOrder,
        isVisible: !item.isVisible,
        breakdown: item.breakdown || { skillsApplied: [], practices: [], takeaways: [] },
      };
      const { data } = await api.put(`/experiences/${item._id}`, payload);
      setItems((prev) => prev.map((x) => (x._id === item._id ? data : x)));
      toast.success(`${data.isVisible ? 'Shown' : 'Hidden'} on public site`);
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-[1400px] mx-auto">
      {/* Modal */}
      {modal && (
        <ExperienceModal
          item={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <PageHeader
        title="Hands-on Experience"
        description="Manage your internship and project-based experience"
        action={
          <Btn variant="primary" onClick={() => setModal('create')}>
            <Ic d={IC.plus} size={14} /> Add Experience
          </Btn>
        }
      />

      {/* List */}
      <div className="mt-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-navy-900 rounded-xl animate-pulse border border-navy-800" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No experience entries"
            description="Start by adding your first experience."
          />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <ExperienceRow
                key={item._id}
                item={item}
                onEdit={setModal}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
