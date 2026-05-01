'use client';

import { useEffect, useMemo, useState } from 'react';

type ProjectOption = {
  _id: string;
  name: string;
};

type TaskItem = {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
  projectId?:
    | {
        _id?: string;
        name?: string;
      }
    | string;
  assignedTo?:
    | {
        _id?: string;
        name?: string;
        email?: string;
      }
    | string;
  createdAt?: string;
};

const statusOptions = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
] as const;

export default function TasksPage() {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskItem['status']>('todo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const readResponse = async (response: Response) => {
    const text = await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  };

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((left, right) => left.title.localeCompare(right.title)),
    [tasks],
  );

  const loadProjects = async () => {
    const response = await fetch('/api/projects', {
      credentials: 'include',
    });
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to load projects');
    }

    setProjects(data);
  };

  const loadTasks = async () => {
    const response = await fetch('/api/tasks', {
      credentials: 'include',
    });
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to load tasks');
    }

    setTasks(data);
  };

  const refresh = async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([loadProjects(), loadTasks()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !projectId) return;

    try {
      setSaving(true);
      setError('');

      const response = await fetch('/api/tasks', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description,
          projectId,
          dueDate: dueDate || undefined,
          status,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create task');
      }

      setTitle('');
      setDescription('');
      setProjectId('');
      setDueDate('');
      setStatus('todo');
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    nextStatus: TaskItem['status'],
  ) => {
    try {
      setError('');

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update task');
      }

      setTasks((current) =>
        current.map((task) =>
          task._id === taskId ? { ...task, status: nextStatus } : task,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur-xl sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-200">
            Tasks
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Track work across your projects.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Create tasks inside one of your projects, then move them through
            status updates with backend-powered saves.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <form
            onSubmit={handleCreateTask}
            className="rounded-4xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">Create task</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Pick a project first, then add the task details.
            </p>

            {error && (
              <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-4 ">
              <div>
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-200">
                  Task title
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Review landing page copy"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="project"
                  className="text-sm font-medium text-slate-200">
                  Project
                </label>
                <select
                  id="project"
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10">
                  <option value="" className="text-slate-900">
                    Select a project
                  </option>
                  {projects.map((project) => (
                    <option
                      key={project._id}
                      value={project._id}
                      className="text-black">
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-200">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Add any task notes or requirements"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-slate-200">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as TaskItem['status'])
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10">
                    {statusOptions.map((option) => (
                      <option className='text-black' key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dueDate"
                    className="text-sm font-medium text-slate-200">
                    Due date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || projects.length === 0}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70">
                {saving ? 'Creating...' : 'Create task'}
              </button>
            </div>
          </form>

          <section className="flex flex-col rounded-4xl border border-white/10 bg-white/90 p-6 text-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.35)] sm:p-8 lg:h-[calc(110vh-1rem)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                  Task list
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Active work items
                </h2>
              </div>

              <button
                type="button"
                onClick={refresh}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Refresh
              </button>
            </div>

            <div className="mt-6 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  Loading tasks...
                </div>
              ) : sortedTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  No tasks yet. Create one from the form on the left.
                </div>
              ) : (
                sortedTasks.map((task) => (
                  <article
                    key={task._id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {task.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {task.description || 'No description provided.'}
                        </p>
                      </div>
                      <span className="inline-flex w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                        {task.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-600">
                        Project:{' '}
                        {typeof task.projectId === 'string'
                          ? task.projectId
                          : task.projectId?.name || 'Unassigned'}
                      </span>
                      {task.dueDate && (
                        <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-600">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <label className="text-sm font-medium text-slate-700">
                        Update status
                      </label>
                      <select
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(
                            task._id,
                            event.target.value as TaskItem['status'],
                          )
                        }
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10">
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
