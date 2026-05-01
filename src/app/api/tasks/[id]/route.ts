import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';
import '@/models/user';
import { getUserFromToken } from '@/lib/getUser';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
  await connectDB();

  const user: any = getUserFromToken(req);

  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id } = await params;

  const task = await Task.findById(id);

  if (!task) {
    return Response.json({ message: 'Task not found' }, { status: 404 });
  }

  if (task.projectId) {
    const project = await Project.findOne({
      _id: task.projectId,
      'members.user': user.id,
    });

    if (!project) {
      return Response.json({ message: 'Forbidden' }, { status: 403 });
    }
  }

  if (body.title !== undefined) task.title = body.title;
  if (body.description !== undefined) task.description = body.description;
  if (body.status !== undefined) task.status = body.status;
  if (body.assignedTo !== undefined) task.assignedTo = body.assignedTo;
  if (body.projectId !== undefined) task.projectId = body.projectId;
  if (body.dueDate !== undefined) task.dueDate = body.dueDate;

  await task.save();

  await task.populate('projectId', 'name');
  await task.populate('assignedTo', 'name email');

  return Response.json(task);
}
