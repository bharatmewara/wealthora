import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, Trash2, LogOut } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { assetUrl } from '../lib/assetUrl';

const tabs = ['services', 'blogs', 'testimonials', 'enquiries', 'hero', 'content', 'founders'];

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

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
            Close
          </button>
        </div>
        {children}
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
  const [footerContactForm, setFooterContactForm] = useState(() => {
    const section = state.contentSections.find((item) => item.section_key === 'footer_contact');
    return section?.data || emptyFooterContact;
  });

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
    if (section?.data) {
      setFooterContactForm({
        phone: section.data.phone || '',
        email: section.data.email || '',
        address: section.data.address || '',
        map_embed_url: section.data.map_embed_url || ''
      });
    }
  }, [state.contentSections]);

  const summary = useMemo(
    () => [
      { label: 'Services', value: state.services.length },
      { label: 'Blogs', value: state.blogs.length },
      { label: 'Published Blogs', value: state.blogs.filter((b) => b.published !== false).length },
      { label: 'Testimonials', value: state.testimonials.length },
      { label: 'Enquiries', value: state.enquiries.length },
      { label: 'Founders', value: state.founders.length }
    ],
    [state]
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openCreate = (type) => {
    setEditingType(type);
    setEditingItem(null);
    setFilePreviews({});
    setFileInputKeys({});
    setRemoveExistingImages({});
  };

  const openEdit = (type, item) => {
    setEditingType(type);
    setEditingItem(item);
    setFilePreviews({});
    setFileInputKeys({});
    setRemoveExistingImages({});
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
      const servicePayload = {
        title: payload.title,
        category: payload.category,
        description: payload.description,
        price: payload.price,
        icon: payload.icon,
        featured: payload.featured === 'on'
      };
      if (editingItem) await api.updateService(editingItem.id, servicePayload);
      else await api.addService(servicePayload);
    } else if (editingType === 'blogs') {
      const blogPayload = {
        ...payload,
        ...removalPayload,
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
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Wealthora Admin</h1>
              <p className="mt-1 text-sm text-slate-600">Fully dynamic content and route management dashboard.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">{authState.user?.name || 'Admin'}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {summary.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                activeTab === tab ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
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
                    <div className="mt-4 flex items-center gap-2">
                      <select value={item.status || 'new'} onChange={(event) => api.updateEnquiry(item.id, { status: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm">
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="closed">closed</option>
                      </select>
                      <button type="button" onClick={() => api.deleteEnquiry(item.id)} className="rounded-lg border border-rose-200 px-2 py-1.5 text-rose-700"><Trash2 size={14} /></button>
                    </div>
                  </article>
                ))}
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
              <SectionHeader title="Homepage Content" />
              <div className="grid gap-6 lg:grid-cols-2">
                <form onSubmit={handleSaveAbout} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-black text-slate-900">Home: About section</h3>
                  <input value={aboutForm.title} onChange={(e) => setAboutForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="About title" className="rounded-xl border border-slate-300 px-4 py-3" required />
                  <input value={aboutForm.subtitle} onChange={(e) => setAboutForm((prev) => ({ ...prev, subtitle: e.target.value }))} placeholder="About subtitle" className="rounded-xl border border-slate-300 px-4 py-3" required />
                  <textarea value={aboutForm.body} onChange={(e) => setAboutForm((prev) => ({ ...prev, body: e.target.value }))} rows="5" placeholder="About body" className="rounded-xl border border-slate-300 px-4 py-3" required />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={aboutForm.cta_text} onChange={(e) => setAboutForm((prev) => ({ ...prev, cta_text: e.target.value }))} placeholder="CTA text" className="rounded-xl border border-slate-300 px-4 py-3" />
                    <input value={aboutForm.cta_url} onChange={(e) => setAboutForm((prev) => ({ ...prev, cta_url: e.target.value }))} placeholder="CTA URL" className="rounded-xl border border-slate-300 px-4 py-3" />
                  </div>
                  <button type="submit" className="w-fit rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800">Save About</button>
                </form>

                <form onSubmit={handleSaveFooterContact} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-black text-slate-900">Footer: Contact + Map</h3>
                  <input value={footerContactForm.phone} onChange={(e) => setFooterContactForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <input value={footerContactForm.email} onChange={(e) => setFooterContactForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <textarea value={footerContactForm.address} onChange={(e) => setFooterContactForm((prev) => ({ ...prev, address: e.target.value }))} rows="3" placeholder="Address" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <textarea value={footerContactForm.map_embed_url} onChange={(e) => setFooterContactForm((prev) => ({ ...prev, map_embed_url: e.target.value }))} rows="3" placeholder="Google Maps embed URL (iframe src)" className="rounded-xl border border-slate-300 px-4 py-3" />
                  <button type="submit" className="w-fit rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Save Footer</button>
                </form>
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

      {editingType && (
        <Modal title={`${editingItem ? 'Edit' : 'New'} ${editingType.slice(0, -1) || editingType}`} onClose={closeModal}>
          <form onSubmit={handleSave} className="grid gap-4">
            {editingType === 'services' && (
              <>
                <input name="title" required defaultValue={editingItem?.title || ''} placeholder="Title" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="category" required defaultValue={editingItem?.category || ''} placeholder="Category" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="price" defaultValue={editingItem?.price || ''} placeholder="Price" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="icon" defaultValue={editingItem?.icon || ''} placeholder="Icon" className="rounded-xl border border-slate-300 px-4 py-3" />
                <textarea name="description" required defaultValue={editingItem?.description || ''} rows="4" placeholder="Description" className="rounded-xl border border-slate-300 px-4 py-3" />
                <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="featured" type="checkbox" defaultChecked={Boolean(editingItem?.featured)} /> Featured</label>
              </>
            )}

            {editingType === 'blogs' && (
              <>
                <input name="title" required defaultValue={editingItem?.title || ''} placeholder="Title" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="blog_author" required defaultValue={editingItem?.blog_author || ''} placeholder="Author" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="category" required defaultValue={editingItem?.category || ''} placeholder="Category" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="blog_image_color" defaultValue={editingItem?.blog_image_color || ''} placeholder="Image color (#hex)" className="rounded-xl border border-slate-300 px-4 py-3" />
                <textarea name="blog_content" required defaultValue={editingItem?.blog_content || ''} rows="5" placeholder="Content" className="rounded-xl border border-slate-300 px-4 py-3" />
                <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="published" type="checkbox" defaultChecked={editingItem ? editingItem.published !== false : true} /> Published</label>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">Blog image</p>
                    {filePreviews.image ? (
                      <button type="button" onClick={() => clearSelectedFile('image')} className="text-xs font-semibold text-rose-700 hover:text-rose-800">
                        Remove selected
                      </button>
                    ) : editingItem?.blog_image && !removeExistingImages.image ? (
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
                    {(filePreviews.image || (editingItem?.blog_image && !removeExistingImages.image)) && (
                      <img
                        src={assetUrl(filePreviews.image || editingItem.blog_image)}
                        alt="Preview"
                        className="h-16 w-20 rounded-xl object-cover border border-slate-200"
                      />
                    )}
                    <input
                      key={fileInputKeys.image || 0}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => setSelectedFile('image', e.target.files?.[0])}
                      className="rounded-xl border border-slate-300 px-4 py-3"
                    />
                  </div>
                </div>
              </>
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
                <input name="heading" required defaultValue={editingItem?.heading || ''} placeholder="Heading" className="rounded-xl border border-slate-300 px-4 py-3" />
                <textarea name="subheading" required defaultValue={editingItem?.subheading || ''} rows="4" placeholder="Subheading" className="rounded-xl border border-slate-300 px-4 py-3" />
                <input name="slide_order" type="number" required defaultValue={editingItem?.slide_order || 1} className="rounded-xl border border-slate-300 px-4 py-3" />
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

            <button type="submit" className="mt-2 rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-800">Save</button>
          </form>
        </Modal>
      )}

      {viewingBlog && (
        <Modal title="Blog preview" onClose={() => setViewingBlog(null)}>
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

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {viewingBlog.blog_content}
            </div>

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
    </div>
  );
}
