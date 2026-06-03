import { useEffect, useState } from 'react';

const emptyAboutPage = {
  hero_title: 'About Wealthora',
  hero_subtitle: 'Trusted partner for 5000+ entrepreneurs. Simplifying business setup since 2018.',
  hero_tag: 'Our Story',
  mission_title: 'Empowering Indian Entrepreneurs',
  mission_body: 'Making company registration and compliance hassle-free. From Pvt Ltd to GST, we handle every milestone with precision.',
  benefits: [
    { title: '100% Compliance Guarantee', body: 'Government filings with zero errors.', icon: 'shield' },
    { title: '5+ Years Experience', body: 'Successfully served 5000+ businesses.', icon: 'award' }
  ],
  stats: [
    { value: '5000+', label: 'Happy Clients', color: 'orange' },
    { value: '5+', label: 'Years Experience', color: 'emerald' },
    { value: '98%', label: 'Success Rate', color: 'purple' },
    { value: '24/7', label: 'Support', color: 'sky' }
  ],
  team_title: 'Leadership That Delivers',
  team_tag: 'Meet The Team',
  team_members: [
    { initials: 'AK', name: 'Amit Kumar', role: 'Founder & CEO', bio: '20+ years in corporate law and business consulting. Passionate about simplifying compliance for startups.', color: 'orange' },
    { initials: 'RS', name: 'Riya Sharma', role: 'Head of Operations', bio: 'Expert in GST compliance and MCA filings. Ensures every client gets timely delivery.', color: 'emerald' },
    { initials: 'VK', name: 'Vikram Singh', role: 'Technical Lead', bio: 'Manages our automation systems and client portal. Making business setup digital-first.', color: 'sky' }
  ],
  cta_title: 'Ready to Start Your Business Journey?',
  cta_subtitle: "Join 5000+ entrepreneurs who've trusted Wealthora for their business milestones.",
  cta_button: 'Explore Our Services →',
  cta_url: '/services'
};

export default function AboutContentForm({ section, onChange, onSave }) {
  const [form, setForm] = useState(emptyAboutPage);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    if (section) {
      setForm({
        ...emptyAboutPage,
        ...section,
        benefits: section.benefits || emptyAboutPage.benefits,
        stats: section.stats || emptyAboutPage.stats,
        team_members: section.team_members || emptyAboutPage.team_members
      });
    }
  }, [section]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const updateArrayField = (field, index, key, value) => {
    const arr = [...form[field]];
    arr[index][key] = value;
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field) => {
    const arr = [...form[field], { ...emptyAboutPage[field][0] }];
    setForm({ ...form, [field]: arr });
  };

  const removeArrayItem = (field, index) => {
    const arr = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: arr });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Hero Section */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h4 className="text-lg font-bold text-slate-900">Hero Banner</h4>
        <input value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} placeholder="Hero Title" className="rounded-xl border px-4 py-3" />
        <textarea value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} rows="2" placeholder="Hero Subtitle" className="rounded-xl border px-4 py-3" />
        <input value={form.hero_tag} onChange={(e) => setForm({ ...form, hero_tag: e.target.value })} placeholder="Hero Tag (Our Story)" className="rounded-xl border px-4 py-3" />
      </div>

      {/* Mission Section */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h4 className="text-lg font-bold text-slate-900">Mission & Vision</h4>
        <input value={form.mission_title} onChange={(e) => setForm({ ...form, mission_title: e.target.value })} placeholder="Mission Title" className="rounded-xl border px-4 py-3" />
        <textarea value={form.mission_body} onChange={(e) => setForm({ ...form, mission_body: e.target.value })} rows="4" placeholder="Mission Body" className="rounded-xl border px-4 py-3" />
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-slate-900">Benefits ({form.benefits.length})</h4>
          <button type="button" onClick={() => addArrayItem('benefits')} className="text-sm font-semibold text-sky-700">+ Add</button>
        </div>
        {form.benefits.map((benefit, i) => (
          <div key={i} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
            <input value={benefit.icon} onChange={(e) => updateArrayField('benefits', i, 'icon', e.target.value)} placeholder="Icon" className="rounded-xl border px-3 py-2" />
            <input value={benefit.title} onChange={(e) => updateArrayField('benefits', i, 'title', e.target.value)} placeholder="Title" className="rounded-xl border px-3 py-2" />
            <input value={benefit.body} onChange={(e) => updateArrayField('benefits', i, 'body', e.target.value)} placeholder="Body" className="rounded-xl border px-3 py-2" />
            <button type="button" onClick={() => removeArrayItem('benefits', i)} className="text-rose-500 md:col-span-3">Remove</button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-slate-900">Stats ({form.stats.length})</h4>
          <button type="button" onClick={() => addArrayItem('stats')} className="text-sm font-semibold text-sky-700">+ Add</button>
        </div>
        {form.stats.map((stat, i) => (
          <div key={i} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
            <input value={stat.value} onChange={(e) => updateArrayField('stats', i, 'value', e.target.value)} placeholder="Value" className="rounded-xl border px-3 py-2" />
            <input value={stat.label} onChange={(e) => updateArrayField('stats', i, 'label', e.target.value)} placeholder="Label" className="rounded-xl border px-3 py-2" />
            <input value={stat.color} onChange={(e) => updateArrayField('stats', i, 'color', e.target.value)} placeholder="Color (orange)" className="rounded-xl border px-3 py-2" />
            <button type="button" onClick={() => removeArrayItem('stats', i)} className="text-rose-500 md:col-span-3">Remove</button>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-slate-900">Team Members ({form.team_members.length})</h4>
          <button type="button" onClick={() => addArrayItem('team_members')} className="text-sm font-semibold text-sky-700">+ Add</button>
        </div>
        {form.team_members.map((member, i) => (
          <div key={i} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
            <input value={member.initials} onChange={(e) => updateArrayField('team_members', i, 'initials', e.target.value)} placeholder="Initials" className="rounded-xl border px-3 py-2" />
            <input value={member.name} onChange={(e) => updateArrayField('team_members', i, 'name', e.target.value)} placeholder="Name" className="rounded-xl border px-3 py-2" />
            <input value={member.role} onChange={(e) => updateArrayField('team_members', i, 'role', e.target.value)} placeholder="Role" className="rounded-xl border px-3 py-2" />
            <input value={member.color} onChange={(e) => updateArrayField('team_members', i, 'color', e.target.value)} placeholder="Color (orange)" className="rounded-xl border px-3 py-2" />
            <textarea value={member.bio} onChange={(e) => updateArrayField('team_members', i, 'bio', e.target.value)} rows="2" placeholder="Bio" className="rounded-xl border px-3 py-2 md:col-span-2" />
            <button type="button" onClick={() => removeArrayItem('team_members', i)} className="text-rose-500">Remove</button>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h4 className="text-lg font-bold text-slate-900">CTA Section</h4>
        <input value={form.cta_title} onChange={(e) => setForm({ ...form, cta_title: e.target.value })} placeholder="CTA Title" className="rounded-xl border px-4 py-3" />
        <textarea value={form.cta_subtitle} onChange={(e) => setForm({ ...form, cta_subtitle: e.target.value })} rows="2" placeholder="CTA Subtitle" className="rounded-xl border px-4 py-3" />
        <input value={form.cta_button} onChange={(e) => setForm({ ...form, cta_button: e.target.value })} placeholder="Button Text" className="rounded-xl border px-4 py-3" />
        <input value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} placeholder="Button URL" className="rounded-xl border px-4 py-3" />
      </div>

      <button type="submit" className="w-full rounded-xl bg-sky-700 px-6 py-3 text-lg font-semibold text-white hover:bg-sky-800">
        Save About Page Content
      </button>
    </form>
  );
}

