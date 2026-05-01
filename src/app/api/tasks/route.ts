import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';
import '@/models/user';
import { getUserFromToken } from '@/lib/getUser';

export async function GET(req: Request) {
  await connectDB();

  const user: any = getUserFromToken(req);

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const projects = await Project.find({ 'members.user': user.id }, '_id');
  const projectIds = projects.map((project) => project._id);

  const tasks = await Task.find({
    $or: [{ projectId: { $in: projectIds } }, { assignedTo: user.id }],
  })
    .populate('projectId', 'name')
    .populate('assignedTo', 'name email');

  return Response.json(tasks);
}

export async function POST(req: Request) {
  await connectDB();

  const user: any = getUserFromToken(req);

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { title, description, status, projectId, assignedTo, dueDate } = body;

  if (!title?.trim()) {
    return new Response('Title is required', { status: 400 });
  }

  if (projectId) {
    const project = await Project.findOne({
      _id: projectId,
      'members.user': user.id,
    });

    if (!project) {
      return new Response('Project not found', { status: 404 });
    }
  }

  const task = await Task.create(body);

  task.title = title.trim();
  task.description = description;
  if (status) task.status = status;
  if (projectId) task.projectId = projectId;
  if (assignedTo) task.assignedTo = assignedTo;
  if (dueDate) task.dueDate = dueDate;

  await task.save();

  return Response.json(task);
}
