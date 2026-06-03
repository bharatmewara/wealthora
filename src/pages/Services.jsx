import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { assetUrl } from '../lib/assetUrl';
import { Search, Filter, ArrowRight, Star } from 'lucide-react';

export default function Services() {
  const { state } = useAdmin();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const services = state.services || [];

  const categories = useMemo(() => {
    const cats = [...new Set(services.map(s => s.category).filter(Boolean))];
    return ['All', ...cats];
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q);
      const matchCat = activeCategory === 'All' || s.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [services, search, activeCategory]);

  const featured = filtered.filter(s => s.featured);
  const rest = filtered.filter(s => !s.featured);

  return (
    <>
      <title>Services — Wealthora | CA Compliance & Registration</title>

      {/* Hero */}
      <div className="bg-gradient-to-br from-sky-800 to-indigo-900 px-6 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">All Services</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            Expert CA Services,<br />
            <span className="text-sky-300">Simple Pricing.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-sky-100">
            From company registration to GST filing — we handle all compliance so you can focus on growing your business.
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="search"
              id="services-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services…"
              className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-300 outline-none backdrop-blur-sm focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Category filter */}
        {categories.length > 2 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-sky-700 text-white shadow' : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
            No services found{search ? ` for "${search}"` : ''}.
          </div>
        ) : (
          <>
            {/* Featured services */}
            {featured.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-sky-700">
                  ⭐ Featured Services
                </h2>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {featured.map(service => (
                    <ServiceCard key={service.id} service={service} featured />
                  ))}
                </div>
              </div>
            )}

            {/* All other services */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-500">
                    All Services
                  </h2>
                )}
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function ServiceCard({ service, featured }) {
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-3xl border transition hover:-translate-y-1 hover:shadow-xl ${featured ? 'border-sky-200 bg-gradient-to-br from-sky-50 to-white shadow-md' : 'border-slate-200 bg-white shadow-sm'}`}>
      {featured && (
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            <Star size={10} fill="currentColor" /> Popular
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {service.icon && <span className="text-4xl">{service.icon}</span>}
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{service.category}</p>
        <h3 className="mt-1 text-xl font-black text-slate-900">{service.title}</h3>
        <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-600">{service.description}</p>

        <div className="mt-5 flex items-center justify-between">
          <div>
            {service.price ? (
              <>
                <p className="text-xs text-slate-400">Starting from</p>
                <p className="text-xl font-black text-emerald-700">{service.price}</p>
              </>
            ) : (
              <p className="text-sm font-semibold text-slate-500">Contact for pricing</p>
            )}
          </div>
          <Link
            to={`/services/${service.slug || service.id}`}
            id={`service-card-${service.slug || service.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-700 px-4 py-2 text-sm font-bold text-white shadow hover:bg-sky-800 transition-colors group-hover:bg-sky-800"
          >
            Explore <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
