import { useEffect, useState } from 'react';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import AddApplicationModal from '../components/AddApplicationModal';
import StatusColumn from '../components/StatusColumn';
import { apiClient } from '../services/apiClient';
import { APPLICATION_STATUSES } from '../utils/statuses';
import { useAuth } from '../context/AuthContext';

function groupApplications(applications) {
  return APPLICATION_STATUSES.reduce((accumulator, status) => {
    accumulator[status] = applications.filter((application) => application.status === status);
    return accumulator;
  }, {});
}

export default function KanbanBoard() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const loadApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get('/applications');
      setApplications(response.data || []);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const applicationId = active.id;
    const nextStatus = over.id;
    const currentApplication = applications.find((application) => application.id === applicationId);

    if (!currentApplication || currentApplication.status === nextStatus) {
      return;
    }

    const previousApplications = applications;

    setApplications((current) =>
      current.map((application) =>
        application.id === applicationId ? { ...application, status: nextStatus } : application,
      ),
    );

    try {
      const response = await apiClient.patch(`/applications/${applicationId}/status`, {
        status: nextStatus,
      });

      setApplications((current) =>
        current.map((application) => (application.id === applicationId ? response.data : application)),
      );
    } catch (updateError) {
      setApplications(previousApplications);
      setError(updateError?.response?.data?.message || 'Unable to update application status.');
    }
  };

  const handleAddApplication = async (payload) => {
    const response = await apiClient.post('/applications', payload);
    setApplications((current) => [response.data, ...current]);
  };

  const groupedApplications = groupApplications(applications);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 rounded-[2rem] border border-white/70 bg-white/80 px-6 py-5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-700">ApplyPilot</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Application pipeline</h1>
              <p className="mt-2 text-sm text-slate-500">
                Drag cards across columns to keep your search moving. {user?.email ? `Signed in as ${user.email}.` : ''}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Add application
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/75 p-10 text-center text-sm font-medium text-slate-500 shadow-soft">
            Loading applications...
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
              {APPLICATION_STATUSES.map((status) => (
                <StatusColumn key={status} status={status} applications={groupedApplications[status]} />
              ))}
            </div>
          </DndContext>
        )}
      </div>

      <AddApplicationModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddApplication}
      />
    </main>
  );
}