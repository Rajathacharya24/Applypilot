export default function ViewApplicationModal({ open, onClose, application, onEdit, onDelete }) {
  if (!open || !application) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const map = {
      NEW: 'bg-blue-100 text-blue-800 border-blue-200',
      APPLIED: 'bg-purple-100 text-purple-800 border-purple-200',
      MESSAGED: 'bg-amber-100 text-amber-800 border-amber-200',
      INTERVIEW: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      OFFER: 'bg-teal-100 text-teal-800 border-teal-200',
      REJECTED: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return map[status] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl border border-white/80 bg-white p-6 shadow-2xl transition-all sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-600 text-lg font-bold text-white shadow-md">
              {application.companyName ? application.companyName.charAt(0).toUpperCase() : 'J'}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950">{application.roleTitle}</h2>
              <p className="text-sm font-semibold text-slate-500">{application.companyName}</p>
            </div>
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

        <div className="mt-6 space-y-5 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">Status</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider ${getStatusBadge(application.status)}`}>
              {application.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-500">Source Platform</span>
            <span className="font-medium text-slate-800 capitalize">{application.source || 'Manual'}</span>
          </div>

          {application.jobUrl ? (
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Job Link</span>
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 underline"
              >
                View Listing
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ) : null}

          {application.outreachMessage ? (
            <div>
              <span className="block font-semibold text-slate-500 mb-1.5">Outreach / Application Notes</span>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-slate-700 whitespace-pre-wrap leading-relaxed">
                {application.outreachMessage}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
            <div>
              <span className="block font-medium text-slate-400">Created</span>
              <span className="font-semibold text-slate-700">{formatDate(application.createdAt)}</span>
            </div>
            <div>
              <span className="block font-medium text-slate-400">Last Updated</span>
              <span className="font-semibold text-slate-700">{formatDate(application.lastUpdated)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(application);
            }}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
          >
            Delete Application
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(application);
              }}
              className="rounded-2xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
