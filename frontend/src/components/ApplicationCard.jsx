import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function ApplicationCard({ application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
    data: { application },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.55 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{application.companyName}</h3>
          <p className="mt-1 text-sm text-slate-600">{application.roleTitle}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {application.status}
        </span>
      </div>

      {application.source ? (
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
          Source: <span className="text-slate-700">{application.source}</span>
        </p>
      ) : null}

      {application.jobUrl ? (
        <a
          href={application.jobUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          Open listing
        </a>
      ) : null}
    </article>
  );
}