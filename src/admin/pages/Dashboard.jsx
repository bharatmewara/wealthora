import React from 'react';
import { Users, Briefcase, FileText, LayoutTemplate, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Enquiries', value: '3,214', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Converted Leads', value: '1,423', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Active Services', value: '24', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Published Blogs', value: '56', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts / Recent Leads */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-800">Enquiries Trend</h3>
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
            [Chart Component Placeholder]
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-800">Recent Activity</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-slate-700">New lead: Rohan Sharma</p>
                <p className="text-xs text-slate-500">2 mins ago • GST Registration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Blog Published</p>
                <p className="text-xs text-slate-500">1 hour ago • How to register a startup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
