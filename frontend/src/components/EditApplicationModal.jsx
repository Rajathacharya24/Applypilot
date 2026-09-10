import { useState, useEffect } from 'react';
import { APPLICATION_STATUSES } from '../utils/statuses';

export default function EditApplicationModal({ open, onClose, application, onSubmit }) {
  const [formData, setFormData] = useState({
    companyName: '',
    roleTitle: '',
    source: 'linkedin',
    jobUrl: '',
    outreachMessage: '',
    status: 'NEW',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (application) {
      setFormData({
        companyName: application.companyName || '',
        roleTitle: application.roleTitle || '',
        source: application.source || 'linkedin',
        jobUrl: application.jobUrl || '',
        outreachMessage: application.outreachMessage || '',
        status: application.status || 'NEW',
      });
    }
  }, [application]);

  if (!open || !application) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await onSubmit(application.id, formData);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 shadow-2xl transition-all sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">Edit Application</h2>
            <p className="text-xs text-slate-500">Update company, role, status, or outreach notes</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Role Title</label>
            <input
              type="text"
              name="roleTitle"
              required
              value={formData.roleTitle}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="indeed">Indeed</option>
                <option value="wellfound">Wellfound</option>
                <option value="referral">Referral</option>
                <option value="company_website">Company Website</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
              >
                {APPLICATION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Job Link (URL)</label>
            <input
              type="url"
              name="jobUrl"
              placeholder="https://..."
              value={formData.jobUrl}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Outreach / Notes</label>
            <textarea
              name="outreachMessage"
              rows="3"
              placeholder="Recruiter contact, notes, or cold message details..."
              value={formData.outreachMessage}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-slate-950 px-6 py-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
