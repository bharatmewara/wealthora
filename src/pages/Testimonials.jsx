import { useAdmin } from '../contexts/AdminContext';
import { useMemo, useState } from 'react';
import StarRating from '../components/StarRating';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { assetUrl } from '../lib/assetUrl';
import { Link } from 'react-router-dom';

function chunk(items, size) {
  const output = [];
  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }
  return output;
}

export default function Testimonials() {
  const { state } = useAdmin();
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const testimonials = useMemo(() => state.testimonials || [], [state.testimonials]);
  const testimonialSlides = useMemo(() => chunk(testimonials, 3), [testimonials]);

  return (
    <>
      <section className="bg-gradient-to-br from-emerald-50 via-white to-sky-50 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Client Stories</p>
              <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">What clients say</h1>
              <p className="mt-4 text-sm text-slate-600 sm:text-base">
                Real feedback from founders and operators who use Wealthora for registration, filings, and advisory.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/contact" className="rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                  Book a consultation
                </Link>
                <Link to="/services" className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  Explore services
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Avg rating', value: '4.9/5' },
                { label: 'Repeat clients', value: '70%+' },
                { label: 'Response time', value: '< 24h' }
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
                  <p className="mt-3 text-2xl font-black text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Testimonials</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Trusted by growing teams</h2>
            </div>
            {testimonialSlides.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTestimonialSlide((prev) => (prev - 1 + testimonialSlides.length) % testimonialSlides.length)}
                  className="rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
                  aria-label="Previous testimonials"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setTestimonialSlide((prev) => (prev + 1) % testimonialSlides.length)}
                  className="rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
                  aria-label="Next testimonials"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {testimonialSlides.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(testimonialSlides[testimonialSlide] || []).map((item) => (
                  <article
                    key={item.id}
                    className="group rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      {item.avatar_image ? (
                        <img src={assetUrl(item.avatar_image)} alt={item.name} className="h-14 w-14 rounded-2xl object-cover border border-slate-200" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
                          {(item.name || 'Client').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 truncate">{item.role}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <StarRating rating={item.rating || 5} />
                      <p className="mt-4 text-sm italic leading-relaxed text-slate-700">"{item.text}"</p>
                    </div>

                    {item.banner_image && (
                      <img src={assetUrl(item.banner_image)} alt="" className="mt-5 h-24 w-full rounded-2xl object-cover border border-slate-200" />
                    )}
                  </article>
                ))}
              </div>

              {testimonialSlides.length > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {testimonialSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setTestimonialSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        testimonialSlide === index ? 'w-8 bg-emerald-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to testimonial page ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center">
              No testimonials yet.
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 rounded-3xl bg-slate-900 p-8 text-white sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Next steps</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Ready to get started?</h2>
              <p className="mt-3 text-sm text-slate-200 sm:text-base">
                Tell us what you need and we’ll share a clear plan, timeline, and pricing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/contact" className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-500">
                Contact Wealthora
              </Link>
              <Link to="/services" className="rounded-2xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                View services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
