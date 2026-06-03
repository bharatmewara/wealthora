import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { ChevronLeft, Calendar, User, Tag, Clock, MessageCircle } from 'lucide-react';

export default function BlogDetail() {
  const { id } = useParams();
  const { state } = useAdmin();

  const blog = (state.blogs || []).find(b => String(b.id) === String(id));
  const related = (state.blogs || []).filter(b => b.id !== blog?.id && b.category === blog?.category && b.published !== false).slice(0, 3);

  if (state.loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Article not found</h1>
        <p className="mt-3 text-slate-600">This article may have been removed or is not yet published.</p>
        <Link to="/blog" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-700">
          <ChevronLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const readTime = blog.blog_content ? Math.max(1, Math.ceil(blog.blog_content.replace(/<[^>]*>/g, '').split(' ').length / 200)) : 3;
  const date = blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <title>{blog.title} — Wealthora Blog</title>

      {/* Cover */}
      {blog.blog_image ? (
        <div className="h-72 w-full overflow-hidden">
          <img src={blog.blog_image} alt={blog.title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div
          className="flex h-64 items-end px-6 pb-10"
          style={{ background: `linear-gradient(135deg, ${blog.blog_image_color || '#0ea5e9'}, #7c3aed)` }}
        >
          <div className="mx-auto max-w-4xl w-full">
            <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white">
              <ChevronLeft size={14} /> Blog
            </Link>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Breadcrumb */}
        {blog.blog_image && (
          <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700">
            <ChevronLeft size={14} /> Back to Blog
          </Link>
        )}

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-orange-700 font-semibold">
            <Tag size={11} /> {blog.category}
          </span>
          <span className="inline-flex items-center gap-1"><User size={11} /> {blog.blog_author}</span>
          {date && <span className="inline-flex items-center gap-1"><Calendar size={11} /> {date}</span>}
          <span className="inline-flex items-center gap-1"><Clock size={11} /> {readTime} min read</span>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">{blog.title}</h1>

        {/* Content */}
        <div
          className="prose prose-slate mt-8 max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-a:text-sky-700 prose-img:rounded-2xl prose-strong:text-slate-800"
          dangerouslySetInnerHTML={{ __html: blog.blog_content || '' }}
        />

        {/* Enquiry CTA */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-sky-700 to-indigo-800 p-8 text-center text-white">
          <h2 className="text-2xl font-black">Need Help with Compliance?</h2>
          <p className="mt-2 text-sky-200">Our CA experts will guide you through every step, for free.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600">
            <MessageCircle size={16} /> Talk to an Expert
          </Link>
        </div>

        {/* Related blogs */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-5 text-lg font-black text-slate-900">Related Articles</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(r => (
                <Link
                  key={r.id}
                  to={`/blog/${r.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className="h-28"
                    style={{ background: `linear-gradient(135deg, ${r.blog_image_color || '#0ea5e9'}, #7c3aed)` }}
                  />
                  <div className="flex-1 p-4">
                    <p className="text-xs text-slate-400">{r.category}</p>
                    <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-sky-700">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
