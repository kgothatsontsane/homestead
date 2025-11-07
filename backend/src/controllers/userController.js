import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createUserProfile = async (req, res) => {
  try {
    console.log('Received user data:', req.body);

    const userData = {
      clerkId: req.body.clerkId,
      email: req.body.email,
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      role: req.body.role
    };

    const user = await prisma.user.create({
      data: userData
    });

    console.log('User created:', user);
    res.status(201).json(user);
  } catch (error) {
    console.error('Failed to create user:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
};
