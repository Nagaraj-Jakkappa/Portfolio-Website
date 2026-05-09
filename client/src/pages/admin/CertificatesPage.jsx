import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Card, PageHeader, Btn, Input, Textarea, Modal, EmptyState, Spinner, Ic, Badge } from '../../components/admin/ui/ui';
import toast from 'react-hot-toast';

const IC = {
    plus: 'M12 5v14 M5 12h14',
    cert: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
    link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
    check: 'M20 6L9 17l-5-5',
    edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
    image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
};

const EMPTY = { title: '', organization: '', organizationLogo: '', date: '', link: '', description: '' };

function CertModal({ cert, onClose, onSave }) {
    const editing = !!cert?._id;
    const [form, setForm] = useState(editing ? { ...cert } : EMPTY);
    const [saving, setSaving] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        if (!form.title.trim() || !form.organization.trim()) {
            toast.error('Title and Organization are required'); return;
        }
        setSaving(true);
        try {
            await onSave(form, cert?._id);
            onClose();
        } catch { toast.error('Save failed'); }
        finally { setSaving(false); }
    };

    return (
        <Modal open onClose={onClose}
            title={editing ? 'Edit Certificate' : 'Add Certificate'}
            subtitle={editing ? 'Update certificate details' : 'Add a new certification to your portfolio'}
            footer={<>
                <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
                <Btn variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? <><Spinner size={13} /> Saving…</> : <><Ic d={IC.check} size={13} /> {editing ? 'Update' : 'Add Certificate'}</>}
                </Btn>
            </>}>
            <div className="space-y-4">
                <Input label="Certificate Title *" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. React - The Complete Guide 2024" />
                <Input label="Issuing Organization *" value={form.organization} onChange={e => set('organization', e.target.value)} placeholder="Udemy, Coursera, Google, etc." />
                {/* New Logo URL Input */}
                <Input label="Organization Logo URL" value={form.organizationLogo} onChange={e => set('organizationLogo', e.target.value)} placeholder="https://logo-url.com/logo.png" icon={<Ic d={IC.image} size={14} />} />
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Date Issued" type="date" value={form.date?.slice(0, 10) ?? ''} onChange={e => set('date', e.target.value)} />
                    <Input label="Credential URL" value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://..." />
                </div>
                <Textarea label="Description (optional)" value={form.description} onChange={e => set('description', e.target.value)} placeholder="What did you learn? Key topics covered…" />
            </div>
        </Modal>
    );
}

function CertCard({ cert, onEdit, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    return (
        <div className="bg-[#0d1b2a] border border-[#1e2d3d] rounded-xl p-5 hover:border-[#2a3f55] transition-colors group">
            {/* Logic to show Logo or Default Icon */}
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 overflow-hidden">
                {cert.organizationLogo ? (
                    <img src={cert.organizationLogo} alt={cert.organization} className="w-full h-full object-contain p-2" />
                ) : (
                    <div className="bg-gradient-to-br from-[#38bdf8]/20 to-[#6366f1]/20 w-full h-full flex items-center justify-center">
                        <Ic d={IC.cert} size={20} />
                    </div>
                )}
            </div>
            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 leading-snug">{cert.title}</h3>
            <p className="text-xs text-[#38bdf8] mb-1 font-medium">{cert.organization}</p>
            {cert.date && (
                <p className="text-xs text-slate-600 mb-3">
                    {new Date(cert.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </p>
            )}
            {cert.description && (
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">{cert.description}</p>
            )}

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-3 border-t border-[#1e2d3d]">
                {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[#38bdf8] hover:underline">
                        <Ic d={IC.link} size={11} /> Verify
                    </a>
                )}
                <div className="ml-auto flex gap-1">
                    <button onClick={() => onEdit(cert)}
                        className="p-1.5 text-slate-600 hover:text-[#38bdf8] hover:bg-[#38bdf8]/10 rounded-lg transition-all">
                        <Ic d={IC.edit} size={12} />
                    </button>
                    {confirmDelete
                        ? (
                            <div className="flex gap-1">
                                <button onClick={() => setConfirmDelete(false)}
                                    className="text-xs px-2 py-1 text-slate-500 hover:text-slate-300 border border-[#1e2d3d] rounded-md transition-all">No</button>
                                <button onClick={() => { onDelete(cert._id); setConfirmDelete(false); }}
                                    className="text-xs px-2 py-1 text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">Yes</button>
                            </div>
                        )
                        : (
                            <button onClick={() => setConfirmDelete(true)}
                                className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                <Ic d={IC.trash} size={12} />
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default function CertificatesPage() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        api.get('/certificates').then(r => setCerts(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleSave = async (payload, id) => {
        if (id) {
            const { data } = await api.put(`/certificates/${id}`, payload);
            setCerts(c => c.map(x => x._id === id ? data : x));
            toast.success('Certificate updated');
        } else {
            const { data } = await api.post('/certificates', payload);
            setCerts(c => [data, ...c]);
            toast.success('Certificate added');
        }
    };

    const handleDelete = async (id) => {
        await api.delete(`/certificates/${id}`);
        setCerts(c => c.filter(x => x._id !== id));
        toast.success('Certificate removed');
    };

    return (
        <div className="p-5 md:p-7 max-w-[1400px] mx-auto">
            {modal && (
                <CertModal
                    cert={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                />
            )}

            <PageHeader
                title="Certificates"
                description={`${certs.length} certificate${certs.length !== 1 ? 's' : ''} in your portfolio`}
                action={<Btn variant="primary" onClick={() => setModal('create')}><Ic d={IC.plus} size={14} /> Add Certificate</Btn>}
            />

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-52 bg-[#0d1b2a] border border-[#1e2d3d] rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : certs.length === 0 ? (
                <EmptyState
                    icon={<Ic d={IC.cert} size={22} />}
                    title="No certificates yet"
                    description="Add your certifications to showcase your learning and achievements."
                    action={<Btn variant="primary" size="sm" onClick={() => setModal('create')}><Ic d={IC.plus} size={13} /> Add Certificate</Btn>}
                />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {certs.map(c => (
                        <CertCard key={c._id} cert={c} onEdit={setModal} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}