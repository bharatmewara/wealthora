import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { Link } from 'react-router-dom';

function FAQAccordion({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all ${open ? 'border-sky-200 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-800">{question}</span>
        <span className={`shrink-0 rounded-full p-1.5 transition-colors ${open ? 'bg-sky-200 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
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

export default function FAQ() {
  const { state } = useAdmin();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const faqs = state.faqs || [];

  const categories = useMemo(() => {
    const cats = [...new Set(faqs.map(f => f.category || 'General'))];
    return ['All', ...cats];
  }, [faqs]);

  const filtered = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = !search ||
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === 'All' || (faq.category || 'General') === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [faqs, search, activeCategory]);

  const grouped = useMemo(() => {
    if (activeCategory !== 'All') return { [activeCategory]: filtered };
    return filtered.reduce((acc, faq) => {
      const cat = faq.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(faq);
      return acc;
    }, {});
  }, [filtered, activeCategory]);

  return (
    <>
      {/* SEO */}
      <title>FAQ — Wealthora | Frequently Asked Questions</title>

      {/* Hero */}
      <div className="bg-gradient-to-br from-sky-800 to-indigo-900 px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-sky-200">
            <HelpCircle size={16} /> Frequently Asked Questions
          </div>
          <h1 className="text-4xl font-black sm:text-5xl">
            Got Questions? <br />
            <span className="text-sky-300">We Have Answers.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-sky-100">
            Everything you need to know about company registration, GST, trademarks and compliance — explained simply.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              id="faq-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-300 outline-none backdrop-blur-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-14">
        {/* Category filter */}
        {categories.length > 2 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                id={`faq-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-sky-700 text-white shadow' : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300 hover:text-sky-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
            {search ? `No FAQs found for "${search}"` : 'No FAQs available yet.'}
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                {activeCategory === 'All' && (
                  <h2 className="mb-4 text-lg font-black text-slate-900">
                    <span className="border-b-2 border-sky-600 pb-1">{category}</span>
                  </h2>
                )}
                <div className="space-y-3">
                  {items.map(faq => (
                    <FAQAccordion key={faq.id} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-sky-700 to-indigo-800 p-8 text-center text-white">
          <h2 className="text-2xl font-black">Still have questions?</h2>
          <p className="mt-2 text-sky-200">Our CA experts are ready to help you for free.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600">
              Talk to an Expert
            </Link>
            <Link to="/services" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20">
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
