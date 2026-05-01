'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type TaskItem = {
  _id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
  description?: string;
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
};

const statusLabels = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
} as const;

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/tasks', {
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load dashboard data');
        }

        setTasks(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard data',
        );
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const summary = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((task) => task.status === 'todo').length;
    const inProgress = tasks.filter(
      (task) => task.status === 'in-progress',
    ).length;
    const done = tasks.filter((task) => task.status === 'done').length;

    const overdue = tasks.filter((task) => {
      if (!task.dueDate || task.status === 'done') return false;
      return new Date(task.dueDate).getTime() < Date.now();
    });

    return { total, todo, inProgress, done, overdue };
  }, [tasks]);

  const overdueTasks = useMemo(
    () =>
      tasks
        .filter((task) => {
          if (!task.dueDate || task.status === 'done') return false;
          return new Date(task.dueDate).getTime() < Date.now();
        })
        .sort((left, right) => {
          const leftDue = left.dueDate ? new Date(left.dueDate).getTime() : 0;
          const rightDue = right.dueDate
            ? new Date(right.dueDate).getTime()
            : 0;
          return leftDue - rightDue;
        }),
    [tasks],
  );

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((left, right) => {
          const leftDate = left.dueDate ? new Date(left.dueDate).getTime() : 0;
          const rightDate = right.dueDate
            ? new Date(right.dueDate).getTime()
            : 0;
          return rightDate - leftDate;
        })
        .slice(0, 5),
    [tasks],
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-200">
                Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Tasks, status, overdue.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                A focused view of your work so you can see what is open, what is
                in progress, and what needs attention now.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/tasks"
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
                Open tasks
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
                View projects
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total tasks', value: summary.total },
            { label: 'To do', value: summary.todo },
            { label: 'In progress', value: summary.inProgress },
            { label: 'Done', value: summary.done },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">{item.label}</p>
              <div className="mt-3 text-3xl font-semibold text-white">
                {item.value}
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-4xl border border-white/10 bg-white/90 p-6 text-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.35)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                  Overdue
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Tasks that need attention
                </h2>
              </div>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                {summary.overdue.length} overdue
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  Loading dashboard...
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-700">
                  {error}
                </div>
              ) : overdueTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  No overdue tasks. Nice work.
                </div>
              ) : (
                overdueTasks.map((task) => (
                  <div
                    key={task._id}
                    className="rounded-3xl border border-rose-200 bg-rose-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {task.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                          {task.description || 'No description provided.'}
                        </p>
                      </div>
                      <span className="inline-flex w-fit rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                        Overdue
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-white px-3 py-1 font-medium">
                        Status: {statusLabels[task.status]}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 font-medium">
                        Due{' '}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : '—'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-4xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
                  Status
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Current work mix
                </h2>
              </div>
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
                {summary.total} total
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                {
                  label: 'To do',
                  value: summary.todo,
                  barClassName: 'bg-sky-400',
                },
                {
                  label: 'In progress',
                  value: summary.inProgress,
                  barClassName: 'bg-amber-400',
                },
                {
                  label: 'Done',
                  value: summary.done,
                  barClassName: 'bg-emerald-400',
                },
              ].map((item) => {
                const width = summary.total
                  ? Math.max((item.value / summary.total) * 100, 6)
                  : 0;

                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-white/10">
                      <div
                        className={`h-3 rounded-full ${item.barClassName}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
                Recent tasks
              </p>
              <div className="mt-4 space-y-3">
                {recentTasks.length === 0 ? (
                  <p className="text-sm text-slate-400">No tasks loaded yet.</p>
                ) : (
                  recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{task.title}</p>
                        <p className="text-xs text-slate-400">
                          {typeof task.projectId === 'string'
                            ? task.projectId
                            : task.projectId?.name || 'Unassigned'}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                        {statusLabels[task.status]}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
