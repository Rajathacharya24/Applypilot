import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function ApplicationCard({ application, onView, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
    data: { application },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  const getSourceBadgeColor = (src) => {
    switch (src?.toLowerCase()) {
      case 'linkedin':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'indeed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'wellfound':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'referral':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="group relative rounded-2xl border border-white/80 bg-white/90 p-4.5 shadow-soft backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:bg-white"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm transition group-hover:scale-105">
              {application.companyName ? application.companyName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-slate-950 line-clamp-1">{application.companyName}</h3>
              <p className="text-xs font-semibold text-slate-500 line-clamp-1">{application.roleTitle}</p>
            </div>
          </div>

          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getSourceBadgeColor(application.source)}`}>
            {application.source || 'manual'}
          </span>
        </div>

        {application.outreachMessage ? (
          <p className="mt-3 rounded-xl bg-slate-50 p-2 text-xs text-slate-600 line-clamp-2 leading-relaxed border border-slate-100">
            "{application.outreachMessage}"
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <button
          type="button"
          onClick={() => onView && onView(application)}
          className="font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
        >
          View details
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(application);
            }}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Edit Application"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(application);
            }}
            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            title="Delete Application"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}