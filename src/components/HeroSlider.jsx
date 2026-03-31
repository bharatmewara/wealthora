import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pause, Play } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { assetUrl } from '../lib/assetUrl';

const fallbackSlides = [
  {
    id: 'fallback-1',
    heading: 'Launch Your Business With Confidence',
    subheading: 'Company registration, trademark filing, and compliance in one place.',
    slide_order: 1
  },
  {
    id: 'fallback-2',
    heading: 'Build Faster, Stay Compliant',
    subheading: 'Advisory support for founders and growth-stage teams.',
    slide_order: 2
  }
];

export default function HeroSlider() {
  const { state } = useAdmin();
  const slides = useMemo(() => {
    const dynamic = (state.heroSlides || []).slice().sort((a, b) => a.slide_order - b.slide_order);
    return dynamic.length > 0 ? dynamic : fallbackSlides;
  }, [state.heroSlides]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slides.length]);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-slate-900" />
{slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(125deg, #0ea5e9 20%, #0f172a 90%)' }}
        >
          <div className="absolute inset-0 bg-black/35" />
          {slide.image && (
            <img 
              src={assetUrl(slide.image)} 
              alt="" 
              className="absolute inset-0 h-full w-full object-cover scale-105"
            />
          )}
        </div>
      ))}

      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-20 text-white">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Wealthora Advisory</p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
            {slides[currentSlide]?.heading}
          </h1>
          <p className="mt-6 text-lg text-slate-100 sm:text-xl">{slides[currentSlide]?.subheading}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/services"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-100"
            >
              Explore Services
            </Link>
            <Link
              to="/contact"
              className="rounded-2xl border border-white/50 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setIsPlaying((value) => !value)}
        className="absolute right-6 top-6 z-10 rounded-xl bg-white/90 p-3 text-slate-800 shadow-lg"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
    </section>
  );
}
