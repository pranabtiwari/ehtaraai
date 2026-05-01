import { connectDB } from '@/lib/db';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';

export const POST = async (req: Request) => {
  const { name, email, password } = await req.json();
  try {
    await connectDB();
    const extingUser = await User.findOne({ email });
    if (extingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return new Response(
      JSON.stringify({ message: 'User created successfully' }),
      { status: 201 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error creating user' }), {
      status: 500,
    });
  }
};
