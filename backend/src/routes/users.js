import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// Save user role
router.post('/', async (req, res) => {
  const { clerkId, email, role } = req.body;
  
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role },
      create: {
        email,
        role,
        clerkId
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// Get user role
router.get('/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId: req.params.userId }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
