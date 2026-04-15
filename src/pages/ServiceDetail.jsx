import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronLeft, Phone, MessageCircle, CheckCircle,
  ChevronDown, ChevronUp, FileText, Star
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

/* ── tiny helpers ─────────────────────────────────────────── */
function Section({ title, subtitle, children }) {
  return (
    <section className="mt-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-slate-800 hover:text-sky-700"
      >
        <span>{question}</span>
        <span className="shrink-0 rounded-full bg-slate-100 p-1">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-slate-600">{answer}</p>
      )}
    </div>
  );
}

/* ── main component ───────────────────────────────────────── */
export default function ServiceDetail() {
  const { slug } = useParams();
  const { api, state } = useAdmin();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    api
      .getServiceBySlug(slug)
      .then(setService)
      .catch(() => setError('Service not found.'))
      .finally(() => setLoading(false));
  }, [api, slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-700" />
      </div>
    );
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
          <ChevronLeft size={16} /> Back to services
        </Link>
      </div>
    );
  }

  const benefits     = service.benefits      || [];
  const processSteps = service.process_steps || [];
  const documents    = service.documents     || [];
  const faqs         = service.faqs          || [];
  const pricingPlans = service.pricing_plans || [];
  const phone        = service.cta_phone     || '';
  const whatsapp     = phone.replace(/\D/g, '');

  const relatedServices = (state.services || [])
    .filter((s) => s.id !== service.id && s.category === service.category)
    .slice(0, 3);

  return (
    <div className="relative bg-white">

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-800 via-sky-700 to-indigo-800 px-6 pb-20 pt-12 text-white">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-orange-400/10" />

        <div className="relative mx-auto max-w-5xl">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-200 hover:text-white"
          >
            <ChevronLeft size={14} /> All Services
          </Link>

          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
            {service.icon && (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-4xl backdrop-blur-sm">
                {service.icon}
              </span>
            )}
            <div>
              {service.featured && (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-orange-400/20 px-3 py-1 text-xs font-semibold text-orange-200">
                  <Star size={11} fill="currentColor" /> Featured Service
                </span>
              )}
              <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                {service.title}
              </h1>
              {service.hero_tagline && (
                <p className="mt-2 text-base text-sky-200 sm:text-lg">{service.hero_tagline}</p>
              )}
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-sky-300">
                {service.category}
              </p>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/enquiry/${service.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600"
            >
              <MessageCircle size={16} /> Get Started
            </Link>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Phone size={16} /> Call Now
              </a>
            )}
          </div>

          {/* Price badge */}
          {service.price && (
            <div className="mt-6 inline-block rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-200">Starting from</p>
              <p className="text-2xl font-black text-white">{service.price}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. SERVICE OVERVIEW ─────────────────────────────── */}
      {(service.long_description || service.description) && (
        <div className="mx-auto max-w-5xl px-6 pt-14">
          <Section title="Service Overview">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
              <p className="text-base leading-relaxed text-slate-700">
                {service.long_description || service.description}
              </p>
            </div>
          </Section>
        </div>
      )}

      {/* ── 3. BENEFITS ─────────────────────────────────────── */}
      {benefits.length > 0 && (
        <div className="mx-auto max-w-5xl px-6">
          <Section title="Key Benefits" subtitle="Why choose this service">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b, i) => {
                const text  = typeof b === 'string' ? b : (b.title || b.text || '');
                const desc  = typeof b === 'object' ? (b.description || '') : '';
                const icon  = typeof b === 'object' ? (b.icon || '') : '';
                return (
                  <div
                    key={i}
                    className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {icon ? (
                        <span className="text-2xl">{icon}</span>
                      ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <CheckCircle size={16} className="text-emerald-600" />
                        </span>
                      )}
                      <p className="font-bold text-slate-900">{text}</p>
                    </div>
                    {desc && <p className="text-sm leading-relaxed text-slate-600">{desc}</p>}
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      )}

      {/* ── 4. PROCESS STEPS ────────────────────────────────── */}
      {processSteps.length > 0 && (
        <div className="mx-auto max-w-5xl px-6">
          <Section title="How It Works" subtitle="Simple step-by-step process">
            <div className="relative">
              {/* vertical connector line */}
              <div className="absolute left-[19px] top-8 hidden h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-sky-300 to-transparent sm:block" />
              <ol className="space-y-4">
                {processSteps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-black text-white shadow-md">
                      {i + 1}
                    </span>
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="font-bold text-slate-900">{step.title}</p>
                      {step.description && (
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Section>
        </div>
      )}

      {/* ── 5. DOCUMENTS ────────────────────────────────────── */}
      {documents.length > 0 && (
        <div className="mx-auto max-w-5xl px-6">
          <Section title="Required Documents" subtitle="Keep these ready before you apply">
            <div className="grid gap-3 sm:grid-cols-2">
              {documents.map((doc, i) => {
                const name = typeof doc === 'string' ? doc : (doc.name || doc.title || '');
                const desc = typeof doc === 'object' ? (doc.description || '') : '';
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <FileText size={16} className="mt-0.5 shrink-0 text-orange-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{name}</p>
                      {desc && <p className="mt-0.5 text-xs text-slate-500">{desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      )}

      {/* ── 6. PRICING PLANS ────────────────────────────────── */}
      {pricingPlans.length > 0 && (
        <div className="mx-auto max-w-5xl px-6">
          <Section title="Pricing Plans" subtitle="Transparent pricing, no hidden charges">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pricingPlans.map((plan, i) => {
                const isPopular = plan.popular || i === 1;
                const features  = Array.isArray(plan.features)
                  ? plan.features
                  : (plan.features || '').split('\n').filter(Boolean);
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                      isPopular
                        ? 'border-sky-400 bg-gradient-to-b from-sky-700 to-sky-900 text-white'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white shadow">
                        Most Popular
                      </span>
                    )}
                    <p className={`text-xs font-bold uppercase tracking-widest ${isPopular ? 'text-sky-200' : 'text-slate-500'}`}>
                      {plan.name}
                    </p>
                    <p className={`mt-2 text-4xl font-black ${isPopular ? 'text-white' : 'text-emerald-700'}`}>
                      {plan.price}
                    </p>
                    {features.length > 0 && (
                      <ul className="mt-5 flex-1 space-y-2">
                        {features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle
                              size={14}
                              className={`mt-0.5 shrink-0 ${isPopular ? 'text-sky-300' : 'text-emerald-500'}`}
                            />
                            <span className={isPopular ? 'text-sky-100' : 'text-slate-600'}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      to={`/enquiry/${service.id}`}
                      className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                        isPopular
                          ? 'bg-white text-sky-700 hover:bg-sky-50'
                          : 'bg-sky-700 text-white hover:bg-sky-800'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      )}

      {/* ── 7. FAQs ─────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <div className="mx-auto max-w-5xl px-6">
          <Section title="Frequently Asked Questions">
            <div className="rounded-2xl border border-slate-200 bg-white px-6 shadow-sm">
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── 8. CTA SECTION ──────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-800 p-8 text-center text-white sm:p-12">
          <p className="text-2xl font-black sm:text-3xl">
            {service.cta_text || 'Ready to get started?'}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-sky-200">
            Our experts are available to guide you through every step. Reach out now.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`/enquiry/${service.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600"
            >
              <MessageCircle size={16} /> Send Enquiry
            </Link>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3 text-sm font-bold text-white hover:bg-white/20"
              >
                <Phone size={16} /> {phone}
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-bold text-white hover:bg-emerald-600"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── 9. RELATED SERVICES ─────────────────────────────── */}
      {relatedServices.length > 0 && (
        <div className="mx-auto max-w-5xl px-6">
          <Section title="Related Services" subtitle="You might also be interested in">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((s) => (
                <article
                  key={s.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {s.icon && <span className="text-3xl">{s.icon}</span>}
                  <h3 className="mt-3 font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-600">{s.description}</p>
                  {s.price && (
                    <p className="mt-3 text-sm font-black text-emerald-700">{s.price}</p>
                  )}
                  <Link
                    to={`/services/${s.slug || s.id}`}
                    className="mt-4 inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100"
                  >
                    Learn More
                  </Link>
                </article>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* bottom spacing */}
      <div className="h-24" />

      {/* ── 10. FLOATING CTA ────────────────────────────────── */}
      {phone && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              title="Chat on WhatsApp"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:scale-110 hover:bg-emerald-600"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}
          <a
            href={`tel:${phone}`}
            title="Call Now"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-700 text-white shadow-xl transition hover:scale-110 hover:bg-sky-800"
          >
            <Phone size={22} />
          </a>
        </div>
      )}
    </div>
  );
}
