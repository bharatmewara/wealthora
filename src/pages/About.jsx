import React from 'react';
import { Users, Award, Target, Building2, ShieldCheck, Star } from 'lucide-react';

export default function About() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-orange-600 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold uppercase tracking-wider border border-white/20 mb-8">
            Our Story
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-slate-200 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl">
            About Wealthora
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed opacity-90">
            Trusted partner for 5000+ entrepreneurs. Simplifying business setup since 2018.
          </p>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="inline-flex items-center gap-3 bg-orange-500 text-white px-5 py-2 rounded-2xl mb-8 font-semibold">
                <Target size={20} />
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-sky-900 bg-clip-text text-transparent mb-6">
                Empowering Indian Entrepreneurs
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Making company registration and compliance hassle-free. From Pvt Ltd to GST, we handle every milestone with precision.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <ShieldCheck size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900 mb-2">100% Compliance Guarantee</h4>
                  <p className="text-slate-600">Government filings with zero errors.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Award size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900 mb-2">5+ Years Experience</h4>
                  <p className="text-slate-600">Successfully served 5000+ businesses.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-sky-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform">
                5000+
              </div>
              <div className="text-xl font-semibold text-slate-700">Happy Clients</div>
              <div className="mt-2 w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full mx-auto group-hover:w-32 transition-all"></div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform">
                5+
              </div>
              <div className="text-xl font-semibold text-slate-700">Years Experience</div>
              <div className="mt-2 w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full mx-auto group-hover:w-32 transition-all"></div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform">
                98%
              </div>
              <div className="text-xl font-semibold text-slate-700">Success Rate</div>
              <div className="mt-2 w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full mx-auto group-hover:w-32 transition-all"></div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform">
                24/7
              </div>
              <div className="text-xl font-semibold text-slate-700">Support</div>
              <div className="mt-2 w-24 h-1 bg-gradient-to-r from-sky-500 to-sky-400 rounded-full mx-auto group-hover:w-32 transition-all"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Placeholder */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 text-emerald-600 rounded-full text-sm font-semibold uppercase tracking-wider border border-emerald-200/50 mb-6">
              Meet The Team
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 to-orange-600 bg-clip-text text-transparent mb-6">
              Leadership That Delivers
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-slate-200 hover:border-orange-300">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-2xl group-hover:scale-110 transition-transform">
                AK
              </div>
              <h4 className="text-2xl font-bold text-slate-900 text-center mb-3">Amit Kumar</h4>
              <p className="text-orange-600 font-semibold text-center mb-6">Founder & CEO</p>
              <p className="text-slate-600 text-center leading-relaxed">20+ years in corporate law and business consulting. Passionate about simplifying compliance for startups.</p>
            </div>
            <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-slate-200 hover:border-orange-300">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-2xl group-hover:scale-110 transition-transform">
                RS
              </div>
              <h4 className="text-2xl font-bold text-slate-900 text-center mb-3">Riya Sharma</h4>
              <p className="text-emerald-600 font-semibold text-center mb-6">Head of Operations</p>
              <p className="text-slate-600 text-center leading-relaxed">Expert in GST compliance and MCA filings. Ensures every client gets timely delivery.</p>
            </div>
            <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-slate-200 hover:border-orange-300">
              <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-sky-400 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-2xl group-hover:scale-110 transition-transform">
                VK
              </div>
              <h4 className="text-2xl font-bold text-slate-900 text-center mb-3">Vikram Singh</h4>
              <p className="text-sky-600 font-semibold text-center mb-6">Technical Lead</p>
              <p className="text-slate-600 text-center leading-relaxed">Manages our automation systems and client portal. Making business setup digital-first.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Star className="w-24 h-24 text-orange-500 mx-auto mb-8 opacity-75" />
          <h2 className="font-heading text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-slate-100 to-orange-300 bg-clip-text text-transparent">
            Ready to Start Your Business Journey?
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 5000+ entrepreneurs who've trusted Wealthora for their business milestones.
          </p>
          <a href="/services" className="inline-flex items-center gap-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 px-12 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-orange-500/50 hover:-translate-y-2 transition-all duration-300 border border-orange-400/50 backdrop-blur-sm">
            Explore Our Services →
          </a>
        </div>
      </section>
    </>
  );
}

