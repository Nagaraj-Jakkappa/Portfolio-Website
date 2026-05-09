/**
 * SettingsPage.jsx
 * Path: client/src/pages/admin/SettingsPage.jsx
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card, CardHeader, PageHeader, Btn, Input, Spinner, Ic } from '../../components/admin/ui/ui';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { admin } = useAuth();

    const [profile, setProfile] = useState({ username: admin?.username ?? '', email: '' });
    const [pass, setPass] = useState({ current: '', next: '', confirm: '' });
    const [savingP, setSavingP] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    const handleProfileSave = async () => {
        setSavingP(true);
        await new Promise(r => setTimeout(r, 700)); // mock — add PUT /api/auth/profile if needed
        toast.success('Profile saved');
        setSavingP(false);
    };

    const handlePasswordSave = async () => {
        if (!pass.current) { toast.error('Enter your current password'); return; }
        if (pass.next.length < 8) { toast.error('New password must be at least 8 characters'); return; }
        if (pass.next !== pass.confirm) { toast.error('Passwords do not match'); return; }
        setSavingPw(true);
        try {
            await api.put('/auth/password', { currentPassword: pass.current, newPassword: pass.next });
            toast.success('Password changed successfully');
            setPass({ current: '', next: '', confirm: '' });
        } catch (e) {
            toast.error(e?.response?.data?.error ?? 'Change failed');
        } finally { setSavingPw(false); }
    };

    return (
        <div className="p-5 md:p-7 max-w-[680px] mx-auto space-y-4">
            <PageHeader title="Settings" description="Manage your admin account" />

            {/* Profile */}
            <Card>
                <CardHeader title="Profile" subtitle="Update your admin display name and contact" />
                <div className="space-y-4">
                    <Input label="Username" value={profile.username}
                        onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} />
                    <Input label="Email (optional)" type="email" value={profile.email}
                        placeholder="admin@techartistry.in"
                        onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                    <div className="flex justify-end pt-2">
                        <Btn variant="primary" onClick={handleProfileSave} disabled={savingP}>
                            {savingP ? <><Spinner size={13} /> Saving…</> : 'Save Profile'}
                        </Btn>
                    </div>
                </div>
            </Card>

            {/* Password */}
            <Card>
                <CardHeader title="Change Password" subtitle="Minimum 8 characters — use a strong, unique password" />
                <div className="space-y-4">
                    <Input label="Current Password" type="password" value={pass.current}
                        onChange={e => setPass(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
                    <Input label="New Password" type="password" value={pass.next}
                        onChange={e => setPass(p => ({ ...p, next: e.target.value }))} placeholder="••••••••" />
                    <Input label="Confirm New Password" type="password" value={pass.confirm}
                        onChange={e => setPass(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" />
                    <div className="flex justify-end pt-2">
                        <Btn variant="primary" onClick={handlePasswordSave} disabled={savingPw}>
                            {savingPw ? <><Spinner size={13} /> Changing…</> : 'Change Password'}
                        </Btn>
                    </div>
                </div>
            </Card>

            {/* Site info */}
            <Card>
                <CardHeader title="Site Information" subtitle="Read-only — update via .env" />
                <div className="space-y-3">
                    {[
                        { label: 'Site Name', value: 'Techartistry' },
                        { label: 'Domain', value: 'techartistry.in' },
                        { label: 'Stack', value: 'MERN — MongoDB · Express · React · Node.js' },
                        { label: 'API Version', value: 'v1' },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex items-center gap-4 py-2 border-b border-[#1e2d3d] last:border-0">
                            <span className="text-xs text-slate-600 w-28 flex-shrink-0">{label}</span>
                            <span className="text-sm text-slate-300 font-mono">{value}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Danger zone */}
            <Card className="border-red-500/20">
                <CardHeader title="Danger Zone" subtitle="Irreversible actions — proceed with caution" />
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-red-500/[0.04] border border-red-500/10 rounded-xl">
                        <div>
                            <p className="text-sm font-medium text-slate-300">Clear all messages</p>
                            <p className="text-xs text-slate-600 mt-0.5">Permanently delete every contact message from the database.</p>
                        </div>
                        <Btn variant="danger" size="sm"
                            onClick={() => toast.error('Not yet implemented — add DELETE /api/messages endpoint')}>
                            Clear
                        </Btn>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-500/[0.04] border border-red-500/10 rounded-xl">
                        <div>
                            <p className="text-sm font-medium text-slate-300">Export data</p>
                            <p className="text-xs text-slate-600 mt-0.5">Download all projects and messages as JSON.</p>
                        </div>
                        <Btn variant="ghost" size="sm"
                            onClick={() => toast.error('Not yet implemented — add GET /api/admin/export endpoint')}>
                            Export
                        </Btn>
                    </div>
                </div>
            </Card>
        </div>
    );
}
