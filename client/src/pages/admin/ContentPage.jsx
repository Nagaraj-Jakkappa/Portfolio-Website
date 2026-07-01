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
    badge: '',
    headline: '',
    name: '',
    roles: [],
    description: '',
    stats: [],
    subtitle: '',
    role: '',
    primaryCtaText: '',
    primaryCtaHref: '',
    secondaryCtaText: '',
    secondaryCtaHref: '',
  },
  about: {
    title: '',
    paragraphs: [],
    highlightKeywords: [],
    intro: '',
    imageUrl: '',
    location: '',
    experienceLabel: '',
    highlights: [],
  },
  resume: { resumeUrl: '', updatedAtText: '' },
  socialLinks: { github: '', linkedin: '', email: '', whatsapp: '', phone: '', location: '' },
  currentlyBuilding: [],
  seo: { title: '', description: '', keywords: '', ogImage: '', twitterImage: '' },
  impactMetrics: [],
  footer: { brandName: '', tagline: '', copyrightText: '', builtWithText: '' },
  navbar: [],
  now: [],
  techPulse: [],
  engineeringHighlights: [],
  brandIdentity: { wordmarkUrl: '', logomarkUrl: '', faviconUrl: '' },
  mediaAssets: {
    heroIllustration: { url: '', alt: '', isActive: true },
    techStackIllustration: { url: '', alt: '', isActive: true },
    engineeringWorkflow: { url: '', alt: '', isActive: true },
  },
  uiEffects: {
    customCursor: { isActive: true, color: '#22d3ee', label: 'Premium Cursor' }
  },
  homepageSections: []
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
            hero: { ...EMPTY_CONTENT.hero, ...data.hero, roles: data.hero?.roles || [], stats: data.hero?.stats || [] },
            about: { ...EMPTY_CONTENT.about, ...data.about, highlights: data.about?.highlights || [], paragraphs: data.about?.paragraphs || [], highlightKeywords: data.about?.highlightKeywords || [] },
            resume: { ...EMPTY_CONTENT.resume, ...data.resume },
            socialLinks: { ...EMPTY_CONTENT.socialLinks, ...data.socialLinks },
            currentlyBuilding: Array.isArray(data.currentlyBuilding) ? data.currentlyBuilding : [],
            seo: { ...EMPTY_CONTENT.seo, ...data.seo },
            impactMetrics: Array.isArray(data.impactMetrics) ? data.impactMetrics : [],
            footer: { ...EMPTY_CONTENT.footer, ...data.footer },
            navbar: Array.isArray(data.navbar) ? data.navbar : [],
            now: Array.isArray(data.now) ? data.now : [],
            techPulse: Array.isArray(data.techPulse) ? data.techPulse : [],
            engineeringHighlights: Array.isArray(data.engineeringHighlights) ? data.engineeringHighlights : [],
            brandIdentity: { ...EMPTY_CONTENT.brandIdentity, ...data.brandIdentity },
            mediaAssets: { ...EMPTY_CONTENT.mediaAssets, ...data.mediaAssets },
            uiEffects: { ...EMPTY_CONTENT.uiEffects, ...data.uiEffects },
            homepageSections: Array.isArray(data.homepageSections) ? data.homepageSections : [],
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

  const moveHomepageSection = (index, direction) => {
    const list = [...form.homepageSections];
    if (direction === 'up' && index > 0) {
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
    } else if (direction === 'down' && index < list.length - 1) {
      [list[index + 1], list[index]] = [list[index], list[index + 1]];
    }
    // Update order values based on array position
    const reordered = list.map((item, i) => ({ ...item, order: i + 1 }));
    setForm((f) => ({ ...f, homepageSections: reordered }));
  };

  const updateHomepageSectionLabel = (index, label) => {
    const list = [...form.homepageSections];
    list[index] = { ...list[index], label };
    setForm((f) => ({ ...f, homepageSections: list }));
  };

  const updateHomepageSectionNavLabel = (index, navLabel) => {
    const list = [...form.homepageSections];
    list[index] = { ...list[index], navLabel };
    setForm((f) => ({ ...f, homepageSections: list }));
  };

  const updateHomepageSectionShowInNav = (index, showInNav) => {
    const list = [...form.homepageSections];
    list[index] = { ...list[index], showInNav };
    setForm((f) => ({ ...f, homepageSections: list }));
  };

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        now: form.now.map((item, idx) => ({
          ...item,
          order: Number(item.order) || idx + 1,
          size: item.size || 'small',
          themeColor: item.themeColor || 'blue',
          visible: item.visible !== false,
        })),
        techPulse: form.techPulse.map((item, idx) => ({
          ...item,
          order: Number(item.order) || idx + 1,
          size: item.size || 'small',
          themeColor: item.themeColor || 'cyan',
          visible: item.visible !== false,
        })),
        engineeringHighlights: form.engineeringHighlights.map((item, idx) => ({
          ...item,
          order: Number(item.order) || idx + 1,
          size: item.size || 'small',
          themeColor: item.themeColor || 'cyan',
          visible: item.visible !== false,
        })),
      };

      console.log('Saving site content:', {
        now: payload.now,
        techPulse: payload.techPulse,
        engineeringHighlights: payload.engineeringHighlights
      });

      const { data } = await api.put('/site-content', payload);
      setForm({
        hero: { ...EMPTY_CONTENT.hero, ...data.hero, roles: data.hero?.roles || [], stats: data.hero?.stats || [] },
        about: { ...EMPTY_CONTENT.about, ...data.about, highlights: data.about?.highlights || [], paragraphs: data.about?.paragraphs || [], highlightKeywords: data.about?.highlightKeywords || [] },
        resume: { ...EMPTY_CONTENT.resume, ...data.resume },
        socialLinks: { ...EMPTY_CONTENT.socialLinks, ...data.socialLinks },
        currentlyBuilding: Array.isArray(data.currentlyBuilding) ? data.currentlyBuilding : [],
        seo: { ...EMPTY_CONTENT.seo, ...data.seo },
        impactMetrics: Array.isArray(data.impactMetrics) ? data.impactMetrics : [],
        footer: { ...EMPTY_CONTENT.footer, ...data.footer },
        navbar: Array.isArray(data.navbar) ? data.navbar : [],
        now: Array.isArray(data.now) ? data.now : [],
        techPulse: Array.isArray(data.techPulse) ? data.techPulse : [],
        engineeringHighlights: Array.isArray(data.engineeringHighlights) ? data.engineeringHighlights : [],
        brandIdentity: { ...EMPTY_CONTENT.brandIdentity, ...data.brandIdentity },
        mediaAssets: { ...EMPTY_CONTENT.mediaAssets, ...data.mediaAssets },
        uiEffects: { ...EMPTY_CONTENT.uiEffects, ...data.uiEffects },
        homepageSections: Array.isArray(data.homepageSections) ? data.homepageSections : [],
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

  // ── Hero Roles helpers ──────────────────────────────────────
  const addRole = () => setForm((f) => ({ ...f, hero: { ...f.hero, roles: [...f.hero.roles, ''] } }));
  const updateRole = (i, val) => setForm((f) => ({ ...f, hero: { ...f.hero, roles: f.hero.roles.map((r, idx) => (idx === i ? val : r)) } }));
  const removeRole = (i) => setForm((f) => ({ ...f, hero: { ...f.hero, roles: f.hero.roles.filter((_, idx) => idx !== i) } }));

  // ── Hero Stats helpers ──────────────────────────────────────
  const addStat = () => setForm((f) => ({ ...f, hero: { ...f.hero, stats: [...f.hero.stats, { value: '', label: '', order: 0, isActive: true }] } }));
  const updateStat = (i, key, val) => setForm((f) => ({ ...f, hero: { ...f.hero, stats: f.hero.stats.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)) } }));
  const removeStat = (i) => setForm((f) => ({ ...f, hero: { ...f.hero, stats: f.hero.stats.filter((_, idx) => idx !== i) } }));

  // ── About Paragraphs helpers ────────────────────────────────
  const addParagraph = () => setForm((f) => ({ ...f, about: { ...f.about, paragraphs: [...f.about.paragraphs, ''] } }));
  const updateParagraph = (i, val) => setForm((f) => ({ ...f, about: { ...f.about, paragraphs: f.about.paragraphs.map((p, idx) => (idx === i ? val : p)) } }));
  const removeParagraph = (i) => setForm((f) => ({ ...f, about: { ...f.about, paragraphs: f.about.paragraphs.filter((_, idx) => idx !== i) } }));

  // ── About Highlight Keywords helpers ────────────────────────
  const addHighlightKeyword = () => setForm((f) => ({ ...f, about: { ...f.about, highlightKeywords: [...f.about.highlightKeywords, ''] } }));
  const updateHighlightKeyword = (i, val) => setForm((f) => ({ ...f, about: { ...f.about, highlightKeywords: f.about.highlightKeywords.map((k, idx) => (idx === i ? val : k)) } }));
  const removeHighlightKeyword = (i) => setForm((f) => ({ ...f, about: { ...f.about, highlightKeywords: f.about.highlightKeywords.filter((_, idx) => idx !== i) } }));

  // ── Currently Building helpers ─────────────────────────────
  const addBuildItem = () =>
    setForm((f) => ({
      ...f,
      currentlyBuilding: [...f.currentlyBuilding, { title: '', description: '', status: 'Active', order: 0, isActive: true, color: 'cyan', size: 'small' }],
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

  // ── Now Section helpers ────────────────────────────────────
  const addNowItem = () =>
    setForm((f) => ({
      ...f,
      now: [...f.now, { category: '', description: '', icon: '🚀', themeColor: 'blue', size: 'small', visible: true, order: 0 }],
    }));

  const updateNowItem = (i, key, val) =>
    setForm((f) => ({
      ...f,
      now: f.now.map((item, idx) =>
        idx === i ? { ...item, [key]: val } : item
      ),
    }));

  const removeNowItem = (i) =>
    setForm((f) => ({
      ...f,
      now: f.now.filter((_, idx) => idx !== i),
    }));

  // ── Tech Pulse helpers ─────────────────────────────────────
  const addTechPulseItem = () =>
    setForm((f) => ({
      ...f,
      techPulse: [...f.techPulse, { title: '', description: '', icon: '⚡', tag: '', themeColor: 'cyan', size: 'small', visible: true, order: 0 }],
    }));

  const updateTechPulseItem = (i, key, val) =>
    setForm((f) => ({
      ...f,
      techPulse: f.techPulse.map((item, idx) =>
        idx === i ? { ...item, [key]: val } : item
      ),
    }));

  const removeTechPulseItem = (i) =>
    setForm((f) => ({
      ...f,
      techPulse: f.techPulse.filter((_, idx) => idx !== i),
    }));

  // ── Engineering Highlights helpers ─────────────────────────
  const addEngineeringItem = () =>
    setForm((f) => ({
      ...f,
      engineeringHighlights: [...f.engineeringHighlights, { title: '', description: '', icon: '🛠️', tag: '', themeColor: 'cyan', size: 'small', visible: true, order: 0 }],
    }));

  const updateEngineeringItem = (i, key, val) =>
    setForm((f) => ({
      ...f,
      engineeringHighlights: f.engineeringHighlights.map((item, idx) =>
        idx === i ? { ...item, [key]: val } : item
      ),
    }));

  const removeEngineeringItem = (i) =>
    setForm((f) => ({
      ...f,
      engineeringHighlights: f.engineeringHighlights.filter((_, idx) => idx !== i),
    }));

  // ── Impact Metrics helpers ─────────────────────────────────
  const addImpactMetric = () =>
    setForm((f) => ({ ...f, impactMetrics: [...f.impactMetrics, { label: '', value: '', description: '', order: 0, isActive: true, color: 'cyan', size: 'normal' }] }));
  const updateImpactMetric = (i, key, val) =>
    setForm((f) => ({ ...f, impactMetrics: f.impactMetrics.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)) }));
  const removeImpactMetric = (i) =>
    setForm((f) => ({ ...f, impactMetrics: f.impactMetrics.filter((_, idx) => idx !== i) }));

  // ── Navbar helpers ─────────────────────────────────────────
  const addNavbarLink = () =>
    setForm((f) => ({ ...f, navbar: [...f.navbar, { label: '', href: '', type: 'section', visible: true, order: 0 }] }));
  const updateNavbarLink = (i, key, val) =>
    setForm((f) => ({ ...f, navbar: f.navbar.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)) }));
  const removeNavbarLink = (i) =>
    setForm((f) => ({ ...f, navbar: f.navbar.filter((_, idx) => idx !== i) }));

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
      <div className="p-5 md:p-7 max-w-[900px] mx-auto">
        <div className="mb-6 space-y-2">
          <div className="h-8 w-48 bg-navy-800 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-navy-800 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-navy-900 rounded-xl animate-pulse border border-navy-800" />
          ))}
        </div>
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

      {/* ── Homepage Layout Controls ─────────────────────────── */}
      <Section title="Homepage Layout Controls" defaultOpen>
        <p className="text-sm text-slate-400 mb-4">
          Drag/move sections to reorder how they appear on the homepage. Locked sections (like Hero) cannot be moved.<br/>
          Navbar links follow the same order as homepage sections. <code>Show in Navbar</code> only affects navigation links, not homepage visibility. Labels here are used for Admin organization and navbar labels where supported.
        </p>
        <div className="space-y-2">
          {form.homepageSections.map((sec, i) => (
            <div key={sec.key} className="flex items-center gap-3 p-3 bg-navy-900 border border-navy-800 rounded-lg">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveHomepageSection(i, 'up')}
                  disabled={sec.isLocked || i === 0 || form.homepageSections[i - 1]?.isLocked}
                  className="text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500"
                >
                  <Ic d={IC.chevUp} size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveHomepageSection(i, 'down')}
                  disabled={sec.isLocked || i === form.homepageSections.length - 1 || form.homepageSections[i + 1]?.isLocked}
                  className="text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500"
                >
                  <Ic d={IC.chevDown} size={14} />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  value={sec.label}
                  onChange={(e) => updateHomepageSectionLabel(i, e.target.value)}
                  placeholder="Section Label"
                />
                <Input
                  value={sec.navLabel || ''}
                  onChange={(e) => updateHomepageSectionNavLabel(i, e.target.value)}
                  placeholder="Navbar Label"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-sm text-slate-400 hover:text-white">
                  <input
                    type="checkbox"
                    checked={sec.showInNav !== false}
                    onChange={(e) => updateHomepageSectionShowInNav(i, e.target.checked)}
                    className="rounded border-navy-700 bg-navy-800 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <span>Show in Nav</span>
                </label>
              </div>
              <div className="w-24 text-xs text-slate-500 uppercase tracking-wider text-right">
                {sec.isLocked ? <span className="text-rose-400">Locked</span> : `Order: ${sec.order}`}
              </div>
            </div>
          ))}
          {form.homepageSections.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-sm border border-dashed border-navy-800 rounded-lg">
              No sections loaded. Run the sync script to populate default sections.
            </div>
          )}
        </div>
      </Section>

      {/* ── Hero ─────────────────────────────────────────── */}
      <Section title="Hero Section" defaultOpen>
        <Input
          label="Badge"
          value={form.hero.badge}
          onChange={(e) => setNested('hero', 'badge', e.target.value)}
          placeholder="OPEN FOR FRONTEND & FULL STACK ROLES"
        />
        <Input
          label="Headline"
          value={form.hero.headline}
          onChange={(e) => setNested('hero', 'headline', e.target.value)}
          placeholder="Building Production-Ready Web Applications"
        />
        <Input
          label="Name"
          value={form.hero.name}
          onChange={(e) => setNested('hero', 'name', e.target.value)}
          placeholder="Nagaraj Jakkappa"
        />
        
        {/* Rotating Roles */}
        <div className="pt-2 border-t border-navy-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Rotating Roles</span>
            <Btn variant="ghost" size="sm" onClick={addRole}>
              <Ic d={IC.plus} size={11} /> Add
            </Btn>
          </div>
          {form.hero.roles.map((r, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <Input
                value={r}
                onChange={(e) => updateRole(i, e.target.value)}
                placeholder="MERN Stack Developer"
                className="flex-1"
              />
              <button onClick={() => removeRole(i)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded">
                <Ic d={IC.trash} size={14} />
              </button>
            </div>
          ))}
        </div>

        <Textarea
          label="Description"
          value={form.hero.description}
          onChange={(e) => setNested('hero', 'description', e.target.value)}
          placeholder="I build and ship full-stack web apps..."
          rows={3}
        />

        {/* Hero Stats */}
        <div className="pt-2 border-t border-navy-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Hero Stats</span>
            <Btn variant="ghost" size="sm" onClick={addStat}>
              <Ic d={IC.plus} size={11} /> Add
            </Btn>
          </div>
          {form.hero.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto_auto] gap-2 mb-2 items-center">
              <Input
                value={s.value}
                onChange={(e) => updateStat(i, 'value', e.target.value)}
                placeholder="6+"
              />
              <Input
                value={s.label}
                onChange={(e) => updateStat(i, 'label', e.target.value)}
                placeholder="LIVE PROJECTS"
              />
              <Input
                type="number"
                value={s.order}
                onChange={(e) => updateStat(i, 'order', parseInt(e.target.value) || 0)}
                placeholder="Order"
                className="w-20"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => updateStat(i, 'isActive', !s.isActive)}
                  className={`p-2 rounded ${s.isActive ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-400 bg-navy-800'}`}
                  title="Toggle Visibility"
                >
                  <Ic d={IC.check} size={14} />
                </button>
                <button onClick={() => removeStat(i)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded">
                  <Ic d={IC.trash} size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
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
        
        {/* Paragraphs */}
        <div className="pt-2 border-t border-navy-800 mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Paragraphs</span>
            <Btn variant="ghost" size="sm" onClick={addParagraph}>
              <Ic d={IC.plus} size={11} /> Add
            </Btn>
          </div>
          {form.about.paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <Textarea
                value={p}
                onChange={(e) => updateParagraph(i, e.target.value)}
                placeholder="Paragraph text..."
                rows={3}
                className="flex-1"
              />
              <button onClick={() => removeParagraph(i)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded mt-1">
                <Ic d={IC.trash} size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Highlight Keywords */}
        <div className="pt-2 border-t border-navy-800 mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Highlight Keywords</span>
            <Btn variant="ghost" size="sm" onClick={addHighlightKeyword}>
              <Ic d={IC.plus} size={11} /> Add
            </Btn>
          </div>
          {form.about.highlightKeywords.map((k, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <Input
                value={k}
                onChange={(e) => updateHighlightKeyword(i, e.target.value)}
                placeholder="Keyword to highlight (e.g. MERN Stack Developer)"
                className="flex-1"
              />
              <button onClick={() => removeHighlightKeyword(i)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded">
                <Ic d={IC.trash} size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
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

        {/* Timeline Highlights */}
        <div className="pt-2 border-t border-navy-800 mt-4">
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
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Status:</span>
            {form.resume.resumeUrl ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                Resume Active
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-xs font-medium">
                No Resume Added
              </span>
            )}
          </div>
        </div>

        <div className="p-4 bg-navy-900/40 rounded-xl border border-navy-700/50 mb-4">
          <p className="text-xs text-slate-400 mb-1 leading-relaxed">
            Paste a Google Drive, Cloudinary, or hosted PDF URL. Public <strong className="text-slate-300">View Resume</strong> and <strong className="text-slate-300">Download Resume</strong> buttons use this same URL.
          </p>
          <p className="text-[11px] text-cyan-400/80 mb-4">
            For Google Drive, make sure the file access is set to "Anyone with the link".
          </p>
          <div className="space-y-4">
            <Input
              label={form.resume.resumeUrl ? "Replace Resume URL" : "Add Resume URL"}
              value={form.resume.resumeUrl}
              onChange={(e) => setNested('resume', 'resumeUrl', e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
            />
            <Input
              label="Last Updated Text"
              value={form.resume.updatedAtText}
              onChange={(e) => setNested('resume', 'updatedAtText', e.target.value)}
              placeholder="Updated June 2026"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!form.resume.resumeUrl}
            onClick={() => window.open(form.resume.resumeUrl, '_blank', 'noopener,noreferrer')}
            className="px-4 py-2 text-xs font-medium text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview Resume
          </button>
          
          <button
            type="button"
            disabled={!form.resume.resumeUrl}
            onClick={() => {
              if (window.confirm('Are you sure you want to remove the resume link?')) {
                setNested('resume', 'resumeUrl', '');
                setNested('resume', 'updatedAtText', '');
              }
            }}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors border ${
              form.resume.resumeUrl
                ? 'text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 border-red-500/20'
                : 'text-slate-500 bg-navy-800 border-navy-700 opacity-50 cursor-not-allowed'
            }`}
          >
            Remove Resume
          </button>

          <button
            type="button"
            disabled={!form.resume.updatedAtText}
            onClick={() => setNested('resume', 'updatedAtText', '')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors border ${
              form.resume.updatedAtText
                ? 'text-slate-400 hover:text-white bg-navy-800 hover:bg-navy-700 border-navy-600'
                : 'text-slate-500 bg-navy-800 border-navy-700 opacity-50 cursor-not-allowed'
            }`}
          >
            Clear Updated Text
          </button>
        </div>
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
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Input
            label="Email"
            value={form.socialLinks.email}
            onChange={(e) => setNested('socialLinks', 'email', e.target.value)}
            placeholder="you@email.com"
          />
          <Input
            label="WhatsApp"
            value={form.socialLinks.whatsapp}
            onChange={(e) => setNested('socialLinks', 'whatsapp', e.target.value)}
            placeholder="https://wa.me/..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Input
            label="Phone"
            value={form.socialLinks.phone}
            onChange={(e) => setNested('socialLinks', 'phone', e.target.value)}
            placeholder="+91 1234567890"
          />
          <Input
            label="Location"
            value={form.socialLinks.location}
            onChange={(e) => setNested('socialLinks', 'location', e.target.value)}
            placeholder="Yadgir, Karnataka, India"
          />
        </div>
      </Section>

      {/* ── Currently Building ────────────────────────────── */}
      <Section title="Currently Building & Impact Layout">
        
        {/* Layout Preview Guide */}
        <div className="mb-6 p-4 bg-navy-900 border border-navy-700 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">Desktop Sketch Preview</h4>
          <div className="text-xs text-slate-400 font-mono bg-navy-950 p-3 rounded border border-navy-800 mb-3 whitespace-pre">
{`Top Area:
[ Building 1 small ] [ Building 2 small ]   [ Impact 1 ] [ Impact 2 ]
[ Building 3 wide across left ]             [ Impact 3 ] [ Impact 4 ]

Bottom Area:
[ Building 4 full width ]
[ Building 5 full width ]`}
          </div>
          <h4 className="text-sm font-semibold text-white mb-2">Mobile Order</h4>
          <div className="text-xs text-slate-400 font-mono bg-navy-950 p-3 rounded border border-navy-800">
            Building 1 → Building 2 → Building 3 → Building 4 → Building 5 → Engineering Impact
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">Currently Building Cards</h3>
        <p className="text-xs text-slate-400 mb-4">
          Sketch layout recommendation: order 1 small, order 2 small, order 3 wide, order 4 full, order 5 full.
        </p>

        {form.currentlyBuilding.map((item, i) => {
          const ord = Number(item.order) || i + 1;
          let label = 'Extra / Full Width fallback';
          if (ord === 1 || ord === 2) label = 'Top Left Small';
          else if (ord === 3) label = 'Top Left Wide';
          else if (ord === 4 || ord === 5) label = 'Bottom Full Width';

          return (
          <div key={i} className="p-4 bg-navy-950 border border-navy-800 rounded-lg space-y-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-mono">Project #{i + 1}</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider border border-blue-500/30 text-blue-400 bg-blue-500/10">
                  Order {ord}: {label}
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) => updateBuildItem(i, 'isActive', e.target.checked)}
                    className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-navy-950"
                  />
                  <span className="text-xs text-slate-300">Visible</span>
                </label>
              </div>
              <button
                onClick={() => removeBuildItem(i)}
                className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Ic d={IC.trash} size={13} />
              </button>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-end">
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
                placeholder="ACTIVE"
              />
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Theme Color</label>
                <select
                  value={item.color}
                  onChange={(e) => updateBuildItem(i, 'color', e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="blue">Blue</option>
                  <option value="cyan">Cyan</option>
                  <option value="emerald">Emerald</option>
                  <option value="amber">Amber</option>
                  <option value="violet">Violet</option>
                  <option value="purple">Purple</option>
                  <option value="rose">Rose</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Layout Size</label>
                <select
                  value={item.size}
                  onChange={(e) => updateBuildItem(i, 'size', e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="small">small — Small Card</option>
                  <option value="wide">wide — Wide Card</option>
                  <option value="full">full — Full Width Card</option>
                  <option value="tall">tall — Tall Card</option>
                  <option value="feature">feature — Feature Card</option>
                </select>
              </div>
              <Input
                label="Order"
                value={item.order}
                type="number"
                onChange={(e) => updateBuildItem(i, 'order', e.target.value)}
                className="w-20"
              />
            </div>
            <Textarea
              label="Description"
              value={item.description}
              onChange={(e) => updateBuildItem(i, 'description', e.target.value)}
              placeholder="Upgrading my project..."
              rows={2}
            />
          </div>
        )})}
        <Btn variant="ghost" onClick={addBuildItem}>
          <Ic d={IC.plus} size={13} /> Add Project
        </Btn>
      </Section>


      {/* ── Engineering Impact Metrics ────────────────────── */}
      <Section title="Engineering Impact Metrics">
        <p className="text-xs text-slate-400 mb-4">
          For the current sketch layout, keep all 4 Engineering Impact metrics as small to render a clean 2x2 grid.
        </p>

        {form.impactMetrics.map((item, i) => {
          const ord = Number(item.order) || i + 1;
          let label = 'Extra Metric';
          if (ord === 1) label = 'Impact Top Left';
          else if (ord === 2) label = 'Impact Top Right';
          else if (ord === 3) label = 'Impact Bottom Left';
          else if (ord === 4) label = 'Impact Bottom Right';

          return (
          <div key={i} className="p-4 bg-navy-950 border border-navy-800 rounded-lg space-y-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-mono">Metric #{i + 1}</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider border border-blue-500/30 text-blue-400 bg-blue-500/10">
                  Order {ord}: {label}
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) => updateImpactMetric(i, 'isActive', e.target.checked)}
                    className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-navy-950"
                  />
                  <span className="text-xs text-slate-300">Visible</span>
                </label>
              </div>
              <button
                onClick={() => removeImpactMetric(i)}
                className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Ic d={IC.trash} size={13} />
              </button>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-end">
              <Input
                label="Value"
                value={item.value}
                onChange={(e) => updateImpactMetric(i, 'value', e.target.value)}
                placeholder="5"
              />
              <Input
                label="Label"
                value={item.label}
                onChange={(e) => updateImpactMetric(i, 'label', e.target.value)}
                placeholder="MERN UPGRADES"
              />
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Theme Color</label>
                <select
                  value={item.color}
                  onChange={(e) => updateImpactMetric(i, 'color', e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="blue">Blue</option>
                  <option value="cyan">Cyan</option>
                  <option value="emerald">Emerald</option>
                  <option value="amber">Amber</option>
                  <option value="violet">Violet</option>
                  <option value="purple">Purple</option>
                  <option value="rose">Rose</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Layout Size</label>
                <select
                  value={item.size}
                  onChange={(e) => updateImpactMetric(i, 'size', e.target.value)}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="small">small — Standard Metric</option>
                  <option value="wide">wide — Wide Metric</option>
                  <option value="large">large — Large Metric</option>
                </select>
              </div>
              <Input
                label="Order"
                value={item.order}
                type="number"
                onChange={(e) => updateImpactMetric(i, 'order', e.target.value)}
                className="w-20"
              />
            </div>
          </div>
        )})}
        <Btn variant="ghost" onClick={addImpactMetric}>
          <Ic d={IC.plus} size={13} /> Add Metric
        </Btn>
      </Section>

      {/* ── Now Section ─────────────────────────────────── */}
      <Section title="Now Section">
        {form.now.map((item, i) => (
          <div key={i} className="p-4 bg-navy-950 border border-navy-800 rounded-lg space-y-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-mono">Now Item #{i + 1}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={item.visible} onChange={(e) => updateNowItem(i, 'visible', e.target.checked)} className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-navy-950" />
                  <span className="text-xs text-slate-300">Visible</span>
                </label>
              </div>
              <button onClick={() => removeNowItem(i)} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Ic d={IC.trash} size={13} />
              </button>
            </div>
            
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 items-end">
              <Input label="Category" value={item.category} onChange={(e) => updateNowItem(i, 'category', e.target.value)} placeholder="Learning" />
              <Input label="Icon" value={item.icon} onChange={(e) => updateNowItem(i, 'icon', e.target.value)} placeholder="🚀" />
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Theme Color</label>
                <select value={item.themeColor} onChange={(e) => updateNowItem(i, 'themeColor', e.target.value)} className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="blue">Blue</option>
                  <option value="cyan">Cyan</option>
                  <option value="emerald">Emerald</option>
                  <option value="rose">Rose</option>
                  <option value="amber">Amber</option>
                  <option value="violet">Violet</option>
                  <option value="slate">Slate</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Size</label>
                <select value={item.size} onChange={(e) => updateNowItem(i, 'size', e.target.value)} className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="small">Small (1 col)</option>
                  <option value="wide">Wide (2 col)</option>
                  <option value="tall">Tall (2 row)</option>
                  <option value="feature">Feature (2x2)</option>
                </select>
              </div>
              <Input label="Order" value={item.order} onChange={(e) => updateNowItem(i, 'order', e.target.value)} type="number" />
            </div>
            <Textarea label="Description" value={item.description} onChange={(e) => updateNowItem(i, 'description', e.target.value)} rows={2} placeholder="Description here..." />
          </div>
        ))}
        <Btn variant="ghost" onClick={addNowItem}>
          <Ic d={IC.plus} size={13} /> Add Now Item
        </Btn>
      </Section>

      {/* ── Tech Pulse ──────────────────────────────────── */}
      <Section title="Tech Pulse">
        {form.techPulse.map((item, i) => (
          <div key={i} className="p-4 bg-navy-950 border border-navy-800 rounded-lg space-y-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-mono">Tech Pulse #{i + 1}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={item.visible} onChange={(e) => updateTechPulseItem(i, 'visible', e.target.checked)} className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-navy-950" />
                  <span className="text-xs text-slate-300">Visible</span>
                </label>
              </div>
              <button onClick={() => removeTechPulseItem(i)} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Ic d={IC.trash} size={13} />
              </button>
            </div>
            
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-end">
              <Input label="Title" value={item.title} onChange={(e) => updateTechPulseItem(i, 'title', e.target.value)} placeholder="GitHub Activity" />
              <Input label="Tag / Label" value={item.tag} onChange={(e) => updateTechPulseItem(i, 'tag', e.target.value)} placeholder="Development" />
              <Input label="Icon" value={item.icon} onChange={(e) => updateTechPulseItem(i, 'icon', e.target.value)} placeholder="⚡" />
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end mt-2">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Theme Color</label>
                <select value={item.themeColor} onChange={(e) => updateTechPulseItem(i, 'themeColor', e.target.value)} className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="blue">Blue</option>
                  <option value="cyan">Cyan</option>
                  <option value="emerald">Emerald</option>
                  <option value="rose">Rose</option>
                  <option value="amber">Amber</option>
                  <option value="violet">Violet</option>
                  <option value="slate">Slate</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Size</label>
                <select value={item.size} onChange={(e) => updateTechPulseItem(i, 'size', e.target.value)} className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="small">Small (1 col)</option>
                  <option value="wide">Wide (2 col)</option>
                  <option value="tall">Tall (2 row)</option>
                  <option value="feature">Feature (2x2)</option>
                </select>
              </div>
              <Input label="Order" value={item.order} onChange={(e) => updateTechPulseItem(i, 'order', e.target.value)} type="number" />
            </div>
            <Textarea label="Description" value={item.description} onChange={(e) => updateTechPulseItem(i, 'description', e.target.value)} rows={2} placeholder="Description here..." />
          </div>
        ))}
        <Btn variant="ghost" onClick={addTechPulseItem}>
          <Ic d={IC.plus} size={13} /> Add Tech Pulse Item
        </Btn>
      </Section>

      {/* ── Engineering Highlights ─────────────────────── */}
      <Section title="Engineering Highlights">
        {form.engineeringHighlights.map((item, i) => (
          <div key={i} className="p-4 bg-navy-950 border border-navy-800 rounded-lg space-y-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-mono">Highlight #{i + 1}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={item.visible} onChange={(e) => updateEngineeringItem(i, 'visible', e.target.checked)} className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-navy-950" />
                  <span className="text-xs text-slate-300">Visible</span>
                </label>
              </div>
              <button onClick={() => removeEngineeringItem(i)} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Ic d={IC.trash} size={13} />
              </button>
            </div>
            
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-end">
              <Input label="Title" value={item.title} onChange={(e) => updateEngineeringItem(i, 'title', e.target.value)} placeholder="Admin-Driven Portfolio" />
              <Input label="Tag / Label" value={item.tag} onChange={(e) => updateEngineeringItem(i, 'tag', e.target.value)} placeholder="CMS" />
              <Input label="Icon" value={item.icon} onChange={(e) => updateEngineeringItem(i, 'icon', e.target.value)} placeholder="🛠️" />
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end mt-2">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Theme Color</label>
                <select value={item.themeColor} onChange={(e) => updateEngineeringItem(i, 'themeColor', e.target.value)} className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="blue">Blue</option>
                  <option value="cyan">Cyan</option>
                  <option value="emerald">Emerald</option>
                  <option value="rose">Rose</option>
                  <option value="amber">Amber</option>
                  <option value="violet">Violet</option>
                  <option value="slate">Slate</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Size</label>
                <select value={item.size} onChange={(e) => updateEngineeringItem(i, 'size', e.target.value)} className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="small">Small (1 col)</option>
                  <option value="wide">Wide (2 col)</option>
                  <option value="tall">Tall (2 row)</option>
                  <option value="feature">Feature (2x2)</option>
                </select>
              </div>
              <Input label="Order" value={item.order} onChange={(e) => updateEngineeringItem(i, 'order', e.target.value)} type="number" />
            </div>
            <Textarea label="Description" value={item.description} onChange={(e) => updateEngineeringItem(i, 'description', e.target.value)} rows={2} placeholder="Description here..." />
          </div>
        ))}
        <Btn variant="ghost" onClick={addEngineeringItem}>
          <Ic d={IC.plus} size={13} /> Add Highlight
        </Btn>
      </Section>

      {/* ── SEO ─────────────────────────────────────────── */}
      <Section title="SEO Settings">
        <Input label="Meta Title" value={form.seo.title} onChange={(e) => setNested('seo', 'title', e.target.value)} placeholder="Nagaraj Jakkappa — Frontend Developer" />
        <Textarea label="Meta Description" value={form.seo.description} onChange={(e) => setNested('seo', 'description', e.target.value)} rows={2} />
        <Textarea label="Keywords" value={form.seo.keywords} onChange={(e) => setNested('seo', 'keywords', e.target.value)} rows={2} />
        <Input label="OG Image URL" value={form.seo.ogImage} onChange={(e) => setNested('seo', 'ogImage', e.target.value)} />
        <Input label="Twitter Image URL" value={form.seo.twitterImage} onChange={(e) => setNested('seo', 'twitterImage', e.target.value)} />
      </Section>

      {/* ── Impact Metrics ──────────────────────────────── */}
      <Section title="Impact Metrics">
        {form.impactMetrics.map((item, i) => (
          <div key={i} className="p-4 bg-navy-950 border border-navy-800 rounded-lg space-y-3 mb-3">
            <div className="flex items-start justify-between">
              <span className="text-xs text-slate-500 font-mono">Metric #{i + 1}</span>
              <button onClick={() => removeImpactMetric(i)} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Ic d={IC.trash} size={13} />
              </button>
            </div>
            <div className="grid grid-cols-[1fr_2fr] gap-3">
              <Input label="Value (e.g. 3+)" value={item.value} onChange={(e) => updateImpactMetric(i, 'value', e.target.value)} />
              <Input label="Label (e.g. Production Apps)" value={item.label} onChange={(e) => updateImpactMetric(i, 'label', e.target.value)} />
            </div>
            <Input label="Description" value={item.description} onChange={(e) => updateImpactMetric(i, 'description', e.target.value)} />
          </div>
        ))}
        <Btn variant="ghost" onClick={addImpactMetric}>
          <Ic d={IC.plus} size={13} /> Add Metric
        </Btn>
      </Section>

      {/* ── Footer ──────────────────────────────────────── */}
      <Section title="Footer Content">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Brand Name" value={form.footer.brandName} onChange={(e) => setNested('footer', 'brandName', e.target.value)} placeholder="Techartistry" />
          <Input label="Tagline" value={form.footer.tagline} onChange={(e) => setNested('footer', 'tagline', e.target.value)} placeholder="Handcrafted by Nagaraj Jakkappa" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Copyright Text" value={form.footer.copyrightText} onChange={(e) => setNested('footer', 'copyrightText', e.target.value)} placeholder="Techartistry.in" />
          <Input label="Built With Text" value={form.footer.builtWithText} onChange={(e) => setNested('footer', 'builtWithText', e.target.value)} placeholder="React + Node.js + MongoDB" />
        </div>
      </Section>

      {/* ── Navbar Links ────────────────────────────────── */}
      <Section title="Navbar Links">
        {form.navbar.map((item, i) => (
          <div key={i} className="p-4 bg-navy-950 border border-navy-800 rounded-lg space-y-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-mono">Link #{i + 1}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={item.visible} onChange={(e) => updateNavbarLink(i, 'visible', e.target.checked)} className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-navy-950" />
                  <span className="text-xs text-slate-300">Visible</span>
                </label>
              </div>
              <button onClick={() => removeNavbarLink(i)} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Ic d={IC.trash} size={13} />
              </button>
            </div>
            
            <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
              <Input label="Label" value={item.label} onChange={(e) => updateNavbarLink(i, 'label', e.target.value)} placeholder="About" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Type</label>
                <select value={item.type} onChange={(e) => { updateNavbarLink(i, 'type', e.target.value); updateNavbarLink(i, 'href', ''); }} className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="section">Internal Section</option>
                  <option value="external">External URL</option>
                </select>
              </div>
              <Input label="Order" value={item.order} onChange={(e) => updateNavbarLink(i, 'order', e.target.value)} type="number" />
            </div>

            {item.type === 'section' ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Section ID</label>
                <select value={item.href} onChange={(e) => updateNavbarLink(i, 'href', e.target.value)} className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="">Select a section...</option>
                  <option value="#home">#home</option>
                  <option value="#about">#about</option>
                  <option value="#skills">#skills</option>
                  <option value="#projects">#projects</option>
                  <option value="#certificates">#certificates</option>
                  <option value="#contact">#contact</option>
                </select>
              </div>
            ) : (
              <Input label="External URL" value={item.href} onChange={(e) => updateNavbarLink(i, 'href', e.target.value)} placeholder="https://..." />
            )}
          </div>
        ))}
        <Btn variant="ghost" onClick={addNavbarLink}>
          <Ic d={IC.plus} size={13} /> Add Link
        </Btn>
      </Section>

      {/* ── Brand Identity ─────────────────────────────── */}
      <Section title="Brand Identity">
        <Input
          label="Wordmark URL"
          value={form.brandIdentity.wordmarkUrl}
          onChange={(e) => setNested('brandIdentity', 'wordmarkUrl', e.target.value)}
          placeholder="https://res.cloudinary.com/…/techartistry-wordmark.png"
          hint="Full text logo image (e.g. TechArtistry.in wordmark)"
        />
        <Input
          label="Logomark URL"
          value={form.brandIdentity.logomarkUrl}
          onChange={(e) => setNested('brandIdentity', 'logomarkUrl', e.target.value)}
          placeholder="https://res.cloudinary.com/…/techartistry-logomark.png"
          hint="Icon-only logo (hexagon TA mark used as app icon)"
        />
        <Input
          label="Favicon / Browser Icon URL"
          value={form.brandIdentity.faviconUrl}
          onChange={(e) => setNested('brandIdentity', 'faviconUrl', e.target.value)}
          placeholder="https://res.cloudinary.com/…/favicon.png"
          hint="Square PNG used in browser tabs (placed in /public as favicon.png)"
        />

        {/* Brand Preview */}
        {(form.brandIdentity.wordmarkUrl || form.brandIdentity.logomarkUrl || form.brandIdentity.faviconUrl) && (
          <div className="pt-4 border-t border-navy-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Brand Preview</span>
            <div className="grid grid-cols-3 gap-4">
              {form.brandIdentity.wordmarkUrl && (
                <div className="flex flex-col items-center gap-2 p-4 bg-navy-950 border border-navy-800 rounded-xl">
                  <img
                    src={form.brandIdentity.wordmarkUrl}
                    alt="Wordmark preview"
                    className="max-h-12 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-[10px] text-slate-600 font-mono uppercase">Wordmark</span>
                </div>
              )}
              {form.brandIdentity.logomarkUrl && (
                <div className="flex flex-col items-center gap-2 p-4 bg-navy-950 border border-navy-800 rounded-xl">
                  <img
                    src={form.brandIdentity.logomarkUrl}
                    alt="Logomark preview"
                    className="w-12 h-12 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-[10px] text-slate-600 font-mono uppercase">Logomark</span>
                </div>
              )}
              {form.brandIdentity.faviconUrl && (
                <div className="flex flex-col items-center gap-2 p-4 bg-navy-950 border border-navy-800 rounded-xl">
                  <img
                    src={form.brandIdentity.faviconUrl}
                    alt="Favicon preview"
                    className="w-8 h-8 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-[10px] text-slate-600 font-mono uppercase">Favicon</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* ── Media Assets ─────────────────────────────── */}
      <Section title="Media Assets">
        <div className="space-y-6">
          {/* Hero Illustration */}
          <div className="p-4 bg-navy-950 border border-navy-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Hero Illustration</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.mediaAssets.heroIllustration.isActive}
                  onChange={(e) => setNested('mediaAssets', 'heroIllustration', { ...form.mediaAssets.heroIllustration, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-navy-600 bg-navy-900 text-blue-500 focus:ring-blue-500/50"
                />
                <span className="text-xs text-slate-400">Active</span>
              </label>
            </div>
            <Input
              label="Image URL"
              value={form.mediaAssets.heroIllustration.url}
              onChange={(e) => setNested('mediaAssets', 'heroIllustration', { ...form.mediaAssets.heroIllustration, url: e.target.value })}
              placeholder="https://res.cloudinary.com/..."
              hint="Overrides the local developer-workspace.webp if set and active."
            />
            <Input
              label="Alt Text"
              value={form.mediaAssets.heroIllustration.alt}
              onChange={(e) => setNested('mediaAssets', 'heroIllustration', { ...form.mediaAssets.heroIllustration, alt: e.target.value })}
              placeholder="Hero illustration showing developer workspace"
            />
          </div>

          {/* Tech Stack Illustration */}
          <div className="p-4 bg-navy-950 border border-navy-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Tech Stack Illustration</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.mediaAssets.techStackIllustration.isActive}
                  onChange={(e) => setNested('mediaAssets', 'techStackIllustration', { ...form.mediaAssets.techStackIllustration, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-navy-600 bg-navy-900 text-blue-500 focus:ring-blue-500/50"
                />
                <span className="text-xs text-slate-400">Active</span>
              </label>
            </div>
            <Input
              label="Image URL"
              value={form.mediaAssets.techStackIllustration.url}
              onChange={(e) => setNested('mediaAssets', 'techStackIllustration', { ...form.mediaAssets.techStackIllustration, url: e.target.value })}
              placeholder="https://res.cloudinary.com/..."
              hint="Overrides the local tech-stack-illustration.webp if set and active."
            />
            <Input
              label="Alt Text"
              value={form.mediaAssets.techStackIllustration.alt}
              onChange={(e) => setNested('mediaAssets', 'techStackIllustration', { ...form.mediaAssets.techStackIllustration, alt: e.target.value })}
              placeholder="Abstract representation of technology stack"
            />
          </div>

          {/* Engineering Workflow GIF */}
          <div className="p-4 bg-navy-950 border border-navy-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Engineering Workflow GIF</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.mediaAssets.engineeringWorkflow.isActive}
                  onChange={(e) => setNested('mediaAssets', 'engineeringWorkflow', { ...form.mediaAssets.engineeringWorkflow, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-navy-600 bg-navy-900 text-blue-500 focus:ring-blue-500/50"
                />
                <span className="text-xs text-slate-400">Active</span>
              </label>
            </div>
            <Input
              label="Image URL"
              value={form.mediaAssets.engineeringWorkflow.url}
              onChange={(e) => setNested('mediaAssets', 'engineeringWorkflow', { ...form.mediaAssets.engineeringWorkflow, url: e.target.value })}
              placeholder="https://res.cloudinary.com/..."
              hint="Overrides the local engineering-workflow.gif if set and active."
            />
            <Input
              label="Alt Text"
              value={form.mediaAssets.engineeringWorkflow.alt}
              onChange={(e) => setNested('mediaAssets', 'engineeringWorkflow', { ...form.mediaAssets.engineeringWorkflow, alt: e.target.value })}
              placeholder="Animated workflow showing engineering process"
            />
          </div>
        </div>
      </Section>

      {/* ── UI Effects ─────────────────────────────── */}
      <Section title="UI Effects">
        <div className="space-y-6">
          <div className="p-4 bg-navy-950 border border-navy-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Custom Mouse Cursor</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.uiEffects.customCursor.isActive}
                  onChange={(e) => setNested('uiEffects', 'customCursor', { ...form.uiEffects.customCursor, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-navy-600 bg-navy-900 text-blue-500 focus:ring-blue-500/50"
                />
                <span className="text-xs text-slate-400">Enable on Desktop</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cursor Accent Color"
                value={form.uiEffects.customCursor.color}
                onChange={(e) => setNested('uiEffects', 'customCursor', { ...form.uiEffects.customCursor, color: e.target.value })}
                placeholder="#22d3ee"
                hint="Hex color for the cursor ring"
              />
              <Input
                label="Accessibility Label"
                value={form.uiEffects.customCursor.label}
                onChange={(e) => setNested('uiEffects', 'customCursor', { ...form.uiEffects.customCursor, label: e.target.value })}
                placeholder="Premium Cursor"
              />
            </div>
          </div>
        </div>
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
