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

router.post('/sync-roles/:userId', async (req, res) => {
  const { userId } = req.params;
  const { roles, primaryRole } = req.body;

  try {
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        roles,
        primaryRole,
        lastUpdated: new Date()
      },
      create: {
        clerkId: userId,
        roles,
        primaryRole,
        // Don't set default role to 'buyer'
        lastUpdated: new Date()
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Role sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
