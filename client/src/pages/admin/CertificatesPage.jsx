import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { PageHeader, Btn, Input, Textarea, Modal, EmptyState, Ic, Spinner } from '../../components/admin/ui/ui';
import toast from 'react-hot-toast';

const IC = {
    plus: 'M12 5v14 M5 12h14',
    cert: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
    link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71',
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
            footer={<>
                <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
                <Btn variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? <Spinner size={13} /> : <Ic d={IC.check} size={13} />} Save
                </Btn>
            </>}>
            <div className="space-y-4">
                <Input label="Title *" value={form.title} onChange={e => set('title', e.target.value)} />
                <Input label="Organization *" value={form.organization} onChange={e => set('organization', e.target.value)} />
                <Input label="Logo URL" value={form.organizationLogo} onChange={e => set('organizationLogo', e.target.value)} placeholder="https://..." icon={<Ic d={IC.image} size={14} />} />
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Date" type="date" value={form.date?.slice(0, 10) ?? ''} onChange={e => set('date', e.target.value)} />
                    <Input label="Link" value={form.link} onChange={e => set('link', e.target.value)} />
                </div>
                <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
        </Modal>
    );
}

function CertCard({ cert, onEdit, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    return (
        <div className="bg-[#0d1b2a] border border-[#1e2d3d] rounded-xl p-5 hover:border-[#2a3f55] transition-all group">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 overflow-hidden">
                {cert.organizationLogo ? (
                    <img
                        src={cert.organizationLogo}
                        alt={cert.organization}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => { e.target.onerror = null; e.target.src = ''; }} // Fallback if link is bad
                    />
                ) : (
                    <div className="text-[#38bdf8]"><Ic d={IC.cert} size={20} /></div>
                )}
            </div>

            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{cert.title}</h3>
            <p className="text-xs text-[#38bdf8] mb-1">{cert.organization}</p>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-3 border-t border-[#1e2d3d] mt-3">
                <button onClick={() => onEdit(cert)} className="p-1.5 text-slate-400 hover:text-white"><Ic d={IC.edit} size={12} /></button>
                {confirmDelete ? (
                    <button onClick={() => onDelete(cert._id)} className="text-[10px] text-red-400">Confirm?</button>
                ) : (
                    <button onClick={() => setConfirmDelete(true)} className="p-1.5 text-slate-400 hover:text-red-400"><Ic d={IC.trash} size={12} /></button>
                )}
            </div>
        </div>
    );
}

export default function CertificatesPage() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        api.get('/certificates').then(r => setCerts(r.data)).finally(() => setLoading(false));
    }, []);

    const handleSave = async (payload, id) => {
        const { data } = id ? await api.put(`/certificates/${id}`, payload) : await api.post('/certificates', payload);
        setCerts(prev => id ? prev.map(x => x._id === id ? data : x) : [data, ...prev]);
        toast.success('Saved!');
    };

    const handleDelete = async (id) => {
        await api.delete(`/certificates/${id}`);
        setCerts(c => c.filter(x => x._id !== id));
    };

    return (
        <div className="p-5 max-w-[1400px] mx-auto">
            {modal && <CertModal cert={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
            <PageHeader title="Certificates" action={<Btn variant="primary" onClick={() => setModal('create')}>Add New</Btn>} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {certs.map(c => <CertCard key={c._id} cert={c} onEdit={setModal} onDelete={handleDelete} />)}
            </div>
        </div>
    );
}