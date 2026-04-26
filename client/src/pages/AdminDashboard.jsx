import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useAllProjects, useMessages } from '../hooks/useData';

// ─── Project Form Modal ───────────────────────────
const EMPTY_PROJECT = { title: '', description: '', longDescription: '', techStack: '', imageUrl: '', liveUrl: '', githubUrl: '', featured: false, category: 'web', order: 0 };

function ProjectModal({ project, onClose, onCreate, onUpdate }) {
  const editing = !!project?._id;
  const [form, setForm] = useState(
    editing
      ? { ...project, techStack: project.techStack?.join(', ') || '' }
      : EMPTY_PROJECT
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Title and description are required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean) };
      if (editing) await onUpdate(project._id, payload);
      else await onCreate(payload);
      toast.success(editing ? 'Project updated!' : 'Project created!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, required }) => (
    <div>
      <label className="block text-xs font-mono text-slate-400 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input type={type} name={name} value={form[name]} onChange={handleChange}
        placeholder={placeholder} className="input-base text-sm" required={required} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-navy-800 border border-navy-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-navy-700">
          <h3 className="font-display font-semibold text-white">{editing ? 'Edit Project' : 'Add Project'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <Field label="Title" name="title" placeholder="Project Name" required />
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wide mb-1.5">Description <span className="text-red-400">*</span></label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Short description..." className="input-base text-sm resize-none" required />
          </div>
          <Field label="Tech Stack (comma-separated)" name="techStack" placeholder="React, Node.js" />
          <Field label="Image URL" name="imageUrl" placeholder="https://..." />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Live URL" name="liveUrl" placeholder="https://..." />
            <Field label="GitHub URL" name="githubUrl" placeholder="https://github.com/..." />
          </div>
          <div className="flex gap-3 pt-4 border-t border-navy-700">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center text-sm py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm py-2">
              {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('projects');
  const [modal, setModal] = useState(null);

  const { projects, loading: projLoading, createProject, updateProject, deleteProject } = useAllProjects();
  const { messages, loading: msgLoading, markRead, deleteMessage } = useMessages();

  const [skills, setSkills] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend' });
  const [newCert, setNewCert] = useState({ title: '', organization: '', date: '', description: '' });

  const unread = (messages || []).filter((m) => !m.read).length;

  useEffect(() => {
    fetchExtras();
  }, []);

  const fetchExtras = async () => {
    setLoadingExtras(true);
    const currentToken = localStorage.getItem('adminToken');
    try {
      const [sRes, cRes] = await Promise.all([
        axios.get('/api/skills', { headers: { Authorization: `Bearer ${currentToken}` } }),
        axios.get('/api/certificates', { headers: { Authorization: `Bearer ${currentToken}` } })
      ]);
      // 🚀 SAFETY: Ensure data is an array
      setSkills(Array.isArray(sRes.data) ? sRes.data : []);
      setCerts(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (err) { 
      console.error("Fetch error", err); 
      setSkills([]);
      setCerts([]);
    } finally { setLoadingExtras(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // ── Skills Handlers ──
  const handleAddSkill = async (e) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('adminToken');
    try {
      await axios.post('/api/skills', { ...newSkill, level: 85, icon: 'code' }, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setNewSkill({ name: '', category: 'Frontend' });
      fetchExtras();
      toast.success('Skill added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm('Delete skill?')) return;
    const currentToken = localStorage.getItem('adminToken');
    try {
      await axios.delete(`/api/skills/${id}`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      fetchExtras();
      toast.success('Skill removed');
    } catch (err) { toast.error('Delete failed'); }
  };

  // ── Certs Handlers ──
  const handleAddCert = async (e) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('adminToken');
    try {
      await axios.post('/api/certificates', newCert, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setNewCert({ title: '', organization: '', date: '', description: '' });
      fetchExtras();
      toast.success('Certificate added');
    } catch (err) { toast.error('Failed to add certificate'); }
  };

  const handleDeleteCert = async (id) => {
    if (!confirm('Delete certificate?')) return;
    const currentToken = localStorage.getItem('adminToken');
    try {
      await axios.delete(`/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      fetchExtras();
      toast.success('Certificate removed');
    } catch (err) { toast.error('Delete failed'); }
  };

  return (
    <>
      <Helmet><title>Admin — Nagaraj Portfolio</title></Helmet>

      {modal && (
        <ProjectModal
          project={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onCreate={createProject}
          onUpdate={updateProject}
        />
      )}

      <div className="min-h-screen bg-navy-950 pt-16">
        <div className="bg-navy-900 border-b border-navy-800 px-6 md:px-12 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-xl text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-500 mt-0.5">Logged in as <span className="text-blue-400 font-mono">{admin?.username}</span></p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/" className="btn-ghost text-sm py-2 px-4">View Site</a>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">Logout</button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-base p-4">
              <div className="font-display font-bold text-3xl text-blue-400">{(projects || []).length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Projects</div>
            </div>
            <div className="card-base p-4">
              <div className="font-display font-bold text-3xl text-emerald-400">{(skills || []).length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Skills</div>
            </div>
            <div className="card-base p-4">
              <div className="font-display font-bold text-3xl text-purple-400">{(certs || []).length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Certificates</div>
            </div>
            <div className="card-base p-4">
              <div className="font-display font-bold text-3xl text-amber-400">{unread}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Unread Msgs</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mb-8 bg-navy-900 border border-navy-800 rounded-xl p-1 w-fit">
            {['projects', 'skills', 'certificates', 'messages'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${tab === t ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
                  }`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── PROJECTS TAB ── */}
          {tab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-white">Project Management</h2>
                <button onClick={() => setModal('create')} className="btn-primary text-sm py-2 px-4">+ Add Project</button>
              </div>
              <div className="space-y-3">
                {(projects || []).map((p) => (
                  <div key={p._id} className="card-base p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-navy-700 flex items-center justify-center text-blue-400 font-bold">{p.title ? p.title[0] : '?'}</div>
                      <div>
                        <p className="text-white text-sm font-medium">{p.title}</p>
                        <p className="text-slate-500 text-xs">{p.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setModal(p)} className="p-2 text-slate-400 hover:text-blue-400">Edit</button>
                      <button onClick={() => deleteProject(p._id)} className="p-2 text-slate-400 hover:text-red-400">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SKILLS TAB ── */}
          {tab === 'skills' && (
            <div className="grid md:grid-cols-2 gap-8">
              <form onSubmit={handleAddSkill} className="card-base p-6 space-y-4 h-fit">
                <h3 className="text-white font-medium">Add New Skill</h3>
                <input className="input-base text-sm" placeholder="Skill Name" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} required />
                <select className="input-base text-sm" value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="ML / AI">ML / AI</option>
                  <option value="Tools">Tools</option>
                </select>
                <button className="btn-primary w-full py-2">Add Skill</button>
              </form>
              <div className="space-y-2">
                {/* 🚀 FIXED: Array check prevents crash */}
                {(skills || []).length > 0 ? (skills || []).map(s => (
                  <div key={s._id} className="card-base p-3 flex justify-between items-center">
                    <span className="text-sm text-white">{s.name} <span className="text-[10px] text-slate-500 ml-2 uppercase tracking-tighter">{s.category}</span></span>
                    <button onClick={() => handleDeleteSkill(s._id)} className="text-xs text-red-400 hover:underline">Delete</button>
                  </div>
                )) : <p className="text-slate-500 text-center text-sm py-10">No skills found.</p>}
              </div>
            </div>
          )}

          {/* ── CERTIFICATES TAB ── */}
          {tab === 'certificates' && (
            <div className="grid md:grid-cols-2 gap-8">
              <form onSubmit={handleAddCert} className="card-base p-6 space-y-4 h-fit">
                <h3 className="text-white font-medium">Add Certificate</h3>
                <input className="input-base text-sm" placeholder="Title" value={newCert.title} onChange={e => setNewCert({ ...newCert, title: e.target.value })} required />
                <input className="input-base text-sm" placeholder="Organization" value={newCert.organization} onChange={e => setNewCert({ ...newCert, organization: e.target.value })} required />
                <input className="input-base text-sm" placeholder="Date" value={newCert.date} onChange={e => setNewCert({ ...newCert, date: e.target.value })} />
                <button className="btn-primary w-full py-2">Add Certificate</button>
              </form>
              <div className="space-y-3">
                {/* 🚀 FIXED: Array check prevents crash */}
                {(certs || []).length > 0 ? (certs || []).map(c => (
                  <div key={c._id} className="card-base p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white text-sm font-bold">{c.title}</p>
                        <p className="text-blue-400 text-xs">{c.organization}</p>
                      </div>
                      <button onClick={() => handleDeleteCert(c._id)} className="text-xs text-red-500">Delete</button>
                    </div>
                  </div>
                )) : <p className="text-slate-500 text-center text-sm py-10">No certificates found.</p>}
              </div>
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {tab === 'messages' && (
            <div className="space-y-3">
              {(messages || []).map((m) => (
                <div key={m._id} className={`card-base p-5 ${!m.read ? 'border-blue-400/30 shadow-lg shadow-blue-500/5' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium text-sm">{m.name} <span className="text-slate-500 font-normal">({m.email})</span></p>
                      <p className="text-slate-400 text-sm mt-2">{m.message}</p>
                    </div>
                    <div className="flex gap-2">
                      {!m.read && <button onClick={() => markRead(m._id)} className="text-xs text-blue-400">Read</button>}
                      <button onClick={() => deleteMessage(m._id)} className="text-xs text-red-400">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}