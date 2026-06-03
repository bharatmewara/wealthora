import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { assetUrl } from '../lib/assetUrl';
import { Search, ArrowRight, Calendar, User, Tag } from 'lucide-react';

const PAGE_SIZE = 6;

export default function Blog() {
  const { state } = useAdmin();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);

  const published = useMemo(
    () => (state.blogs || []).filter(b => b.published !== false),
    [state.blogs]
  );

  const categories = useMemo(() => {
    const cats = [...new Set(published.map(b => b.category).filter(Boolean))];
    return ['All', ...cats];
  }, [published]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return published.filter(b => {
      const matchSearch = !search ||
        b.title?.toLowerCase().includes(q) ||
        b.blog_author?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q);
      const matchCat = activeCategory === 'All' || b.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [published, search, activeCategory]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (cat) => { setActiveCategory(cat); setPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  return (
    <>
      <title>Blog — Wealthora | CA Insights & Business Tips</title>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-700 to-orange-900 px-6 py-14 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-200">Insights & Tips</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">The Wealthora Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-orange-100">
            Expert CA insights, compliance tips and business guides — explained simply for founders.
          </p>
          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" />
            <input
              type="search"
              id="blog-search"
              value={search}
              onChange={handleSearch}
              placeholder="Search articles…"
              className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-orange-200 outline-none backdrop-blur-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Category tabs */}
        {categories.length > 2 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                id={`blog-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleFilter(cat)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-orange-600 text-white shadow' : 'border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {paginated.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
            {search ? `No articles found for "${search}"` : 'No blog posts available yet.'}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginated.map(blog => <BlogCard key={blog.id} blog={blog} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold ${page === p ? 'bg-orange-600 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function BlogCard({ blog }) {
  const readTime = blog.blog_content ? Math.max(1, Math.ceil(blog.blog_content.split(' ').length / 200)) : 3;
  const date = blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Cover image or gradient */}
      {blog.blog_image ? (
        <img
          src={blog.blog_image}
          alt={blog.title}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="flex h-44 items-end p-5"
          style={{ background: `linear-gradient(135deg, ${blog.blog_image_color || '#0ea5e9'}, ${blog.blog_image_color ? blog.blog_image_color + 'aa' : '#7c3aed'})` }}
        >
          <p className="text-base font-black leading-tight text-white line-clamp-2">{blog.title}</p>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Tag size={11} /> {blog.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <User size={11} /> {blog.blog_author}
          </span>
          {date && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={11} /> {date}
            </span>
          )}
        </div>
        {blog.blog_image && (
          <h3 className="mt-2 text-lg font-black text-slate-900 line-clamp-2">{blog.title}</h3>
        )}
        <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {blog.blog_content?.replace(/<[^>]*>/g, '') || ''}
        </p>
        <Link
          to={`/blog/${blog.id}`}
          id={`blog-card-${blog.id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
        >
          Read Article <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
