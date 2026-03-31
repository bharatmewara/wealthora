import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail, Phone, User } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: ''
};

export default function EnquiryForm() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { api } = useAdmin();

  const [formData, setFormData] = useState(initialForm);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        if (!serviceId) {
          setService(null);
          return;
        }
        const data = await api.getService(serviceId);
        setService(data);
      } catch {
        setService(null);
      }
    };

    run();
  }, [api, serviceId]);

  useEffect(() => {
    if (service?.title) {
      setFormData((prev) => ({ ...prev, service: service.title }));
    }
  }, [service]);

  const submitLabel = useMemo(() => (loading ? 'Sending...' : 'Send enquiry'), [loading]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.addEnquiry({ ...formData, status: 'new' });
      setSubmitted(true);
    } catch {
      setError('Could not send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="rounded-3xl border border-emerald-200 bg-white p-10 shadow-sm">
          <CheckCircle className="mx-auto h-14 w-14 text-emerald-600" />
          <h1 className="mt-4 text-3xl font-black text-slate-900">Enquiry submitted</h1>
          <p className="mt-3 text-slate-600">Thanks, we will contact you within one business day.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link to="/services" className="rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-800">
              Explore services
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFormData(initialForm);
              }}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Send another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-sky-50 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-3xl font-black text-slate-900">Service enquiry</h1>
          <p className="mt-2 text-sm text-slate-600">Tell us what you need and we will reach out quickly.</p>

          {service && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Enquiry for: <span className="font-semibold">{service.title}</span>
            </div>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              <span className="mb-2 flex items-center gap-2"><User size={16} /> Full name</span>
              <input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              <span className="mb-2 flex items-center gap-2"><Phone size={16} /> Phone</span>
              <input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            <span className="mb-2 flex items-center gap-2"><Mail size={16} /> Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Service</span>
            <input
              value={formData.service}
              onChange={(e) => handleChange('service', e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="mt-5 block text-sm font-semibold text-slate-700">
            <span className="mb-2 block">Message</span>
            <textarea
              rows="4"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-sky-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white hover:from-sky-700 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}