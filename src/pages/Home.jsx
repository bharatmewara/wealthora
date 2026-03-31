import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import HeroSlider from '../components/HeroSlider';
import { assetUrl } from '../lib/assetUrl';

function chunk(items, size) {
  const output = [];
  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }
  return output;
}

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`h-4 w-4 ${index < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
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
  const [serviceSlide, setServiceSlide] = useState(0);
  const [testimonialSlide, setTestimonialSlide] = useState(0);

  const featuredServices = useMemo(
    () => (state.services || []).filter((service) => service.featured),
    [state.services]
  );
  const recentBlogs = useMemo(
    () => (state.blogs || []).filter((blog) => blog.published !== false).slice(0, 3),
    [state.blogs]
  );
  const testimonials = useMemo(() => state.testimonials || [], [state.testimonials]);
  const founders = useMemo(
    () => (state.founders || []).slice().sort((a, b) => a.display_order - b.display_order),
    [state.founders]
  );
  const aboutSection = useMemo(
    () => state.contentSections.find((section) => section.section_key === 'home_about') || defaultAbout,
    [state.contentSections]
  );

  const serviceSlides = chunk(featuredServices, 3);
  const testimonialSlides = chunk(testimonials, 3);

  return (
    <>
      <HeroSlider />

      <section className="bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">Featured services</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Most requested services</h2>
            </div>
            <Link to="/services" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
              View all services
            </Link>
          </div>

          {serviceSlides.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(serviceSlides[serviceSlide] || []).map((service) => (
                  <article
                    key={service.id}
                    className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span className="text-3xl">{service.icon || '*'}</span>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">{service.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">{service.description}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-xl font-black text-sky-700">{service.price || 'Contact us'}</p>
                      <Link
                        to={`/services/${service.id}`}
                        className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
                      >
                        Explore
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {serviceSlides.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setServiceSlide((prev) => (prev - 1 + serviceSlides.length) % serviceSlides.length)}
                    className="rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceSlide((prev) => (prev + 1) % serviceSlides.length)}
                    className="rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
              No featured services available yet.
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">About us</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">{aboutSection.title}</h2>
              <p className="mt-4 text-lg text-slate-700">{aboutSection.subtitle}</p>
              <p className="mt-4 leading-relaxed text-slate-600">{aboutSection.body}</p>
              <Link
                to={aboutSection.cta_url || '/about'}
                className="mt-6 inline-flex rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
              >
                {aboutSection.cta_text || 'Learn more'}
              </Link>
              {/* Admin dropdown hidden */}
              {false && (
                <select
                  value={aboutSection.cta_url || '/about'}
                  className="mt-2 inline-block rounded-xl border px-4 py-2 text-sm"
                >
                  <option value="/about">About</option>
                  <option value="/services">Services</option>
                  <option value="/testimonials">Testimonials</option>
                  <option value="/blog">Blog</option>
                </select>
              )}
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-slate-900 p-8 text-white">
              <p className="text-sm uppercase tracking-widest text-sky-100">Why Wealthora</p>
              <ul className="mt-4 space-y-3 text-sm sm:text-base">
                <li>End-to-end registration and compliance support</li>
                <li>Transparent pricing with clear timelines</li>
                <li>Dedicated advisory team for founders</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Client voices</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Recent testimonials</h2>
            </div>
            <Link to="/testimonials" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Read all
            </Link>
          </div>

          {testimonialSlides.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(testimonialSlides[testimonialSlide] || []).map((item) => (
                  <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center gap-3">
                      {item.avatar_image ? (
                        <img
                          src={assetUrl(item.avatar_image)}
                          alt={item.name}
                          className="h-12 w-12 rounded-2xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
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
                    </div>
                    <p className="mt-4 text-sm italic leading-relaxed text-slate-700">"{item.text}"</p>
                    {item.banner_image && (
                      <img
                        src={assetUrl(item.banner_image)}
                        alt=""
                        className="mt-5 h-20 w-full rounded-2xl object-cover border border-slate-200"
                      />
                    )}
                  </article>
                ))}
              </div>

              {testimonialSlides.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {testimonialSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setTestimonialSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        testimonialSlide === index
                          ? 'w-8 bg-emerald-600'
                          : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to testimonial page ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
              No testimonials available yet.
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Our founders</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Leadership team</h2>
          </div>

          {founders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {founders.map((founder) => (
                <article key={founder.id} className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
                  <div
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black text-white"
                    style={{ backgroundColor: founder.avatar_color || '#0ea5e9' }}
                  >
                    {founder.initials || founder.name?.slice(0, 2)?.toUpperCase()}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{founder.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-orange-600">{founder.role}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{founder.bio}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
              Founders will appear here after adding them in admin.
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">Latest articles</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">From our blog</h2>
            </div>
            <Link to="/blog" className="text-sm font-semibold text-orange-700 hover:text-orange-800">
              Go to blog
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {recentBlogs.map((blog) => (
              <article key={blog.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div
                  className="mb-4 h-36 rounded-2xl bg-gradient-to-br from-sky-500 to-orange-500 p-4 text-lg font-bold text-white"
                  style={{ backgroundColor: blog.blog_image_color || '#0ea5e9' }}
                >
                  {blog.title}
                </div>
                <p className="line-clamp-3 text-sm text-slate-600">{blog.blog_content}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
