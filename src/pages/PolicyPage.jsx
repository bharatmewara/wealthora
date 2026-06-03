import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

function PolicyPage({ sectionKey, title, icon: Icon, color }) {
  const { state } = useAdmin();

  const section = useMemo(
    () => state.contentSections.find(s => s.section_key === sectionKey),
    [state.contentSections, sectionKey]
  );

  const heading = section?.title || title;
  const body = section?.body || '';
  const updatedAt = section?.updated_at ? new Date(section.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <title>{heading} — Wealthora</title>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${color} px-6 py-14 text-white`}>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
            <Icon size={16} /> Legal
          </div>
          <h1 className="text-4xl font-black sm:text-5xl">{heading}</h1>
          {updatedAt && <p className="mt-3 text-sm text-white/70">Last updated: {updatedAt}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-14">
        {body ? (
          <div
            className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900 prose-a:text-sky-700"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
            <p className="text-sm">This page content is being prepared.</p>
            <p className="mt-2 text-xs text-slate-400">An admin can edit this from the Admin → CMS Pages panel.</p>
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-600">Have a question about our policies?</p>
          <Link to="/contact" className="mt-3 inline-block rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-800">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}

export default PolicyPage;
