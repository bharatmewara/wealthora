import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { state } = useAdmin();
  const { api } = useAdmin();
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', city: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const settings = (() => {
    const section = state.contentSections.find(s => s.section_key === 'website_settings') || {};
    const data = section.data || {};
    const footer = state.contentSections.find(s => s.section_key === 'footer_contact') || {};
    const fd = footer.data || {};
    return {
      phone: fd.phone || data.phone || '+91 98765 43210',
      email: fd.email || data.email || 'hello@wealthora.com',
      address: fd.address || data.address || '',
      whatsapp: data.whatsapp || fd.whatsapp || ''
    };
  })();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setErrorMsg('Name and phone are required.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.addEnquiry({ ...form, service: form.service || 'General Enquiry' });
      setStatus('success');
      setForm({ name: '', email: '', phone: '', service: '', city: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Failed to submit. Please call us directly.');
    }
  };

  return (
    <>
      <title>Contact Us — Wealthora | Free Consultation</title>

      {/* Hero */}
      <div className="bg-gradient-to-br from-sky-800 to-indigo-900 px-6 py-14 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">Get in Touch</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            Let's Start Your <br />
            <span className="text-sky-300">Compliance Journey</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-sky-100">
            Drop us a message and our CA expert will reach out to you within 30 minutes during business hours.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Left — info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-slate-900">We're here to help</h2>
            <p className="mt-3 text-slate-600">Get a free consultation from our expert CA team. No obligation, no jargon.</p>

            <div className="mt-8 space-y-5">
              <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 group-hover:bg-sky-200 transition-colors">
                  <Phone size={20} className="text-sky-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Call Us Free</p>
                  <p className="mt-0.5 text-base font-bold text-slate-900 group-hover:text-sky-700">{settings.phone}</p>
                </div>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 group-hover:bg-orange-200 transition-colors">
                  <Mail size={20} className="text-orange-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email Us</p>
                  <p className="mt-0.5 text-base font-bold text-slate-900 group-hover:text-orange-700">{settings.email}</p>
                </div>
              </a>
              {settings.address && (
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                    <MapPin size={20} className="text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Office</p>
                    <p className="mt-0.5 text-sm text-slate-700 whitespace-pre-wrap">{settings.address}</p>
                  </div>
                </div>
              )}
            </div>

            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            )}

            {/* Trust indicators */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { label: 'Years Experience', value: '5+' },
                { label: 'Happy Clients', value: '500+' },
                { label: 'Services', value: '20+' },
                { label: 'Response Time', value: '< 30 min' }
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-black text-sky-700">{item.value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg lg:col-span-3">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle size={40} className="text-emerald-600" />
                </div>
                <h3 className="mt-6 text-2xl font-black text-slate-900">Enquiry Submitted!</h3>
                <p className="mt-2 text-slate-600">Our expert will reach out to you within 30 minutes.</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 rounded-xl bg-sky-700 px-6 py-2.5 text-sm font-bold text-white hover:bg-sky-800"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-slate-900">Send Us a Message</h2>
                <p className="mt-1 text-sm text-slate-500">Fill in the details and we'll get back to you shortly.</p>

                {errorMsg && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMsg}</div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-style" htmlFor="contact-name">Full Name *</label>
                      <input id="contact-name" name="name" value={form.name} onChange={handleChange} required placeholder="Rahul Sharma" className="input-style" />
                    </div>
                    <div>
                      <label className="label-style" htmlFor="contact-phone">Phone *</label>
                      <input id="contact-phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="input-style" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-style" htmlFor="contact-email">Email</label>
                      <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" className="input-style" />
                    </div>
                    <div>
                      <label className="label-style" htmlFor="contact-city">City</label>
                      <input id="contact-city" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className="input-style" />
                    </div>
                  </div>
                  <div>
                    <label className="label-style" htmlFor="contact-service">Service Interested In</label>
                    <select id="contact-service" name="service" value={form.service} onChange={handleChange} className="input-style">
                      <option value="">Select a service…</option>
                      {(state.services || []).map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                      <option value="General Enquiry">General Enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-style" htmlFor="contact-message">Message</label>
                    <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us what you need help with…" className="input-style" />
                  </div>

                  <button
                    type="submit"
                    id="contact-submit"
                    disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 py-3.5 text-sm font-bold text-white shadow-lg hover:from-sky-700 hover:to-blue-800 disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending…
                      </>
                    ) : (
                      <><Send size={16} /> Send Enquiry</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
