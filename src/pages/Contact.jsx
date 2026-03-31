import { useMemo, useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: ''
};

export default function Contact() {
  const { state, api } = useAdmin();
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const serviceOptions = useMemo(() => {
    return [...new Set((state.services || []).map((item) => item.title).filter(Boolean))];
  }, [state.services]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.addEnquiry({ ...formData, status: 'new' });
      setSubmitted(true);
      setFormData(initialForm);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-sky-50 py-12 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Contact Team</p>
          <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">Request consultation</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            Share your requirement and our advisory team will contact you quickly with the right plan.
          </p>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            <p className="font-semibold text-slate-900">Response time</p>
            <p className="mt-2">Within 1 business day</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Name
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Phone
              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Service interested in
            <select
              value={formData.service}
              onChange={(e) => setFormData((prev) => ({ ...prev, service: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select service</option>
              {serviceOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            Message
            <textarea
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          {submitted && (
            <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              Enquiry submitted successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white hover:from-sky-700 hover:to-orange-600 disabled:opacity-60"
          >
            {saving ? 'Submitting...' : 'Submit enquiry'}
          </button>
        </form>
      </div>
    </section>
  );
}
