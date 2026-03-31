import { FileText as FileTextIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { assetUrl } from '../lib/assetUrl';

export default function Blog() {
  const { state } = useAdmin();
  const blogs = Array.isArray(state.blogs)
    ? state.blogs.filter((blog) => blog.published !== false)
    : [];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Knowledge Center</p>
          <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">Blog and Insights</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Practical insights on compliance, registrations, and business operations.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <FileTextIcon className="mx-auto h-14 w-14 text-slate-400" />
            <p className="mt-4 text-slate-600">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {blog.blog_image ? (
                  <img 
                    src={assetUrl(blog.blog_image)}
                    alt={blog.title}
                    className="mb-4 h-40 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div
                    className="mb-4 h-40 rounded-2xl bg-gradient-to-br from-sky-500 to-orange-500 p-4 text-lg font-bold text-white"
                    style={{ backgroundColor: blog.blog_image_color || '#0ea5e9' }}
                  >
                    {blog.title}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{blog.category}</span>
                  <span>by {blog.blog_author || 'Admin'}</span>
                </div>
                <p className="mt-4 line-clamp-4 text-sm text-slate-600">{blog.blog_content}</p>
                <p className="mt-5 text-xs text-slate-500">
                  {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Recently'}
                </p>
                <Link
                  to={`/blog/${blog.id}`}
                  className="mt-6 block rounded-xl border border-black px-6 py-3 text-center text-sm font-semibold text-black hover:bg-black hover:text-white transition"
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
