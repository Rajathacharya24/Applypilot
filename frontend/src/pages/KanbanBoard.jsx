import { useEffect, useState, useMemo } from 'react';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import AddApplicationModal from '../components/AddApplicationModal';
import EditApplicationModal from '../components/EditApplicationModal';
import ViewApplicationModal from '../components/ViewApplicationModal';
import StatusColumn from '../components/StatusColumn';
import StatsBanner from '../components/StatsBanner';
import ToastNotification from '../components/ToastNotification';
import { apiClient } from '../services/apiClient';
import { APPLICATION_STATUSES } from '../utils/statuses';
import { useAuth } from '../context/AuthContext';

export default function KanbanBoard() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState(null);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewApp, setViewApp] = useState(null);
  const [editApp, setEditApp] = useState(null);
  const [deleteApp, setDeleteApp] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [appsRes, statsRes] = await Promise.all([
        apiClient.get('/applications'),
        apiClient.get('/applications/stats').catch(() => ({ data: null })),
      ]);
      setApplications(appsRes.data || []);
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load applications pipeline.');
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      const statsRes = await apiClient.get('/applications/stats');
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (e) {
      // Ignore stats error on background refresh
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search and status filtering logic
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !searchQuery ||
        app.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.roleTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.source?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const groupedApplications = useMemo(() => {
    return APPLICATION_STATUSES.reduce((accumulator, status) => {
      accumulator[status] = filteredApplications.filter((application) => application.status === status);
      return accumulator;
    }, {});
  }, [filteredApplications]);

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
      showToast(`Moved ${currentApplication.companyName} to ${nextStatus}`);
      refreshStats();
    } catch (updateError) {
      setApplications(previousApplications);
      showToast(updateError?.response?.data?.message || 'Unable to update status.', 'error');
    }
  };

  const handleAddApplication = async (payload) => {
    const response = await apiClient.post('/applications', payload);
    setApplications((current) => [response.data, ...current]);
    showToast(`Added ${response.data.companyName} application`);
    refreshStats();
  };

  const handleEditApplication = async (id, payload) => {
    const response = await apiClient.put(`/applications/${id}`, payload);
    setApplications((current) =>
      current.map((app) => (app.id === id ? response.data : app)),
    );
    showToast(`Updated ${response.data.companyName} details`);
    refreshStats();
  };

  const handleDeleteApplication = async (id) => {
    const target = applications.find((a) => a.id === id);
    try {
      await apiClient.delete(`/applications/${id}`);
      setApplications((current) => current.filter((app) => app.id !== id));
      setDeleteApp(null);
      showToast(`Deleted ${target?.companyName || 'application'}`);
      refreshStats();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete application.', 'error');
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 via-sky-50/30 to-indigo-50/40">
      <div className="mx-auto max-w-[1700px]">
        {/* Header Ribbon */}
        <header className="mb-6 rounded-[2.5rem] border border-white/80 bg-white/80 px-6 py-5 shadow-soft backdrop-blur-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-xl shadow-md">
                AP
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.35em] text-sky-700">ApplyPilot</p>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                  Job Pipeline & Tracker
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {user?.email || 'Authenticated User'}
              </div>

              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-slate-800 hover:scale-105 active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Add Application
              </button>
              
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Live Metrics Stats Banner */}
        <StatsBanner stats={stats} />

        {/* Controls: Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/70 p-4 shadow-soft backdrop-blur-md">
          <div className="relative w-full sm:w-80">
            <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search company, role, source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">Filter by Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none transition shadow-sm"
            >
              <option value="">All Statuses</option>
              {APPLICATION_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            {(searchQuery || statusFilter) ? (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setStatusFilter(''); }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition px-2"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>

        {/* Global Error Banner */}
        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {/* Kanban Columns */}
        {loading ? (
          <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white/70 p-16 text-center text-sm font-semibold text-slate-400 shadow-soft">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800 mb-3"></div>
            <p>Loading application pipeline...</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
              {APPLICATION_STATUSES.map((status) => (
                <StatusColumn
                  key={status}
                  status={status}
                  applications={groupedApplications[status]}
                  onView={(app) => setViewApp(app)}
                  onEdit={(app) => setEditApp(app)}
                  onDelete={(app) => setDeleteApp(app)}
                />
              ))}
            </div>
          </DndContext>
        )}
      </div>

      {/* Modals */}
      <AddApplicationModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddApplication}
      />

      <ViewApplicationModal
        open={Boolean(viewApp)}
        application={viewApp}
        onClose={() => setViewApp(null)}
        onEdit={(app) => setEditApp(app)}
        onDelete={(app) => setDeleteApp(app)}
      />

      <EditApplicationModal
        open={Boolean(editApp)}
        application={editApp}
        onClose={() => setEditApp(null)}
        onSubmit={handleEditApplication}
      />

      {/* Delete Confirmation Modal */}
      {deleteApp ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-white/80 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-950">Delete Application?</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-800">{deleteApp.roleTitle}</span> at <span className="font-bold text-slate-800">{deleteApp.companyName}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteApp(null)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteApplication(deleteApp.id)}
                className="rounded-2xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Toast Feedback */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}