import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export default function Footer() {
  const { state } = useAdmin();
  const footer = useMemo(
    () => state.contentSections.find((section) => section.section_key === 'footer_contact')?.data || {},
    [state.contentSections]
  );

  const phone = footer.phone || '+91 98765 43210';
  const email = footer.email || 'hello@wealthora.com';
  const address = footer.address || 'Jaipur, Rajasthan, India';
  const mapEmbedUrl = footer.map_embed_url || '';
  const telHref = `tel:${String(phone).replace(/[^\d+]/g, '')}`;
  const mailHref = `mailto:${String(email).trim()}`;

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-4 md:gap-10 md:py-12">
        <div>
          <h3 className="font-heading text-2xl font-bold text-white">Wealthora</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Full-service company registration, compliance, and advisory support.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white">Quick Links</h4>
          <div className="mt-4 grid gap-2 text-sm">
            <Link to="/services" className="hover:text-orange-300">Services</Link>
            <Link to="/blog" className="hover:text-orange-300">Blog</Link>
            <Link to="/about" className="hover:text-orange-300">About</Link>
            <Link to="/contact" className="hover:text-orange-300">Contact</Link>
            <Link to="/admin" className="hover:text-orange-300">Admin</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white">Contact</h4>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            <a href={telHref} className="block hover:text-orange-300">{phone}</a>
            <a href={mailHref} className="block hover:text-orange-300">{email}</a>
            <p className="whitespace-pre-wrap">{address}</p>
          </div>
        </div>

        <div className="md:col-span-1">
          <h4 className="text-sm font-bold uppercase tracking-wide text-white">Map</h4>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            {mapEmbedUrl ? (
              <iframe
                title="Wealthora map"
                src={mapEmbedUrl}
                className="h-44 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-44 items-center justify-center px-6 text-center text-xs text-slate-400">
                Add a Google Maps embed URL in Admin → Content → Footer.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        {new Date().getFullYear()} Wealthora. All rights reserved.
      </div>
    </footer>
  );
}
