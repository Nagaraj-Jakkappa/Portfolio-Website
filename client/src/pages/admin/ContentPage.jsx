/**
 * ContentPage.jsx
 * Admin Content Manager — manage Hero, About, Resume, Social Links, Currently Building.
 */

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Card,
  PageHeader,
  Btn,
  Input,
  Textarea,
  Spinner,
  Ic,
} from '../../components/admin/ui/ui';
import toast from 'react-hot-toast';

const IC = {
  save: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8',
  plus: 'M12 5v14 M5 12h14',
  trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
  check: 'M20 6L9 17l-5-5',
  chevDown: 'M6 9l6 6 6-6',
  chevUp: 'M18 15l-6-6-6 6',
};

const EMPTY_CONTENT = {
  hero: {
    headline: '',
    subtitle: '',
    role: '',
    primaryCtaText: '',
    primaryCtaHref: '',
    secondaryCtaText: '',
    secondaryCtaHref: '',
  },
  about: {
    title: '',
    intro: '',
    imageUrl: '',
    location: '',
    experienceLabel: '',
    highlights: [],
  },
  resume: { resumeUrl: '', updatedAtText: '' },
  socialLinks: { github: '', linkedin: '', email: '', phone: '', location: '' },
  currentlyBuilding: [],
};

// ── Collapsible Section ─────────────────────────────────────
function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <Ic d={open ? IC.chevUp : IC.chevDown} size={14} />
      </button>
      {open && <div className="mt-4 space-y-4">{children}</div>}
    </Card>
  );
}

export default function ContentPage() {
  const [form, setForm] = useState(EMPTY_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/site-content');
        if (data) {
          setForm({
            hero: { ...EMPTY_CONTENT.hero, ...data.hero },
            about: { ...EMPTY_CONTENT.about, ...data.about, highlights: data.about?.highlights || [] },
            resume: { ...EMPTY_CONTENT.resume, ...data.resume },
            socialLinks: { ...EMPTY_CONTENT.socialLinks, ...data.socialLinks },
            currentlyBuilding: Array.isArray(data.currentlyBuilding) ? data.currentlyBuilding : [],
          });
        }
      } catch {
        // first load — use empty defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Helpers ────────────────────────────────────────────────
  const setNested = (section, key, val) =>
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: val } }));

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/site-content', form);
      setForm({
        hero: { ...EMPTY_CONTENT.hero, ...data.hero },
        about: { ...EMPTY_CONTENT.about, ...data.about, highlights: data.about?.highlights || [] },
        resume: { ...EMPTY_CONTENT.resume, ...data.resume },
        socialLinks: { ...EMPTY_CONTENT.socialLinks, ...data.socialLinks },
        currentlyBuilding: Array.isArray(data.currentlyBuilding) ? data.currentlyBuilding : [],
      });
      toast.success('Content saved!');
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.error ||
        'Save failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Currently Building helpers ─────────────────────────────
  const addBuildItem = () =>
    setForm((f) => ({
      ...f,
      currentlyBuilding: [...f.currentlyBuilding, { title: '', description: '', status: 'Active' }],
    }));

  const updateBuildItem = (i, key, val) =>
    setForm((f) => ({
      ...f,
      currentlyBuilding: f.currentlyBuilding.map((item, idx) =>
        idx === i ? { ...item, [key]: val } : item
      ),
    }));

  const removeBuildItem = (i) =>
    setForm((f) => ({
      ...f,
      currentlyBuilding: f.currentlyBuilding.filter((_, idx) => idx !== i),
    }));

  // ── About Highlights helpers ───────────────────────────────
  const addHighlight = () =>
    setForm((f) => ({
      ...f,
      about: { ...f.about, highlights: [...f.about.highlights, { title: '', description: '' }] },
    }));

  const updateHighlight = (i, key, val) =>
    setForm((f) => ({
      ...f,
      about: {
        ...f.about,
        highlights: f.about.highlights.map((h, idx) =>
          idx === i ? { ...h, [key]: val } : h
        ),
      },
    }));

  const removeHighlight = (i) =>
    setForm((f) => ({
      ...f,
      about: { ...f.about, highlights: f.about.highlights.filter((_, idx) => idx !== i) },
    }));

  // ── Render ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-5 md:p-7 max-w-[900px] mx-auto flex items-center justify-center min-h-[400px]">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-7 max-w-[900px] mx-auto">
      <PageHeader
        title="Content Manager"
        description="Manage your public portfolio content"
        action={
          <Btn variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Spinner size={13} /> Saving…
              </>
            ) : (
              <>
                <Ic d={IC.save} size={13} /> Save All
              </>
            )}
          </Btn>
        }
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <Section title="Hero Section" defaultOpen>
        <Input
          label="Headline"
          value={form.hero.headline}
          onChange={(e) => setNested('hero', 'headline', e.target.value)}
          placeholder="Crafting Digital Artistry Through Code"
        />
        <Input
          label="Role / Sub-brand"
          value={form.hero.role}
          onChange={(e) => setNested('hero', 'role', e.target.value)}
          placeholder="Nagaraj Jakkappa @ Techartistry.in"
        />
        <Textarea
          label="Subtitle / Description"
          value={form.hero.subtitle}
          onChange={(e) => setNested('hero', 'subtitle', e.target.value)}
          placeholder="BCA Graduate & Full-Stack Developer specializing in the MERN stack..."
          rows={3}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Primary CTA Text"
            value={form.hero.primaryCtaText}
            onChange={(e) => setNested('hero', 'primaryCtaText', e.target.value)}
            placeholder="Explore Projects"
          />
          <Input
            label="Primary CTA Href"
            value={form.hero.primaryCtaHref}
            onChange={(e) => setNested('hero', 'primaryCtaHref', e.target.value)}
            placeholder="#projects"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Secondary CTA Text"
            value={form.hero.secondaryCtaText}
            onChange={(e) => setNested('hero', 'secondaryCtaText', e.target.value)}
            placeholder="View Resume"
          />
          <Input
            label="Secondary CTA Href"
            value={form.hero.secondaryCtaHref}
            onChange={(e) => setNested('hero', 'secondaryCtaHref', e.target.value)}
            placeholder="/resume.pdf"
          />
        </div>
      </Section>

      {/* ── About / Profile ──────────────────────────────── */}
      <Section title="About / Profile">
        <Input
          label="Section Title"
          value={form.about.title}
          onChange={(e) => setNested('about', 'title', e.target.value)}
          placeholder="The person behind the code"
        />
        <Textarea
          label="Intro (paragraphs)"
          value={form.about.intro}
          onChange={(e) => setNested('about', 'intro', e.target.value)}
          placeholder="Hey! I'm a passionate frontend developer from Yadgir..."
          rows={5}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Profile Image URL"
            value={form.about.imageUrl}
            onChange={(e) => setNested('about', 'imageUrl', e.target.value)}
            placeholder="https://res.cloudinary.com/…/profile.jpg"
            hint="Use Cloudinary or similar host"
          />
          <Input
            label="Location"
            value={form.about.location}
            onChange={(e) => setNested('about', 'location', e.target.value)}
            placeholder="Yadgir, Karnataka"
          />
        </div>
        <Input
          label="Experience Label"
          value={form.about.experienceLabel}
          onChange={(e) => setNested('about', 'experienceLabel', e.target.value)}
          placeholder="BCA Graduate | Frontend Intern"
        />

        {/* Highlights */}
        <div className="pt-2 border-t border-navy-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Highlights / Timeline</span>
            <Btn variant="ghost" size="sm" onClick={addHighlight}>
              <Ic d={IC.plus} size={11} /> Add
            </Btn>
          </div>
          {form.about.highlights.map((h, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 mb-2 items-start">
              <Input
                value={h.title}
                onChange={(e) => updateHighlight(i, 'title', e.target.value)}
                placeholder="Title"
              />
              <Input
                value={h.description}
                onChange={(e) => updateHighlight(i, 'description', e.target.value)}
                placeholder="Description"
              />
              <button
                onClick={() => removeHighlight(i)}
                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-0.5"
              >
                <Ic d={IC.trash} size={13} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Resume ───────────────────────────────────────── */}
      <Section title="Resume">
        <Input
          label="Resume URL"
          value={form.resume.resumeUrl}
          onChange={(e) => setNested('resume', 'resumeUrl', e.target.value)}
          placeholder="https://drive.google.com/file/…"
          hint="PDF hosted on Google Drive, Cloudinary, etc."
        />
        <Input
          label="Last Updated Text"
          value={form.resume.updatedAtText}
          onChange={(e) => setNested('resume', 'updatedAtText', e.target.value)}
          placeholder="Updated June 2026"
        />
      </Section>

      {/* ── Social Links ─────────────────────────────────── */}
      <Section title="Social / Contact Links">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="GitHub URL"
            value={form.socialLinks.github}
            onChange={(e) => setNested('socialLinks', 'github', e.target.value)}
            placeholder="https://github.com/username"
          />
          <Input
            label="LinkedIn URL"
            value={form.socialLinks.linkedin}
            onChange={(e) => setNested('socialLinks', 'linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email"
            value={form.socialLinks.email}
            onChange={(e) => setNested('socialLinks', 'email', e.target.value)}
            placeholder="you@email.com"
          />
          <Input
            label="Phone"
            value={form.socialLinks.phone}
            onChange={(e) => setNested('socialLinks', 'phone', e.target.value)}
            placeholder="+91 1234567890"
          />
        </div>
        <Input
          label="Location"
          value={form.socialLinks.location}
          onChange={(e) => setNested('socialLinks', 'location', e.target.value)}
          placeholder="Yadgir, Karnataka, India"
        />
      </Section>

      {/* ── Currently Building ────────────────────────────── */}
      <Section title="Currently Building">
        {form.currentlyBuilding.map((item, i) => (
          <div key={i} className="p-4 bg-navy-950 border border-navy-800 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-xs text-slate-500 font-mono">Item #{i + 1}</span>
              <button
                onClick={() => removeBuildItem(i)}
                className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Ic d={IC.trash} size={13} />
              </button>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <Input
                label="Title"
                value={item.title}
                onChange={(e) => updateBuildItem(i, 'title', e.target.value)}
                placeholder="ResumeIQ"
              />
              <Input
                label="Status"
                value={item.status}
                onChange={(e) => updateBuildItem(i, 'status', e.target.value)}
                placeholder="Active"
              />
            </div>
            <Textarea
              label="Description"
              value={item.description}
              onChange={(e) => updateBuildItem(i, 'description', e.target.value)}
              placeholder="AI-powered resume intelligence platform..."
              rows={2}
            />
          </div>
        ))}
        <Btn variant="ghost" onClick={addBuildItem}>
          <Ic d={IC.plus} size={13} /> Add Item
        </Btn>
      </Section>

      {/* ── Bottom Save ──────────────────────────────────── */}
      <div className="flex justify-end mt-4">
        <Btn variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner size={13} /> Saving…
            </>
          ) : (
            <>
              <Ic d={IC.check} size={13} /> Save All Changes
            </>
          )}
        </Btn>
      </div>
    </div>
  );
}
