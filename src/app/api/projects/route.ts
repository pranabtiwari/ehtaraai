import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import '@/models/user';
import { getUserFromToken } from '@/lib/getUser';

export async function POST(req: Request) {
  await connectDB();

  const user: any = getUserFromToken(req);

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { name, description } = body;

  const project = await Project.create({
    name,
    description,
    createdBy: user.id,
    members: [{ user: user.id, role: 'member' }],
  });

  return Response.json(project);
}

export async function GET(req: Request) {
  await connectDB();

  const user: any = getUserFromToken(req);

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const projects = await Project.find({
    createdBy: user.id,
  }).populate('members.user', 'name email');

  return Response.json(projects);
}
