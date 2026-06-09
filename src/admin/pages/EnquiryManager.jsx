import React, { useCallback, useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import { useAdmin } from '../../contexts/AdminContext';

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

const csvHeaders = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['city', 'City'],
  ['business_type', 'Business Type'],
  ['source', 'Source'],
  ['status', 'Status'],
  ['message', 'Message'],
  ['created_at', 'Created At'],
];

function exportLeadsToCSV(rows) {
  const csvRows = [
    csvHeaders.map(([, label]) => label),
    ...rows.map((item) => csvHeaders.map(([key]) => {
      if (key === 'created_at' && item[key]) {
        return new Date(item[key]).toLocaleString();
      }
      return item[key] || '';
    })),
  ];
  const csv = csvRows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function EnquiryManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { http } = useAdmin();

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      // Using the new v2 API
      const res = await http.get('/api/admin/enquiries');
      setData(res.data.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load enquiries.');
    } finally {
      setLoading(false);
    }
  }, [http]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const openManage = (lead) => {
    setSelectedLead({
      id: lead.id,
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      city: lead.city || '',
      business_type: lead.business_type || '',
      source: lead.source || 'website',
      status: lead.status || 'new',
      message: lead.message || '',
    });
    setError('');
  };

  const updateSelectedLead = (field, value) => {
    setSelectedLead((current) => ({ ...current, [field]: value }));
  };

  const saveLead = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { id, ...payload } = selectedLead;
      const res = await http.put(`/api/admin/enquiries/${id}`, payload);
      setData((current) => current.map((item) => (item.id === id ? res.data : item)));
      setSelectedLead(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to update lead.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => <div className="font-semibold text-slate-800">{info.getValue()}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => <div className="text-slate-500">{info.getValue() || 'N/A'}</div>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        const colors = {
          new: 'bg-blue-100 text-blue-700',
          contacted: 'bg-orange-100 text-orange-700',
          follow_up: 'bg-purple-100 text-purple-700',
          converted: 'bg-emerald-100 text-emerald-700',
          lost: 'bg-slate-100 text-slate-700',
        };
        return (
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${colors[status] || colors.new}`}>
            {status}
          </span>
        );
      }
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => openManage(row.original)}
          className="text-sm font-semibold text-sky-600 hover:text-sky-800"
        >
          Manage
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Lead Manager</h2>
          <p className="text-sm text-slate-500">View and manage all customer enquiries.</p>
        </div>
        <button
          type="button"
          onClick={() => exportLeadsToCSV(data)}
          disabled={!data.length}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Download size={16} />
          Export Leads CSV
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <DataTable data={data} columns={columns} loading={loading} />

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form onSubmit={saveLead} className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Manage Lead</h3>
                <p className="text-sm text-slate-500">{selectedLead.name || 'Unnamed lead'}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid max-h-[70vh] gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Name
                <input
                  value={selectedLead.name}
                  onChange={(event) => updateSelectedLead('name', event.target.value)}
                  required
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Phone
                <input
                  value={selectedLead.phone}
                  onChange={(event) => updateSelectedLead('phone', event.target.value)}
                  required
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Email
                <input
                  type="email"
                  value={selectedLead.email}
                  onChange={(event) => updateSelectedLead('email', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Status
                <select
                  value={selectedLead.status}
                  onChange={(event) => updateSelectedLead('status', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                City
                <input
                  value={selectedLead.city}
                  onChange={(event) => updateSelectedLead('city', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Business Type
                <input
                  value={selectedLead.business_type}
                  onChange={(event) => updateSelectedLead('business_type', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700 sm:col-span-2">
                Source
                <input
                  value={selectedLead.source}
                  onChange={(event) => updateSelectedLead('source', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700 sm:col-span-2">
                Message
                <textarea
                  rows={4}
                  value={selectedLead.message}
                  onChange={(event) => updateSelectedLead('message', event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {saving ? 'Saving...' : 'Save Lead'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
