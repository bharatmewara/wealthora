import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { normalizeSectionData } from '../../lib/contentSections';

export default function Footer() {
  const { state } = useAdmin();

  const footer = useMemo(() => {
    const section = state.contentSections.find(item => item.section_key === 'footer_contact') || {};
    return normalizeSectionData(section.data || section);
  }, [state.contentSections]);

  const settings = useMemo(() => {
    const section = state.contentSections.find(item => item.section_key === 'website_settings') || {};
    return normalizeSectionData(section.data || section);
  }, [state.contentSections]);

  const phone = footer.phone || settings.phone || '+91 98765 43210';
  const email = footer.email || settings.email || 'hello@wealthora.com';
  const address = footer.address || '';
  const mapEmbedUrlRaw = footer.map_embed_url || '';
  let mapEmbedUrl = mapEmbedUrlRaw;
  if (mapEmbedUrlRaw.includes('<iframe')) {
    const match = mapEmbedUrlRaw.match(/src=["']([^"']+)["']/);
    if (match) {
      mapEmbedUrl = match[1];
    }
  }

  const whatsapp = settings.whatsapp || footer.whatsapp || '';
  const whatsappClean = whatsapp.replace(/\D/g, '');

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block rounded-xl bg-white p-2">
              <img src="/wealthora-logo-cropped.png" alt="Wealthora" className="h-8 w-auto" />
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-slate-400">
              Full-service CA platform for company registration, GST, trademarks and compliance support — all in one place.
            </p>
            {whatsappClean && (
              <a
                href={`https://wa.me/${whatsappClean}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Quick Links</h4>
            <nav className="mt-4 grid gap-2.5 text-sm">
              <Link to="/services" className="hover:text-orange-400 transition-colors">Services</Link>
              <Link to="/blog" className="hover:text-orange-400 transition-colors">Blog</Link>
              <Link to="/testimonials" className="hover:text-orange-400 transition-colors">Testimonials</Link>
              <Link to="/faq" className="hover:text-orange-400 transition-colors">FAQ</Link>
              <Link to="/about" className="hover:text-orange-400 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-orange-400 transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Contact</h4>
            <div className="mt-4 space-y-3 text-sm">
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="flex items-start gap-2.5 hover:text-orange-400 transition-colors">
                <Phone size={14} className="mt-0.5 shrink-0 text-sky-500" />
                {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-start gap-2.5 hover:text-orange-400 transition-colors">
                <Mail size={14} className="mt-0.5 shrink-0 text-sky-500" />
                {email}
              </a>
              {address && (
                <p className="flex items-start gap-2.5">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-sky-500" />
                  <span className="whitespace-pre-wrap text-slate-500">{address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Map */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Find Us</h4>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
              {mapEmbedUrl && (mapEmbedUrl.includes('google.com') || mapEmbedUrl.includes('pb=')) ? (
                <iframe
                  title="Wealthora office location"
                  src={mapEmbedUrl}
                  className="h-44 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-slate-900 px-4 text-center text-xs text-slate-600">
                  Google Maps embed URL can be added from Admin → Content
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Wealthora Compliance Hub. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms & Conditions</Link>
            <Link to="/refund-policy" className="hover:text-slate-400 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
