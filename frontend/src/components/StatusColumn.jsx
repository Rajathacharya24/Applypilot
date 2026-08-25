import { useDroppable } from '@dnd-kit/core';
import ApplicationCard from './ApplicationCard';
import { STATUS_LABELS } from '../utils/statuses';

export default function StatusColumn({ status, applications }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[28rem] flex-1 flex-col rounded-[1.75rem] border p-4 shadow-sm transition ${
        isOver ? 'border-sky-400 bg-sky-50/80' : 'border-slate-200 bg-white/85'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            {STATUS_LABELS[status]}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{applications.length} applications</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {status}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {applications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}

        {applications.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-center text-sm text-slate-400">
            Drop applications here
          </div>
        ) : null}
      </div>
    </section>
  );
}