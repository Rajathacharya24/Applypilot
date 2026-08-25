import { useEffect, useState } from 'react';

const initialForm = {
  companyName: '',
  roleTitle: '',
  source: '',
  jobUrl: '',
  outreachMessage: '',
};

export default function AddApplicationModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setError('');
      setSaving(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      await onSubmit({
        companyName: form.companyName.trim(),
        roleTitle: form.roleTitle.trim(),
        source: form.source.trim(),
        jobUrl: form.jobUrl.trim(),
        outreachMessage: form.outreachMessage.trim(),
      });
      onClose();
    } catch (submissionError) {
      setError(submissionError?.response?.data?.message || submissionError.message || 'Unable to save application');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Add application</h2>
            <p className="mt-2 text-sm text-slate-500">Create a new card and place it into the pipeline.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={submitForm} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Company name
              <input
                value={form.companyName}
                onChange={updateField('companyName')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                placeholder="Acme Inc."
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Role title
              <input
                value={form.roleTitle}
                onChange={updateField('roleTitle')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                placeholder="Frontend Engineer"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Source
              <input
                value={form.source}
                onChange={updateField('source')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                placeholder="LinkedIn"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Job URL
              <input
                value={form.jobUrl}
                onChange={updateField('jobUrl')}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                placeholder="https://..."
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Outreach message
            <textarea
              value={form.outreachMessage}
              onChange={updateField('outreachMessage')}
              className="min-h-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
              placeholder="Short note you sent to the recruiter or hiring manager"
            />
          </label>

          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Create card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}