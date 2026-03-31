import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, FileText, User } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { assetUrl } from '../lib/assetUrl';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { http, state } = useAdmin();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await http.get(`/api/blogs/${id}`);
        setBlog(response.data);
      } catch {
        setError('Blog not found.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      run();
    }
  }, [http, id]);

  if (loading) {
    return <div className="py-24 text-center text-slate-600">Loading blog details...</div>;
  }

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <FileText className="mx-auto h-14 w-14 text-slate-400" />
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Blog not found</h1>
        <p className="mt-3 text-slate-600">{error || 'The requested blog does not exist.'}</p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
        >
          <ChevronLeft size={16} />
          Back to blog
        </Link>
      </div>
    );
  }

  const relatedBlogs = Array.isArray(state.blogs)
    ? state.blogs
        .filter((item) => item.published !== false)
        .filter((item) => String(item.id) !== String(id))
        .slice(0, 3)
    : [];

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft size={16} />
          Back to blog
        </button>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200">
            {blog.blog_image ? (
              <img
                src={assetUrl(blog.blog_image)}
                alt={blog.title}
                className="h-64 w-full object-cover sm:h-80"
              />
            ) : (
              <div
                className="flex h-64 w-full items-end rounded-none bg-gradient-to-br from-sky-600 to-slate-900 p-8 text-white sm:h-80"
                style={{ backgroundColor: blog.blog_image_color || '#0ea5e9' }}
              >
                <h1 className="text-3xl font-black leading-tight sm:text-4xl">{blog.title}</h1>
              </div>
            )}

            <div className="p-8">
              {!blog.blog_image && (
                <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">{blog.title}</h1>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <User size={16} />
                  {blog.blog_author || 'Admin'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{blog.category}</span>
                <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </header>

          <div className="p-8">
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap text-lg leading-relaxed">{blog.blog_content}</p>
            </div>
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700"
          >
            <ChevronLeft size={16} />
            View all blog posts
          </Link>
        </div>

        {relatedBlogs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-black text-slate-900">More to read</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {relatedBlogs.map((item) => (
                <Link
                  key={item.id}
                  to={`/blog/${item.id}`}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.category}</p>
                  <p className="mt-3 line-clamp-2 text-lg font-black text-slate-900">{item.title}</p>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-600">{item.blog_content}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
