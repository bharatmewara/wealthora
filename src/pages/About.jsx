import React, { useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Users, Award, Target, Building2, ShieldCheck, Star } from 'lucide-react';
import { assetUrl } from '../lib/assetUrl';

const defaultAboutPage = {
  hero_title: 'About Wealthora',
  hero_subtitle: 'Trusted partner for 5000+ entrepreneurs. Simplifying business setup since 2018.',
  hero_tag: 'Our Story',
  mission_title: 'Empowering Indian Entrepreneurs',
  mission_body: 'Making company registration and compliance hassle-free. From Pvt Ltd to GST, we handle every milestone with precision.',
  benefits: [
    { title: '100% Compliance Guarantee', body: 'Government filings with zero errors.', icon: 'shield' },
    { title: '5+ Years Experience', body: 'Successfully served 5000+ businesses.', icon: 'award' }
  ],
  stats: [
    { value: '5000+', label: 'Happy Clients', color: 'orange' },
    { value: '5+', label: 'Years Experience', color: 'emerald' },
    { value: '98%', label: 'Success Rate', color: 'purple' },
    { value: '24/7', label: 'Support', color: 'sky' }
  ],
  team_title: 'Leadership That Delivers',
  team_tag: 'Meet The Team',
  team_members: [
    { initials: 'AK', name: 'Amit Kumar', role: 'Founder & CEO', bio: '20+ years in corporate law and business consulting. Passionate about simplifying compliance for startups.', color: 'orange' },
    { initials: 'RS', name: 'Riya Sharma', role: 'Head of Operations', bio: 'Expert in GST compliance and MCA filings. Ensures every client gets timely delivery.', color: 'emerald' },
    { initials: 'VK', name: 'Vikram Singh', role: 'Technical Lead', bio: 'Manages our automation systems and client portal. Making business setup digital-first.', color: 'sky' }
  ],
  cta_title: 'Ready to Start Your Business Journey?',
  cta_subtitle: "Join 5000+ entrepreneurs who've trusted Wealthora for their business milestones.",
  cta_button: 'Explore Our Services →',
  cta_url: '/services'
};

const mergeDefaults = (defaults, dbData = {}) => {
  const merged = JSON.parse(JSON.stringify(defaults)); // Deep copy
  Object.entries(dbData).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(defaults[key])) {
      merged[key] = Array.isArray(value) ? value : defaults[key];
    } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
      merged[key] = { ...defaults[key], ...value };
    } else {
      merged[key] = value;
    }
  });
  return merged;
};


export default function About() {
  const { state } = useAdmin();
  const dbSection = state.contentSections?.find((section) => section.section_key === 'about_page');
  const aboutSection = useMemo(() => mergeDefaults(defaultAboutPage, dbSection?.data), [dbSection]);


  const getColorClass = (color) => {
    if (!color) return 'from-orange-500 to-orange-400';

    const colors = {
      orange: 'from-orange-500 to-orange-400',
      emerald: 'from-emerald-500 to-emerald-400',
      sky: 'from-sky-500 to-sky-400'
    };
    return colors[color] || 'from-orange-500 to-orange-400';
  };

  if (state.loading) {
    return (
      <>
        {/* Hero Skeleton */}
        <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-orange-600 text-white py-32 overflow-hidden animate-pulse">
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-10 bg-white/10 rounded-full mx-auto mb-8 w-28"></div>
            <div className="h-20 bg-gradient-to-r from-slate-300/50 to-slate-400/50 rounded-2xl mx-auto mb-6 w-4/5 max-w-4xl blur-sm"></div>
            <div className="h-8 bg-slate-300/50 rounded-xl mx-auto w-3/5"></div>
          </div>
        </section>

        {/* Mission Skeleton */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 mb-20 animate-pulse">
              <div>
                <div className="h-12 bg-slate-200 rounded-2xl w-40 mb-8"></div>
                <div className="h-16 bg-slate-200 rounded-xl mb-6 w-3/4"></div>
                <div className="h-32 bg-slate-200 rounded-xl"></div>
              </div>
              <div className="grid gap-6">
                <div className="h-32 bg-slate-200 rounded-2xl p-6"></div>
                <div className="h-32 bg-slate-200 rounded-2xl p-6"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Skeleton */}
        <section className="py-20 bg-gradient-to-r from-orange-50 to-sky-50">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
          </div>
        </section>

        {/* Team Skeleton */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div className="h-96 bg-slate-200 rounded-3xl p-8"></div>
            <div className="h-96 bg-slate-200 rounded-3xl p-8"></div>
            <div className="h-96 bg-slate-200 rounded-3xl p-8"></div>
          </div>
        </section>

        {/* CTA Skeleton */}
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="h-24 bg-slate-700/50 rounded-full w-24 mx-auto mb-8"></div>
            <div className="h-16 bg-slate-300/30 rounded-2xl mb-6 w-3/4 mx-auto"></div>
            <div className="h-12 bg-slate-300/30 rounded-xl mx-auto w-2/3 mb-12"></div>
            <div className="h-16 bg-orange-600/80 rounded-3xl w-80 mx-auto"></div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-orange-600 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold uppercase tracking-wider border border-white/20 mb-8">
            {aboutSection.hero_tag}
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-slate-200 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl">
            {aboutSection.hero_title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed opacity-90">
            {aboutSection.hero_subtitle}
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
                {aboutSection.mission_title}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                {aboutSection.mission_body}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {(aboutSection.benefits || []).map((benefit, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-900 mb-2">{benefit.title}</h4>
                    <p className="text-slate-600">{benefit.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-sky-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {(aboutSection.stats || []).map((stat, i) => (
              <div key={i} className="group">
                <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-500 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </div>
                <div className="text-xl font-semibold text-slate-700">{stat.label}</div>
                <div className={`mt-2 w-24 h-1 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 rounded-full mx-auto group-hover:w-32 transition-all`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 text-emerald-600 rounded-full text-sm font-semibold uppercase tracking-wider border border-emerald-200/50 mb-6">
              {aboutSection.team_tag}
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 to-orange-600 bg-clip-text text-transparent mb-6">
              {aboutSection.team_title}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(aboutSection.team_members || []).map((member, i) => (
              <div key={i} className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-slate-200 hover:border-orange-300">
                <div className={`w-24 h-24 bg-gradient-to-br ${getColorClass(member.color)} rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-2xl group-hover:scale-110 transition-transform`}>
                  {member.initials}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 text-center mb-3">{member.name}</h4>
                <p className={`text-${member.color}-600 font-semibold text-center mb-6`}>{member.role}</p>
                <p className="text-slate-600 text-center leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Star className="w-24 h-24 text-orange-500 mx-auto mb-8 opacity-75" />
          <h2 className="font-heading text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-slate-100 to-orange-300 bg-clip-text text-transparent">
            {aboutSection.cta_title}
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            {aboutSection.cta_subtitle}
          </p>
          <a href={aboutSection.cta_url} className="inline-flex items-center gap-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 px-12 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-orange-500/50 hover:-translate-y-2 transition-all duration-300 border border-orange-400/50 backdrop-blur-sm">
            {aboutSection.cta_button}
          </a>
        </div>
      </section>
    </>
  );
}


