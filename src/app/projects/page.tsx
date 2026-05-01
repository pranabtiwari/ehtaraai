'use client';

import { useEffect, useState } from 'react';

type ProjectMember = {
  user?:
    | {
        _id?: string;
        name?: string;
        email?: string;
      }
    | string;
  role?: string;
};

type ProjectItem = {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  members?: ProjectMember[];
  createdAt?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/projects', {
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load projects');
      }

      setProjects(data);
    } catch (err) {
      setProjects([]);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) return;

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch('/api/projects', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project');
      }

      setName('');
      setDescription('');
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur-xl sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-200">
            Projects
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Manage your workspaces.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            This page talks only to the projects backend route and uses the auth
            cookies already set by your login flow.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-4xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">
              Create project
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Create a new project and it will automatically include you as the
              first member.
            </p>

            {error && (
              <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-200">
                  Project name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Website redesign"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-200">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this project about?"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? 'Creating...' : 'Create project'}
              </button>
            </div>
          </form>

          <section className="flex flex-col rounded-4xl border border-white/10 bg-white/90 p-6 text-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.35)] sm:p-8 lg:h-[calc(100vh-7rem)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                  Your projects
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Current workspace list
                </h2>
              </div>
              <button
                type="button"
                onClick={loadProjects}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Refresh
              </button>
            </div>

            <div className="mt-6 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  No projects yet. Create your first one on the left.
                </div>
              ) : (
                projects.map((project) => (
                  <article
                    key={project._id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {project.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {project.description || 'No description provided.'}
                        </p>
                      </div>
                      <span className="inline-flex w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                        {project.status || 'active'}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-600">
                        Members: {project.members?.length || 0}
                      </span>
                      {project.createdAt && (
                        <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-600">
                          Created{' '}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {project.members?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.members.map((member, index) => {
                          const user = member.user;
                          const label =
                            typeof user === 'string'
                              ? user
                              : user?.name ||
                                user?.email ||
                                `Member ${index + 1}`;

                          return (
                            <span
                              key={
                                typeof user === 'string'
                                  ? user
                                  : user?._id || index
                              }
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                              {label}
                              {member.role ? ` · ${member.role}` : ''}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
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
