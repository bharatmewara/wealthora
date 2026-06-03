import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { CheckCircle, ArrowLeft, Send, FileText } from 'lucide-react';

const BUSINESS_TYPES = [
  'Startup / New Business',
  'Existing Business',
  'Partnership Firm',
  'Individual / Freelancer',
  'NGO / Trust',
  'Other'
];

export default function EnquiryForm() {
  const { serviceId } = useParams();
  const { state, api } = useAdmin();
  const navigate = useNavigate();

  const preselectedService = serviceId
    ? (state.services || []).find(s => s.id === parseInt(serviceId) || s.slug === serviceId)
    : null;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    business_type: '',
    service: preselectedService?.title || '',
    message: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setErrorMsg('Name is required.'); return; }
    if (!form.phone.trim()) { setErrorMsg('Phone number is required.'); return; }
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.addEnquiry(form);
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or call us directly.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle size={48} className="text-emerald-600" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-slate-900">Enquiry Submitted!</h1>
          <p className="mt-3 text-slate-600">
            Thank you, <span className="font-semibold">{form.name || 'there'}</span>! Our CA expert will reach out within <span className="font-semibold text-sky-700">30 minutes</span> during business hours.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/services" className="rounded-xl bg-sky-700 px-6 py-3 text-sm font-bold text-white hover:bg-sky-800">
              Browse Services
            </Link>
            <Link to="/" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Free Enquiry — Wealthora</title>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={14} /> Go Back
        </button>

        {/* Header */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
              <FileText size={22} className="text-sky-700" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {preselectedService ? `Enquire: ${preselectedService.title}` : 'Free Consultation'}
              </h1>
              <p className="text-sm text-slate-500">Fill in your details — we'll reach out within 30 minutes.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-style" htmlFor="eq-name">Full Name *</label>
                <input id="eq-name" name="name" value={form.name} onChange={handleChange} required placeholder="Rahul Sharma" className="input-style" />
              </div>
              <div>
                <label className="label-style" htmlFor="eq-phone">Phone Number *</label>
                <input id="eq-phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="input-style" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-style" htmlFor="eq-email">Email Address</label>
                <input id="eq-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" className="input-style" />
              </div>
              <div>
                <label className="label-style" htmlFor="eq-city">City</label>
                <input id="eq-city" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className="input-style" />
              </div>
            </div>

            <div>
              <label className="label-style" htmlFor="eq-business-type">Business Type</label>
              <select id="eq-business-type" name="business_type" value={form.business_type} onChange={handleChange} className="input-style">
                <option value="">Select business type…</option>
                {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="label-style" htmlFor="eq-service">Service Interested In</label>
              <select id="eq-service" name="service" value={form.service} onChange={handleChange} className="input-style">
                <option value="">Select a service…</option>
                {(state.services || []).map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                <option value="Not sure">Not sure — need advice</option>
              </select>
            </div>

            <div>
              <label className="label-style" htmlFor="eq-message">Additional Details</label>
              <textarea
                id="eq-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your requirement in brief…"
                className="input-style"
              />
            </div>

            <button
              type="submit"
              id="enquiry-submit"
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 py-4 text-sm font-bold text-white shadow-lg hover:from-sky-700 hover:to-blue-800 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Submitting…</>
              ) : (
                <><Send size={16} /> Submit Free Enquiry</>
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              🔒 Your details are safe with us. We never spam or share your information.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}