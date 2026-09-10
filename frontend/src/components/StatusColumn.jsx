import { useDroppable } from '@dnd-kit/core';
import ApplicationCard from './ApplicationCard';
import { STATUS_LABELS } from '../utils/statuses';

export default function StatusColumn({ status, applications = [], onView, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const getHeaderAccent = (st) => {
    switch (st) {
      case 'NEW':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'APPLIED':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'MESSAGED':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'INTERVIEW':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'OFFER':
        return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'REJECTED':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[30rem] flex-1 flex-col rounded-[2rem] border p-4.5 shadow-soft backdrop-blur transition-all duration-200 ${
        isOver
          ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-400/20'
          : 'border-white/70 bg-white/70 hover:bg-white/80'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100/80 pb-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            {STATUS_LABELS[status] || status}
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-400">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold border uppercase tracking-wider ${getHeaderAccent(status)}`}>
          {status}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        {applications.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs font-medium text-slate-400">
            Drag cards here
          </div>
        ) : null}
      </div>
    </section>
  );
}