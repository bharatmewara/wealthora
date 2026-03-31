import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export default function Services() {
  const { state } = useAdmin();
  const services = state.services || [];

  const grouped = services.reduce((acc, item) => {
    const key = item.category || 'Other';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <section className="bg-gradient-to-b from-white to-sky-50/40 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Business Services</p>
          <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">Service Catalog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Select from registration, compliance, and advisory services. Every package is managed by our backend and editable from admin.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <Briefcase className="mx-auto h-14 w-14 text-slate-400" />
            <p className="mt-4 text-slate-600">No services available yet.</p>
            <Link to="/admin" className="mt-5 inline-block rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800">
              Add from admin
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-10">
            {Object.entries(grouped).map(([category, items]) => (
              <section key={category}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">{category}</h2>
                  <p className="text-sm text-slate-500">{items.length} services</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((service) => (
                    <article
                      key={service.id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      {service.featured && (
                        <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                          Featured
                        </span>
                      )}
                      <div className="mt-3 text-3xl">{service.icon || '*'}</div>
                      <h3 className="mt-4 text-xl font-bold text-slate-900">{service.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{service.description}</p>
                      <p className="mt-5 text-xl font-black text-emerald-700">{service.price || 'Contact us'}</p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Link
                          to={`/services/${service.id}`}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/enquiry/${service.id}`}
                          className="rounded-xl bg-gradient-to-r from-sky-600 to-orange-500 px-3 py-2 text-center text-sm font-semibold text-white hover:from-sky-700 hover:to-orange-600"
                        >
                          Enquire
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
