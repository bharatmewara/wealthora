import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, CheckCircle, ArrowRight,
  Shield, Award, Clock, Users, Star, ChevronDown, ChevronUp, Phone
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import HeroSlider from '../components/HeroSlider';
import { assetUrl } from '../lib/assetUrl';

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function StarRating({ rating = 5, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
      ))}
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all ${open ? 'border-sky-200 bg-sky-50' : 'border-slate-200 bg-white'}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span className="text-sm font-semibold text-slate-800">{question}</span>
        <span className={`shrink-0 rounded-full p-1.5 ${open ? 'bg-sky-200 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      {open && (
        <div className="border-t border-sky-100 px-6 pb-5 pt-3">
          <p className="text-sm leading-relaxed text-slate-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

const defaultAbout = {
  title: 'About Wealthora',
  subtitle: 'We simplify compliance and growth for modern businesses.',
  body: 'From registration to recurring filings, Wealthora helps founders run compliant and scalable businesses with expert guidance.',
  cta_text: 'Learn more',
  cta_url: '/about'
};

export default function Home() {
  const { state } = useAdmin();
  const [testimonialSlide, setTestimonialSlide] = useState(0);

  const featuredServices = useMemo(
    () => (state.services || []).filter(s => s.featured),
    [state.services]
  );
  const allServices = useMemo(() => (state.services || []).slice(0, 6), [state.services]);
  const recentBlogs = useMemo(
    () => (state.blogs || []).filter(b => b.published !== false).slice(0, 3),
    [state.blogs]
  );
  const testimonials = useMemo(() => state.testimonials || [], [state.testimonials]);
  const faqs = useMemo(() => (state.faqs || []).slice(0, 6), [state.faqs]);

  const aboutSection = useMemo(
    () => state.contentSections.find(s => s.section_key === 'home_about') || defaultAbout,
    [state.contentSections]
  );

  const testimonialSlides = chunk(testimonials, 3);
  const displayServices = featuredServices.length > 0 ? featuredServices : allServices;

  return (
    <>
      <title>Wealthora — CA Compliance & Business Registration Made Simple</title>

      {/* ── 1. HERO SLIDER ──────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── 2. TRUST BAR ────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              { icon: Award, value: '500+', label: 'Happy Clients', color: 'text-sky-600' },
              { icon: CheckCircle, value: '20+', label: 'CA Services', color: 'text-emerald-600' },
              { icon: Clock, value: '7 Days', label: 'Avg. Completion', color: 'text-orange-600' },
              { icon: Shield, value: '5+ Yrs', label: 'Experience', color: 'text-purple-600' }
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 py-5 px-3 text-center">
                <Icon size={24} className={color} />
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="text-xs font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED SERVICES ────────────────────────────────────────── */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">Our Services</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                Most Requested Services
              </h2>
            </div>
            <Link to="/services" className="shrink-0 text-sm font-semibold text-sky-700 hover:text-sky-800">
              View all →
            </Link>
          </div>

          {displayServices.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {displayServices.slice(0, 6).map(service => (
                <article
                  key={service.id}
                  className="group flex flex-col rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                >
                  {service.icon && <span className="text-4xl">{service.icon}</span>}
                  <h3 className="mt-4 text-lg font-black text-slate-900">{service.title}</h3>
                  <p className="mt-2 flex-1 line-clamp-2 text-sm text-slate-600">{service.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-lg font-black text-emerald-700">{service.price || 'Contact us'}</p>
                    <Link
                      to={`/services/${service.slug || service.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-sky-700 px-4 py-2 text-sm font-bold text-white hover:bg-sky-800"
                    >
                      Explore <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
              Services will appear here.
            </div>
          )}
        </div>
      </section>

      {/* ── 4. WHY CHOOSE US ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-sky-800 to-indigo-900 py-14 sm:py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">Why Wealthora</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              The Smarter Way to Stay Compliant
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sky-100">
              We handle the boring paperwork so you can focus on growing your business. Simple, transparent, reliable.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '⚡', title: 'Fast Turnaround', desc: 'Most registrations completed in 7 working days. We keep you updated every step.' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges. You know exactly what you pay before we begin.' },
              { icon: '👩‍💼', title: 'Dedicated CA Expert', desc: 'A real CA assigned to your case — not a chatbot, not a junior assistant.' },
              { icon: '📱', title: 'End-to-End Online', desc: 'Everything happens online. No office visits, no physical paperwork.' },
              { icon: '🔒', title: '100% Secure', desc: 'Your documents are encrypted and handled with strict confidentiality.' },
              { icon: '🏆', title: 'Proven Track Record', desc: '500+ businesses served. Rated 4.9/5 by our clients.' }
            ].map(item => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-3 text-base font-black">{item.title}</h3>
                <p className="mt-1.5 text-sm text-sky-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">Process</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              Get Started in 3 Simple Steps
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              No confusing forms. No office visits. Just tell us what you need and we'll handle everything.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { step: '01', title: 'Submit Your Enquiry', desc: 'Fill out our simple form with your basic details. Takes less than 2 minutes.', color: 'bg-sky-100 text-sky-700' },
              { step: '02', title: 'Expert Review & Call', desc: 'Our CA expert reviews your requirement and calls you within 30 minutes.', color: 'bg-orange-100 text-orange-700' },
              { step: '03', title: 'We Handle Everything', desc: 'Sit back and relax. We manage all paperwork, filings and follow-ups.', color: 'bg-emerald-100 text-emerald-700' }
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                {i < 2 && (
                  <div className="absolute left-full top-10 hidden h-0.5 w-full -translate-y-1/2 bg-slate-200 sm:block" style={{ width: 'calc(100% - 2.5rem)', left: '75%' }} />
                )}
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black ${item.color}`}>
                  {item.step}
                </div>
                <h3 className="mt-5 text-base font-black text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/contact" id="how-it-works-cta" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-orange-600">
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. ABOUT SECTION (CMS) ───────────────────────────────────────── */}
      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">About Us</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">{aboutSection.title}</h2>
              <p className="mt-4 text-lg text-slate-700">{aboutSection.subtitle}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{aboutSection.body}</p>
              <Link
                to={aboutSection.cta_url || '/about'}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700"
              >
                {aboutSection.cta_text || 'Learn more'} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-slate-900 p-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-200">Why Choose Us</p>
              <ul className="mt-5 space-y-3">
                {[
                  'End-to-end registration and compliance support',
                  'Transparent pricing with clear timelines',
                  'Dedicated CA advisory team for founders',
                  'Online process — no office visits required',
                  '100% confidential document handling'
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ──────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Client Reviews</p>
                <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                  Trusted by 500+ Businesses
                </h2>
              </div>
              <Link to="/testimonials" className="shrink-0 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                Read all →
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(testimonialSlides[testimonialSlide] || []).map(item => (
                <article key={item.id} className="flex flex-col rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    {item.avatar_image ? (
                      <img src={assetUrl(item.avatar_image)} alt={item.name} className="h-12 w-12 rounded-2xl object-cover border border-slate-200" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-900 text-sm font-black text-white">
                        {(item.name || 'C').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.role}</p>
                    </div>
                  </div>
                  <StarRating rating={item.rating || 5} size={14} />
                  <p className="mt-4 flex-1 text-sm italic leading-relaxed text-slate-600">"{item.text}"</p>
                </article>
              ))}
            </div>

            {testimonialSlides.length > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {testimonialSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTestimonialSlide(i)}
                    className={`h-2.5 rounded-full transition-all ${testimonialSlide === i ? 'w-8 bg-emerald-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
                    aria-label={`Go to testimonial page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 8. FAQ SECTION ───────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">FAQ</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                Common Questions
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-600">
                Quick answers to questions we get asked all the time.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map(faq => (
                <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/faq" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                View all FAQs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 9. RECENT BLOGS ──────────────────────────────────────────────── */}
      {recentBlogs.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">Latest Articles</p>
                <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">From Our Blog</h2>
              </div>
              <Link to="/blog" className="shrink-0 text-sm font-semibold text-orange-700 hover:text-orange-800">
                Go to blog →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {recentBlogs.map(blog => (
                <Link key={blog.id} to={`/blog/${blog.id}`} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition">
                  <div
                    className="flex h-40 items-end p-5"
                    style={{ background: `linear-gradient(135deg, ${blog.blog_image_color || '#0ea5e9'}, #7c3aed)` }}
                  >
                    <p className="text-base font-black leading-tight text-white line-clamp-2">{blog.title}</p>
                  </div>
                  <div className="flex-1 p-5">
                    <p className="text-xs font-semibold text-slate-400">{blog.category} · {blog.blog_author}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {(blog.blog_content || '').replace(/<[^>]*>/g, '')}
                    </p>
                    <p className="mt-3 text-xs font-bold text-orange-600 group-hover:text-orange-700">Read Article →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 10. FINAL CTA BANNER ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-black sm:text-4xl">
            Ready to Start Your Business?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sky-100">
            Join 500+ founders who trusted Wealthora for their compliance needs. Get a free consultation today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              id="home-final-cta"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-orange-600"
            >
              Get Free Consultation <ArrowRight size={18} />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/20"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
