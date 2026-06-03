/**
 * SkillsPage.jsx
 * Admin Skills CRUD — Add/Edit/Delete skills with category, level, order, visible.
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
  Card,
  PageHeader,
  Badge,
  Btn,
  Input,
  Select,
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
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
  check: 'M20 6L9 17l-5-5',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
  close: 'M18 6L6 18 M6 6l12 12',
};

const CATEGORIES = ['Frontend', 'Backend', 'ML / AI', 'Tools', 'Other'];
const CAT_VARIANT = {
  Frontend: 'blue',
  Backend: 'green',
  'ML / AI': 'purple',
  Tools: 'amber',
  Other: 'slate',
};

const EMPTY_FORM = {
  name: '',
  category: 'Frontend',
  level: 80,
  order: 0,
  visible: true,
};

// ── Skill Modal ─────────────────────────────────────────────
function SkillModal({ skill, onClose, onCreate, onUpdate }) {
  const editing = !!skill?._id;
  const [form, setForm] = useState(editing ? { ...EMPTY_FORM, ...skill } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editing) await onUpdate(skill._id, form);
      else await onCreate(form);
      toast.success(editing ? 'Skill updated' : 'Skill created');
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? 'Edit Skill' : 'Add Skill'}
      subtitle={editing ? 'Update skill details' : 'Add a new skill to your portfolio'}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <><Spinner size={13} /> Saving…</> : editing ? <><Ic d={IC.check} size={13} /> Update</> : <><Ic d={IC.plus} size={13} /> Create</>}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>}
        <Input
          label="Skill Name *"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="React.js"
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Input
            label="Level (0-100)"
            type="number"
            value={form.level}
            onChange={(e) => set('level', e.target.value)}
            min={0}
            max={100}
          />
        </div>
        <Input
          label="Display Order"
          type="number"
          value={form.order}
          onChange={(e) => set('order', e.target.value)}
          min={0}
        />
        <Toggle
          value={form.visible}
          onChange={(v) => set('visible', v)}
          label="Visible on public site"
        />
      </div>
    </Modal>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/skills?admin=true');
      setSkills(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const createSkill = async (payload) => {
    const { data } = await api.post('/skills', payload);
    setSkills((prev) => [data, ...prev]);
    return data;
  };

  const updateSkill = async (id, payload) => {
    const { data } = await api.put(`/skills/${id}`, payload);
    setSkills((prev) => prev.map((s) => (s._id === id ? data : s)));
    return data;
  };

  const deleteSkill = async (id) => {
    await api.delete(`/skills/${id}`);
    setSkills((prev) => prev.filter((s) => s._id !== id));
    toast.success('Skill deleted');
  };

  const filtered = skills.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== 'all' && s.category !== catFilter) return false;
    return true;
  });

  return (
    <div className="p-5 md:p-7 max-w-[1200px] mx-auto">
      {modal && (
        <SkillModal
          skill={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onCreate={createSkill}
          onUpdate={updateSkill}
        />
      )}

      <PageHeader
        title="Skills"
        description={`${skills.length} skill${skills.length !== 1 ? 's' : ''} in your portfolio`}
        action={
          <Btn variant="primary" onClick={() => setModal('create')}>
            <Ic d={IC.plus} size={14} /> Add Skill
          </Btn>
        }
      />

      {/* Filter bar */}
      <Card className="mb-4" padding={false}>
        <div className="flex flex-wrap items-center gap-3 p-4">
          <label className="flex items-center gap-2 bg-navy-950 border border-navy-800 focus-within:border-blue-400/40 rounded-lg px-3 py-2 flex-1 min-w-[180px] transition-colors cursor-text">
            <Ic d={IC.search} size={13} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills…"
              className="bg-transparent text-sm text-slate-300 placeholder-slate-700 outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-700 hover:text-slate-400">
                <Ic d={IC.close} size={11} />
              </button>
            )}
          </label>

          <div className="flex items-center gap-1 bg-navy-950 border border-navy-800 rounded-lg p-1">
            {['all', ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                  catFilter === c ? 'bg-blue-400 text-white shadow-sm' : 'text-slate-600 hover:text-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

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
                {['Skill', 'Category', 'Level', 'Order', 'Visible', 'Actions'].map((h) => (
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
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-navy-800">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-6 bg-navy-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={<Ic d={IC.search} size={22} />}
                      title="No skills found"
                      description={search ? `No matches for "${search}"` : 'Add your first skill to get started.'}
                      action={
                        search ? (
                          <Btn variant="ghost" size="sm" onClick={() => { setSearch(''); setCatFilter('all'); }}>Clear filters</Btn>
                        ) : (
                          <Btn variant="primary" size="sm" onClick={() => setModal('create')}>
                            <Ic d={IC.plus} size={13} /> Add Skill
                          </Btn>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((skill) => (
                  <SkillRow
                    key={skill._id}
                    skill={skill}
                    onEdit={setModal}
                    onDelete={deleteSkill}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── Table Row ───────────────────────────────────────────────
function SkillRow({ skill, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <tr className="border-b border-navy-800 hover:bg-white/[0.015] transition-colors group">
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-slate-200">{skill.name}</span>
      </td>
      <td className="px-4 py-3">
        <Badge label={skill.category} variant={CAT_VARIANT[skill.category] || 'slate'} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full"
              style={{ width: `${skill.level || 0}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 tabular-nums">{skill.level}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-500 tabular-nums">{skill.order || 0}</span>
      </td>
      <td className="px-4 py-3">
        {skill.visible !== false ? (
          <Badge label="Visible" variant="green" />
        ) : (
          <Badge label="Hidden" variant="slate" />
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 relative">
          <button
            onClick={() => onEdit(skill)}
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
                onDelete(skill._id);
                setConfirmOpen(false);
              }}
              title="Delete Skill"
              message={`Are you sure you want to delete "${skill.name}"? This cannot be undone.`}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}
