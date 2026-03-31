import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MessageCircle, Phone } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, state } = useAdmin();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getService(id);
        setService(data);
      } catch {
        setError('Service not found.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      run();
    }
  }, [api, id]);

  if (loading) {
    return <div className="py-24 text-center text-slate-600">Loading service details...</div>;
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Service unavailable</h1>
        <p className="mt-3 text-slate-600">{error || 'The requested service does not exist.'}</p>
        <Link
          to="/services"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-800"
        >
          <ChevronLeft size={16} />
          Back to services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-orange-50 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {service.featured && (
            <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              Featured service
            </span>
          )}

          <div className="mt-4 flex items-start gap-4">
            <span className="text-4xl">{service.icon || '*'}</span>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{service.title}</h1>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{service.category}</p>
            </div>
          </div>

          <p className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-slate-700">{service.description}</p>

          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Starting from</p>
            <p className="mt-2 text-3xl font-black text-emerald-800">{service.price || 'Contact us'}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              to={`/enquiry/${service.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-800"
            >
              <MessageCircle size={16} />
              Send enquiry
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Phone size={16} />
              Contact us
            </Link>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Client reviews</h3>
            <div className="mt-4 space-y-4">
              {(state.testimonials || []).slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm italic text-slate-700">"{item.text}"</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {item.name} - {item.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Need quick guidance?</h3>
            <p className="mt-2 text-sm text-slate-600">Tell us your business requirement and get a response within 24 hours.</p>
            <Link
              to="/contact"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Request callback
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}