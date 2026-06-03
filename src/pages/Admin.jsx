import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, Trash2, LogOut, X, LayoutDashboard, Briefcase, FileText, MessageSquare, HelpCircle, Image, Settings, Users, Star, Menu } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { assetUrl } from '../lib/assetUrl';
import { normalizeSectionData } from '../lib/contentSections';
import RichTextEditor from '../components/RichTextEditor';
import AboutContentForm from './AboutContentForm.jsx';

const tabs = [
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'blogs', label: 'Blogs', icon: FileText },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'hero', label: 'Hero Slides', icon: Image },
  { id: 'content', label: 'Content & Settings', icon: Settings },
  { id: 'founders', label: 'Founders', icon: Users }
];

function SectionHeader({ title, onAdd, addLabel, right }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <div className="flex items-center gap-3">
        {right}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
          >
            <Plus size={16} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function Modal({ title, children, onClose, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
      <div className={`flex w-full flex-col ${wide ? 'max-w-3xl' : 'max-w-2xl'} max-h-[90vh] rounded-2xl bg-white shadow-2xl`}>
        {/* sticky header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>
        {/* scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

const emptyAbout = {
  title: '',
  subtitle: '',
  body: '',
  cta_text: '',
  cta_url: '/about'
};

const emptyFooterContact = {
  phone: '',
  email: '',
  address: '',
  map_embed_url: ''
};

export default function Admin() {
  const { state, api, exportEnquiriesCSV } = useAdmin();
  const { logout, state: authState } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [editingType, setEditingType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [filePreviews, setFilePreviews] = useState({});
  const [fileInputKeys, setFileInputKeys] = useState({});
  const [removeExistingImages, setRemoveExistingImages] = useState({});
  const [aboutForm, setAboutForm] = useState(() => {
    const section = state.contentSections.find((item) => item.section_key === 'home_about');
    return section || emptyAbout;
  });
  const [footerContactForm, setFooterContactForm] = useState(emptyFooterContact);
  const [websiteSettingsForm, setWebsiteSettingsForm] = useState({ phone: '', whatsapp: '', email: '', address: '' });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General', sort_order: 1, active: true });
  const [editingFaqId, setEditingFaqId] = useState(null);

  const [aboutPageSection, setAboutPageSection] = useState(null);

  const emptyServiceForm = {
    title: '', category: '', description: '', price: '', icon: '', featured: false,
    slug: '', long_description: '', hero_tagline: '',
    benefits: [], process_steps: [], documents: [], faqs: [], pricing_plans: [],
    cta_text: '', cta_phone: ''
  };
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [blogContent, setBlogContent] = useState('');

  // Safely coerce JSONB fields to arrays
  const toArray = (val) => {
    if (Array.isArray(val)) return val;
    if (val === null || val === undefined) return [];
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Safely coerce any JSONB value (null / parsed array / JSON string) to an array
  function toArr(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; }
    }
    return [];
  }

  useEffect(() => {
    if (editingType === 'services') {
      if (editingItem) {
        setServiceForm({
          title: editingItem.title || '',
          category: editingItem.category || '',
          description: editingItem.description || '',
          price: editingItem.price || '',
          icon: editingItem.icon || '',
          featured: Boolean(editingItem.featured),
          slug: editingItem.slug || '',
          long_description: editingItem.long_description || '',
          hero_tagline: editingItem.hero_tagline || '',
          benefits: toArr(editingItem.benefits),
          process_steps: toArr(editingItem.process_steps),
          documents: toArr(editingItem.documents),
          faqs: toArr(editingItem.faqs),
          pricing_plans: toArr(editingItem.pricing_plans),
          cta_text: editingItem.cta_text || '',
          cta_phone: editingItem.cta_phone || ''
        });
      } else {
        setServiceForm(emptyServiceForm);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingType, editingItem]);

  useEffect(() => {
    const section = state.contentSections.find((item) => item.section_key === 'home_about');
    if (section) {
      setAboutForm({
        title: section.title || '',
        subtitle: section.subtitle || '',
        body: section.body || '',
        cta_text: section.cta_text || '',
        cta_url: section.cta_url || '/about'
      });
    }
  }, [state.contentSections]);

  useEffect(() => {
    const section = state.contentSections.find((item) => item.section_key === 'footer_contact');
    const data = normalizeSectionData(section?.data);
    setFooterContactForm({
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      map_embed_url: data.map_embed_url || ''
    });
  }, [state.contentSections]);

  useEffect(() => {
    const section = state.contentSections.find(item => item.section_key === 'website_settings');
    const data = (section?.data) || {};
    setWebsiteSettingsForm({
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      email: data.email || '',
      address: data.address || ''
    });
  }, [state.contentSections]);

  useEffect(() => {
    const section = state.contentSections.find((item) => item.section_key === 'about_page');
    setAboutPageSection(section || null);
  }, [state.contentSections]);

  const summary = useMemo(() => {
    const today = new Date().toDateString();
    const todayEnquiries = state.enquiries.filter(e => new Date(e.created_at).toDateString() === today).length;
    const newEnquiries = state.enquiries.filter(e => e.status === 'new').length;
    const convertedEnquiries = state.enquiries.filter(e => e.status === 'converted').length;
    return [
      { label: 'Services', value: state.services.length },
      { label: 'Total Enquiries', value: state.enquiries.length },
      { label: "Today's Leads", value: todayEnquiries, highlight: todayEnquiries > 0 },
      { label: 'New Unread', value: newEnquiries, highlight: newEnquiries > 0 },
      { label: 'Converted', value: convertedEnquiries },
      { label: 'Published Blogs', value: state.blogs.filter(b => b.published !== false).length }
    ];
  }, [state]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const openCreate = (type) => {
    setEditingType(type);
    setEditingItem(null);
    setFilePreviews({});
    setFileInputKeys({});
    setRemoveExistingImages({});
    if (type === 'blogs') setBlogContent('');
  };

  const openEdit = (type, item) => {
    setEditingType(type);
    setEditingItem(item);
    setFilePreviews({});
    setFileInputKeys({});
    setRemoveExistingImages({});
    if (type === 'blogs') setBlogContent(item?.blog_content || '');
  };

  const closeModal = () => {
    setEditingType('');
    setEditingItem(null);
    Object.values(filePreviews).forEach((url) => {
      if (typeof url === 'string') URL.revokeObjectURL(url);
    });
    setFilePreviews({});
    setFileInputKeys({});
    setRemoveExistingImages({});
    setBlogContent('');
  };

  const setSelectedFile = (name, file) => {
    setRemoveExistingImages((prev) => ({ ...prev, [name]: false }));
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFilePreviews((prev) => {
      const existing = prev[name];
      if (existing) URL.revokeObjectURL(existing);
      return { ...prev, [name]: url };
    });
  };

  const clearSelectedFile = (name) => {
    setFileInputKeys((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
    setFilePreviews((prev) => {
      const existing = prev[name];
      if (existing) URL.revokeObjectURL(existing);
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const removeExistingImage = (name) => {
    clearSelectedFile(name);
    setRemoveExistingImages((prev) => ({ ...prev, [name]: true }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const payload = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && !value.name) continue;
      payload[key] = value;
    }

    const removalPayload = {};
    if (removeExistingImages.image) removalPayload.remove_image = true;
    if (removeExistingImages.avatar_image) removalPayload.remove_avatar_image = true;
    if (removeExistingImages.banner_image) removalPayload.remove_banner_image = true;
    
    if (editingType === 'services') {
      const servicePayload = { ...serviceForm };
      if (editingItem) await api.updateService(editingItem.id, servicePayload);
      else await api.addService(servicePayload);
    } else if (editingType === 'blogs') {
      const blogPayload = {
        ...payload,
        ...removalPayload,
        blog_content: blogContent,
        published: Boolean(formData.get('published'))
      };
      if (editingItem) await api.updateBlog(editingItem.id, blogPayload);
      else await api.addBlog(blogPayload);
    } else {
      const action = editingItem ? 'update' : 'add';
      const typeMethod = editingType.charAt(0).toUpperCase() + editingType.slice(1);
      const method = api[action + typeMethod];

      if (!method) {
        console.error('No API method for', action + typeMethod);
      } else if (editingItem) {
        await method(editingItem.id, { ...payload, ...removalPayload });
      } else {
        await method({ ...payload, ...removalPayload });
      }
    }
    closeModal();
    await api.refreshAll();
  };

  const handleSaveAbout = async (event) => {
    event.preventDefault();
    await api.updateContentSection('home_about', aboutForm);
  };

  const handleSaveFooterContact = async (event) => {
    event.preventDefault();
    await api.updateContentSection('footer_contact', {
      title: 'Footer contact',
      data: footerContactForm
    });
    await api.refreshAll();
  };

  const handleSaveWebsiteSettings = async (event) => {
    event.preventDefault();
    await api.updateContentSection('website_settings', {
      title: 'Website Settings',
      data: websiteSettingsForm
    });
    await api.refreshAll();
  };

  const handleSaveFaq = async (event) => {
    event.preventDefault();
    if (editingFaqId) {
      await api.updateFaq(editingFaqId, faqForm);
    } else {
      await api.addFaq(faqForm);
    }
    setFaqForm({ question: '', answer: '', category: 'General', sort_order: 1, active: true });
    setEditingFaqId(null);
  };

  return (
    <>
      <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="flex w-72 flex-col bg-slate-900 text-slate-300">
        <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950">
          <h1 className="text-xl font-black text-white">Wealthora Admin</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="flex flex-col gap-1 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-slate-400'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-slate-800 p-4">
          <div className="mb-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Account
          </div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                {(authState.user?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-white">{authState.user?.name || 'Admin'}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-500 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header / Dashboard Stats */}
        <header className="shrink-0 border-b border-slate-200 bg-white p-6 shadow-sm z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="text-sm text-slate-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {summary.map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 transition-all ${item.highlight ? 'border-sky-300 bg-sky-50 shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className={`mt-1 text-2xl font-black ${item.highlight ? 'text-sky-700' : 'text-slate-900'}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </header>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <section className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
          {activeTab === 'services' && (
            <>
              <SectionHeader title="Services" onAdd={() => openCreate('services')} addLabel="Add service" />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {state.services.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-2xl">{item.icon || '*'}</p>
                    <h3 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.category}</p>
                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">{item.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-700">{item.price || 'Contact'}</span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit('services', item)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                        <button type="button" onClick={() => api.deleteService(item.id)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-700"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === 'blogs' && (
            <>
              <SectionHeader title="Blogs" onAdd={() => openCreate('blogs')} addLabel="Add blog" />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {state.blogs.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.published !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {item.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.category} - {item.blog_author}</p>
                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">{item.blog_content}</p>
                    <div className="mt-4 flex gap-2">
                      <button type="button" onClick={() => setViewingBlog(item)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">View</button>
                      <button type="button" onClick={() => openEdit('blogs', item)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                      <button
                        type="button"
                        onClick={() => api.updateBlog(item.id, { ...item, published: item.published === false })}
                        className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                      >
                        {item.published !== false ? 'Unpublish' : 'Publish'}
                      </button>
                      <button type="button" onClick={() => api.deleteBlog(item.id)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-700"><Trash2 size={14} /></button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === 'testimonials' && (
            <>
              <SectionHeader title="Testimonials" onAdd={() => openCreate('testimonials')} addLabel="Add testimonial" />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {state.testimonials.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.role}</p>
                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">{item.text}</p>
                    <p className="mt-3 text-xs text-amber-700">Rating: {item.rating}/5</p>
                    <div className="mt-4 flex gap-2">
                      <button type="button" onClick={() => openEdit('testimonials', item)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                      <button type="button" onClick={() => api.deleteTestimonial(item.id)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-700"><Trash2 size={14} /></button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === 'enquiries' && (
            <>
              <SectionHeader
                title="Enquiries"
                right={
                  <button type="button" onClick={exportEnquiriesCSV} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                    <Download size={16} />
                    Export CSV
                  </button>
                }
              />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {state.enquiries.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.email || 'No email'} - {item.phone}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.service}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.message}</p>
                    {(item.city || item.business_type) && (
                      <p className="mt-1 text-xs text-slate-400">{[item.city, item.business_type].filter(Boolean).join(' · ')}</p>
                    )}
                    {item.notes && (
                      <div className="mt-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-800">
                        <span className="font-semibold">Notes:</span> {item.notes}
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      <select value={item.status || 'new'} onChange={(event) => api.updateEnquiry(item.id, { status: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs">
                        <option value="new">🔵 New</option>
                        <option value="contacted">📞 Contacted</option>
                        <option value="follow-up">🔄 Follow-up</option>
                        <option value="converted">✅ Converted</option>
                        <option value="lost">❌ Lost</option>
                        <option value="closed">🔒 Closed</option>
                      </select>
                      <button type="button" onClick={() => api.deleteEnquiry(item.id)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-700"><Trash2 size={14} /></button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === 'faqs' && (
            <>
              <SectionHeader title="FAQs" />
              <div className="grid gap-8 lg:grid-cols-2">
                {/* FAQ form */}
                <form onSubmit={handleSaveFaq} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-black text-slate-900">{editingFaqId ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                  <input
                    value={faqForm.question}
                    onChange={e => setFaqForm(p => ({ ...p, question: e.target.value }))}
                    placeholder="Question *"
                    required
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                  />
                  <textarea
                    value={faqForm.answer}
                    onChange={e => setFaqForm(p => ({ ...p, answer: e.target.value }))}
                    rows={4}
                    placeholder="Answer *"
                    required
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={faqForm.category}
                      onChange={e => setFaqForm(p => ({ ...p, category: e.target.value }))}
                      placeholder="Category (e.g. GST, Trademark)"
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                    />
                    <input
                      type="number"
                      value={faqForm.sort_order}
                      onChange={e => setFaqForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 1 }))}
                      placeholder="Sort order"
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={faqForm.active} onChange={e => setFaqForm(p => ({ ...p, active: e.target.checked }))} />
                    Active (visible on public FAQ page)
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" className="rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800">
                      {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
                    </button>
                    {editingFaqId && (
                      <button type="button" onClick={() => { setEditingFaqId(null); setFaqForm({ question: '', answer: '', category: 'General', sort_order: 1, active: true }); }} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* FAQ list */}
                <div className="space-y-3">
                  {(state.faqs || []).map(faq => (
                    <div key={faq.id} className={`rounded-2xl border p-4 ${faq.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{faq.category}</p>
                          <p className="mt-0.5 text-sm font-bold text-slate-900">{faq.question}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-600">{faq.answer}</p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button type="button" onClick={() => { setEditingFaqId(faq.id); setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category || 'General', sort_order: faq.sort_order || 1, active: faq.active !== false }); }} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                          <button type="button" onClick={() => api.updateFaq(faq.id, { active: !faq.active })} className={`rounded-lg border px-2 py-1 text-xs font-semibold ${faq.active ? 'border-amber-200 text-amber-700' : 'border-emerald-200 text-emerald-700'}`}>{faq.active ? 'Hide' : 'Show'}</button>
                          <button type="button" onClick={() => api.deleteFaq(faq.id)} className="rounded-lg border border-rose-200 px-2 py-1 text-rose-700"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(state.faqs || []).length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-400">No FAQs yet. Add one on the left.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'hero' && (
            <>
              <SectionHeader title="Hero Slides" onAdd={() => openCreate('hero')} addLabel="Add slide" />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {state.heroSlides.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-900">{item.heading}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.subheading}</p>
                    <p className="mt-2 text-xs text-slate-500">Order: {item.slide_order}</p>
                    <div className="mt-4 flex gap-2">
                      <button type="button" onClick={() => openEdit('hero', item)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                      <button type="button" onClick={() => api.deleteHero(item.id)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-700"><Trash2 size={14} /></button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {activeTab === 'content' && (
            <>
              <SectionHeader title="CMS Content" />
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Website Settings — WhatsApp, Phone, Email */}
                <form onSubmit={handleSaveWebsiteSettings} className="grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="text-sm font-black text-slate-900">🌐 Website Settings (WhatsApp, Phone)</h3>
                  <p className="text-xs text-slate-500">These values are used globally — floating WhatsApp button, footer, contact page.</p>
                  <input value={websiteSettingsForm.phone} onChange={e => setWebsiteSettingsForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone (e.g. +91 98765 43210)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white" />
                  <input value={websiteSettingsForm.whatsapp} onChange={e => setWebsiteSettingsForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="WhatsApp number (digits only, e.g. 919876543210)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white" />
                  <input value={websiteSettingsForm.email} onChange={e => setWebsiteSettingsForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white" />
                  <textarea value={websiteSettingsForm.address} onChange={e => setWebsiteSettingsForm(p => ({ ...p, address: e.target.value }))} rows={2} placeholder="Office address" className="rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white" />
                  <button type="submit" className="w-fit rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Save Settings</button>
                </form>

                <form onSubmit={handleSaveAbout} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-black text-slate-900">Home: About section</h3>
                  <input value={aboutForm.title} onChange={(e) => setAboutForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="About title" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" required />
                  <input value={aboutForm.subtitle} onChange={(e) => setAboutForm((prev) => ({ ...prev, subtitle: e.target.value }))} placeholder="About subtitle" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" required />
                  <textarea value={aboutForm.body} onChange={(e) => setAboutForm((prev) => ({ ...prev, body: e.target.value }))} rows="5" placeholder="About body" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" required />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={aboutForm.cta_text} onChange={(e) => setAboutForm((prev) => ({ ...prev, cta_text: e.target.value }))} placeholder="CTA text" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                    <input value={aboutForm.cta_url} onChange={(e) => setAboutForm((prev) => ({ ...prev, cta_url: e.target.value }))} placeholder="CTA URL" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                  </div>
                  <button type="submit" className="w-fit rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800">Save About</button>
                </form>

                <form onSubmit={handleSaveFooterContact} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-black text-slate-900">Footer: Contact + Map</h3>
                  <input value={footerContactForm.phone || ''} onChange={(e) => setFooterContactForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                  <input value={footerContactForm.email || ''} onChange={(e) => setFooterContactForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                  <textarea value={footerContactForm.address || ''} onChange={(e) => setFooterContactForm((prev) => ({ ...prev, address: e.target.value }))} rows="3" placeholder="Address" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                  <textarea value={footerContactForm.map_embed_url || ''} onChange={(e) => setFooterContactForm((prev) => ({ ...prev, map_embed_url: e.target.value }))} rows="3" placeholder="Google Maps embed URL (iframe src)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                  <button type="submit" className="w-fit rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Save Footer</button>
                </form>

                <div className="col-span-full">
                  <h3 className="text-sm font-black text-slate-900 mb-6">About Page Content</h3>
                  <AboutContentForm
                    section={aboutPageSection}
                    onSave={async (data) => {
                      await api.updateContentSection('about_page', data);
                      await api.refreshAll();
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'founders' && (
            <>
              <SectionHeader title="Founders" onAdd={() => openCreate('founders')} addLabel="Add founder" />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {state.founders
                  .slice()
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((item) => (
                    <article key={item.id} className="rounded-2xl border border-slate-200 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: item.avatar_color || '#0ea5e9' }}>
                          {item.initials || item.name?.slice(0, 2)?.toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                          <p className="text-sm text-slate-500">{item.role}</p>
                        </div>
                      </div>
                      <p className="line-clamp-3 text-sm text-slate-600">{item.bio}</p>
                      <p className="mt-2 text-xs text-slate-500">Order: {item.display_order}</p>
                      <div className="mt-4 flex gap-2">
                        <button type="button" onClick={() => openEdit('founders', item)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                        <button type="button" onClick={() => api.deleteFounder(item.id)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-700"><Trash2 size={14} /></button>
                      </div>
                    </article>
                  ))}
              </div>
            </>
          )}
        </section>
        </div>
      </main>
    </div>

      {editingType && (
        <Modal title={`${editingItem ? 'Edit' : 'New'} ${editingType.slice(0, -1) || editingType}`} onClose={closeModal} wide={editingType === 'services' || editingType === 'blogs'}>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            {editingType === 'services' && (
              <div className="grid gap-4">
                {/* Basic fields */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={serviceForm.title} onChange={(e) => setServiceForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title *" required className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input value={serviceForm.category} onChange={(e) => setServiceForm((p) => ({ ...p, category: e.target.value }))} placeholder="Category *" required className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input value={serviceForm.price} onChange={(e) => setServiceForm((p) => ({ ...p, price: e.target.value }))} placeholder="Price" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input value={serviceForm.icon} onChange={(e) => setServiceForm((p) => ({ ...p, icon: e.target.value }))} placeholder="Icon (emoji)" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input value={serviceForm.slug} onChange={(e) => setServiceForm((p) => ({ ...p, slug: e.target.value }))} placeholder="Slug (auto-generated if blank)" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input value={serviceForm.hero_tagline} onChange={(e) => setServiceForm((p) => ({ ...p, hero_tagline: e.target.value }))} placeholder="Hero tagline" className="rounded-xl border border-slate-300 px-4 py-3" />
                </div>
                <textarea value={serviceForm.description} onChange={(e) => setServiceForm((p) => ({ ...p, description: e.target.value }))} rows="3" placeholder="Short description *" required className="rounded-xl border border-slate-300 px-4 py-3" />
                <textarea value={serviceForm.long_description} onChange={(e) => setServiceForm((p) => ({ ...p, long_description: e.target.value }))} rows="4" placeholder="Long description" className="rounded-xl border border-slate-300 px-4 py-3" />
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={serviceForm.featured} onChange={(e) => setServiceForm((p) => ({ ...p, featured: e.target.checked }))} /> Featured
                </label>

                {/* Benefits */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">Benefits</p>
                    <button type="button" onClick={() => setServiceForm((p) => ({ ...p, benefits: [...p.benefits, ''] }))} className="text-xs font-semibold text-sky-700">+ Add</button>
                  </div>
                  {serviceForm.benefits.map((b, i) => (
                    <div key={i} className="mb-2 flex gap-2">
                      <input value={typeof b === 'string' ? b : b.text || ''} onChange={(e) => setServiceForm((p) => { const arr = [...p.benefits]; arr[i] = e.target.value; return { ...p, benefits: arr }; })} placeholder={`Benefit ${i + 1}`} className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                      <button type="button" onClick={() => setServiceForm((p) => ({ ...p, benefits: p.benefits.filter((_, j) => j !== i) }))} className="text-rose-500"><X size={14} /></button>
                    </div>
                  ))}
                </div>

                {/* Process Steps */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">Process Steps</p>
                    <button type="button" onClick={() => setServiceForm((p) => ({ ...p, process_steps: [...p.process_steps, { title: '', description: '' }] }))} className="text-xs font-semibold text-sky-700">+ Add</button>
                  </div>
                  {serviceForm.process_steps.map((step, i) => (
                    <div key={i} className="mb-3 rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Step {i + 1}</span>
                        <button type="button" onClick={() => setServiceForm((p) => ({ ...p, process_steps: p.process_steps.filter((_, j) => j !== i) }))} className="text-rose-500"><X size={14} /></button>
                      </div>
                      <input value={step.title} onChange={(e) => setServiceForm((p) => { const arr = [...p.process_steps]; arr[i] = { ...arr[i], title: e.target.value }; return { ...p, process_steps: arr }; })} placeholder="Step title" className="mb-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                      <textarea value={step.description} onChange={(e) => setServiceForm((p) => { const arr = [...p.process_steps]; arr[i] = { ...arr[i], description: e.target.value }; return { ...p, process_steps: arr }; })} rows="2" placeholder="Step description" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                  ))}
                </div>

                {/* Documents */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">Required Documents</p>
                    <button type="button" onClick={() => setServiceForm((p) => ({ ...p, documents: [...p.documents, ''] }))} className="text-xs font-semibold text-sky-700">+ Add</button>
                  </div>
                  {serviceForm.documents.map((doc, i) => (
                    <div key={i} className="mb-2 flex gap-2">
                      <input value={typeof doc === 'string' ? doc : doc.name || ''} onChange={(e) => setServiceForm((p) => { const arr = [...p.documents]; arr[i] = e.target.value; return { ...p, documents: arr }; })} placeholder={`Document ${i + 1}`} className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                      <button type="button" onClick={() => setServiceForm((p) => ({ ...p, documents: p.documents.filter((_, j) => j !== i) }))} className="text-rose-500"><X size={14} /></button>
                    </div>
                  ))}
                </div>

                {/* FAQs */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">FAQs</p>
                    <button type="button" onClick={() => setServiceForm((p) => ({ ...p, faqs: [...p.faqs, { question: '', answer: '' }] }))} className="text-xs font-semibold text-sky-700">+ Add</button>
                  </div>
                  {serviceForm.faqs.map((faq, i) => (
                    <div key={i} className="mb-3 rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">FAQ {i + 1}</span>
                        <button type="button" onClick={() => setServiceForm((p) => ({ ...p, faqs: p.faqs.filter((_, j) => j !== i) }))} className="text-rose-500"><X size={14} /></button>
                      </div>
                      <input value={faq.question} onChange={(e) => setServiceForm((p) => { const arr = [...p.faqs]; arr[i] = { ...arr[i], question: e.target.value }; return { ...p, faqs: arr }; })} placeholder="Question" className="mb-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                      <textarea value={faq.answer} onChange={(e) => setServiceForm((p) => { const arr = [...p.faqs]; arr[i] = { ...arr[i], answer: e.target.value }; return { ...p, faqs: arr }; })} rows="2" placeholder="Answer" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                  ))}
                </div>

                {/* Pricing Plans */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">Pricing Plans</p>
                    <button type="button" onClick={() => setServiceForm((p) => ({ ...p, pricing_plans: [...p.pricing_plans, { name: '', price: '', features: '' }] }))} className="text-xs font-semibold text-sky-700">+ Add</button>
                  </div>
                  {serviceForm.pricing_plans.map((plan, i) => (
                    <div key={i} className="mb-3 rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">Plan {i + 1}</span>
                        <button type="button" onClick={() => setServiceForm((p) => ({ ...p, pricing_plans: p.pricing_plans.filter((_, j) => j !== i) }))} className="text-rose-500"><X size={14} /></button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input value={plan.name} onChange={(e) => setServiceForm((p) => { const arr = [...p.pricing_plans]; arr[i] = { ...arr[i], name: e.target.value }; return { ...p, pricing_plans: arr }; })} placeholder="Plan name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                        <input value={plan.price} onChange={(e) => setServiceForm((p) => { const arr = [...p.pricing_plans]; arr[i] = { ...arr[i], price: e.target.value }; return { ...p, pricing_plans: arr }; })} placeholder="Price" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                      </div>
                      <textarea value={Array.isArray(plan.features) ? plan.features.join('\n') : plan.features || ''} onChange={(e) => setServiceForm((p) => { const arr = [...p.pricing_plans]; arr[i] = { ...arr[i], features: e.target.value.split('\n') }; return { ...p, pricing_plans: arr }; })} rows="3" placeholder="Features (one per line)" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={serviceForm.cta_text} onChange={(e) => setServiceForm((p) => ({ ...p, cta_text: e.target.value }))} placeholder="CTA text" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input value={serviceForm.cta_phone} onChange={(e) => setServiceForm((p) => ({ ...p, cta_phone: e.target.value }))} placeholder="CTA phone" className="rounded-xl border border-slate-300 px-4 py-3" />
                </div>
              </div>
            )}

            {editingType === 'blogs' && (
              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="title" required defaultValue={editingItem?.title || ''} placeholder="Title" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input name="blog_author" required defaultValue={editingItem?.blog_author || ''} placeholder="Author" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input name="category" required defaultValue={editingItem?.category || ''} placeholder="Category" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input name="blog_image_color" defaultValue={editingItem?.blog_image_color || ''} placeholder="Fallback color (#hex)" className="rounded-xl border border-slate-300 px-4 py-3" />
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-800">Content</p>
                  <RichTextEditor value={blogContent} onChange={setBlogContent} />
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input name="published" type="checkbox" defaultChecked={editingItem ? editingItem.published !== false : true} /> Published
                </label>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">Blog image</p>
                    {filePreviews.image ? (
                      <button type="button" onClick={() => clearSelectedFile('image')} className="text-xs font-semibold text-rose-700 hover:text-rose-800">Remove selected</button>
                    ) : editingItem?.blog_image && !removeExistingImages.image ? (
                      <button type="button" onClick={() => removeExistingImage('image')} className="text-xs font-semibold text-rose-700 hover:text-rose-800">Remove current</button>
                    ) : removeExistingImages.image ? (
                      <button type="button" onClick={() => setRemoveExistingImages((prev) => ({ ...prev, image: false }))} className="text-xs font-semibold text-slate-600 hover:text-slate-800">Undo</button>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {(filePreviews.image || (editingItem?.blog_image && !removeExistingImages.image)) && (
                      <img src={assetUrl(filePreviews.image || editingItem.blog_image)} alt="Preview" className="h-16 w-20 rounded-xl object-cover border border-slate-200" />
                    )}
                    <input key={fileInputKeys.image || 0} type="file" name="image" accept="image/*" onChange={(e) => setSelectedFile('image', e.target.files?.[0])} className="rounded-xl border border-slate-300 px-4 py-3" />
                  </div>
                </div>
              </div>
            )}

            {editingType === 'testimonials' && (
              <>
                <input name="name" required defaultValue={editingItem?.name || ''} placeholder="Name" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="role" required defaultValue={editingItem?.role || ''} placeholder="Role" className="rounded-xl border border-slate-300 px-4 py-3" />
                <textarea name="text" required defaultValue={editingItem?.text || ''} rows="4" placeholder="Testimonial" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="rating" type="number" min="1" max="5" required defaultValue={editingItem?.rating || 5} className="rounded-xl border border-slate-300 px-4 py-3" />
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">Avatar image</p>
                      {filePreviews.avatar_image ? (
                        <button type="button" onClick={() => clearSelectedFile('avatar_image')} className="text-xs font-semibold text-rose-700 hover:text-rose-800">
                          Remove selected
                        </button>
                      ) : editingItem?.avatar_image && !removeExistingImages.avatar_image ? (
                        <button type="button" onClick={() => removeExistingImage('avatar_image')} className="text-xs font-semibold text-rose-700 hover:text-rose-800">
                          Remove current
                        </button>
                      ) : removeExistingImages.avatar_image ? (
                        <button type="button" onClick={() => setRemoveExistingImages((prev) => ({ ...prev, avatar_image: false }))} className="text-xs font-semibold text-slate-600 hover:text-slate-800">
                          Undo
                        </button>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {(filePreviews.avatar_image || (editingItem?.avatar_image && !removeExistingImages.avatar_image)) && (
                        <img
                          src={assetUrl(filePreviews.avatar_image || editingItem.avatar_image)}
                          alt="Avatar preview"
                          className="h-14 w-14 rounded-2xl object-cover border border-slate-200"
                        />
                      )}
                      <input
                        key={fileInputKeys.avatar_image || 0}
                        type="file"
                        name="avatar_image"
                        accept="image/*"
                        onChange={(e) => setSelectedFile('avatar_image', e.target.files?.[0])}
                        className="rounded-xl border border-slate-300 px-4 py-3"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">Banner image</p>
                      {filePreviews.banner_image ? (
                        <button type="button" onClick={() => clearSelectedFile('banner_image')} className="text-xs font-semibold text-rose-700 hover:text-rose-800">
                          Remove selected
                        </button>
                      ) : editingItem?.banner_image && !removeExistingImages.banner_image ? (
                        <button type="button" onClick={() => removeExistingImage('banner_image')} className="text-xs font-semibold text-rose-700 hover:text-rose-800">
                          Remove current
                        </button>
                      ) : removeExistingImages.banner_image ? (
                        <button type="button" onClick={() => setRemoveExistingImages((prev) => ({ ...prev, banner_image: false }))} className="text-xs font-semibold text-slate-600 hover:text-slate-800">
                          Undo
                        </button>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {(filePreviews.banner_image || (editingItem?.banner_image && !removeExistingImages.banner_image)) && (
                        <img
                          src={assetUrl(filePreviews.banner_image || editingItem.banner_image)}
                          alt="Banner preview"
                          className="h-16 w-24 rounded-xl object-cover border border-slate-200"
                        />
                      )}
                      <input
                        key={fileInputKeys.banner_image || 0}
                        type="file"
                        name="banner_image"
                        accept="image/*"
                        onChange={(e) => setSelectedFile('banner_image', e.target.files?.[0])}
                        className="rounded-xl border border-slate-300 px-4 py-3"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {editingType === 'hero' && (
              <>
                <input name="heading" required defaultValue={editingItem?.heading || ''} placeholder="Heading *" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                <textarea name="subheading" required defaultValue={editingItem?.subheading || ''} rows="4" placeholder="Subheading *" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                <div className="grid gap-3 sm:grid-cols-3">
                  <input name="slide_order" type="number" required defaultValue={editingItem?.slide_order || 1} placeholder="Order" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                  <input name="badge_text" defaultValue={editingItem?.badge_text || ''} placeholder="Badge text (e.g. #1 in Jaipur)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                  <label className="flex items-center gap-2 text-sm text-slate-700 rounded-xl border border-slate-300 px-4 py-3">
                    <input type="checkbox" name="active" defaultChecked={editingItem?.active !== false} value="true" />
                    Active (visible)
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input name="cta_text" defaultValue={editingItem?.cta_text || ''} placeholder="CTA Button Text (e.g. Get Free Consultation)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                  <input name="cta_url" defaultValue={editingItem?.cta_url || '/contact'} placeholder="CTA URL (e.g. /contact)" className="rounded-xl border border-slate-300 px-4 py-3 text-sm" />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">Hero image</p>
                    {filePreviews.image ? (
                      <button type="button" onClick={() => clearSelectedFile('image')} className="text-xs font-semibold text-rose-700 hover:text-rose-800">
                        Remove selected
                      </button>
                    ) : editingItem?.image && !removeExistingImages.image ? (
                      <button type="button" onClick={() => removeExistingImage('image')} className="text-xs font-semibold text-rose-700 hover:text-rose-800">
                        Remove current
                      </button>
                    ) : removeExistingImages.image ? (
                      <button type="button" onClick={() => setRemoveExistingImages((prev) => ({ ...prev, image: false }))} className="text-xs font-semibold text-slate-600 hover:text-slate-800">
                        Undo
                      </button>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {(filePreviews.image || (editingItem?.image && !removeExistingImages.image)) && (
                      <img
                        src={assetUrl(filePreviews.image || editingItem.image)}
                        alt="Preview"
                        className="h-16 w-24 rounded-xl object-cover border border-slate-200"
                      />
                    )}
                    <input
                      key={fileInputKeys.image || 0}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => setSelectedFile('image', e.target.files?.[0])}
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              </>
            )}


            {editingType === 'founders' && (
              <>
                <input name="name" required defaultValue={editingItem?.name || ''} placeholder="Name" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="role" required defaultValue={editingItem?.role || ''} placeholder="Role" className="rounded-xl border border-slate-300 px-4 py-3" />
                <textarea name="bio" required defaultValue={editingItem?.bio || ''} rows="4" placeholder="Bio" className="rounded-xl border border-slate-300 px-4 py-3" />
                <div className="grid gap-4 md:grid-cols-3">
                  <input name="initials" defaultValue={editingItem?.initials || ''} placeholder="Initials" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input name="avatar_color" defaultValue={editingItem?.avatar_color || '#0ea5e9'} placeholder="#0ea5e9" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input name="display_order" type="number" required defaultValue={editingItem?.display_order || 1} className="rounded-xl border border-slate-300 px-4 py-3" />
                </div>
              </>
            )}

            <button type="submit" className="mt-2 w-full rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-800">Save</button>
          </form>
        </Modal>
      )}

      {viewingBlog && (
        <Modal title="Blog preview" onClose={() => setViewingBlog(null)} wide>
          <div className="grid gap-5">
            {viewingBlog.blog_image ? (
              <img src={assetUrl(viewingBlog.blog_image)} alt="" className="h-52 w-full rounded-2xl object-cover" />
            ) : (
              <div
                className="h-52 w-full rounded-2xl bg-gradient-to-br from-sky-600 to-slate-900 p-6 text-2xl font-black text-white"
                style={{ backgroundColor: viewingBlog.blog_image_color || '#0ea5e9' }}
              >
                {viewingBlog.title}
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {viewingBlog.category} · {viewingBlog.blog_author}
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">{viewingBlog.title}</h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: viewingBlog.blog_content }} />

            <div className="flex flex-wrap gap-2">
              <a
                href={`/blog/${viewingBlog.id}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Open public page
              </a>
              <button type="button" onClick={() => { setViewingBlog(null); openEdit('blogs', viewingBlog); }} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                Edit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
