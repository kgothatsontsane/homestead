import express from 'express';
import { 
  createUser, 
  bookViewing, 
  getAllBookings, 
  cancelBookings, 
  favProperties, 
  allFavProperties, 
  updateUserMetadata, 
  updateUserRole,
  syncUserData    // Add this import
} from '../controllers/userController.js';
import { prisma } from '../config/prismaConfig.js';

const router = express.Router();

router.post('/register', createUser)
router.post("/bookViewing/:id", bookViewing)
router.post("/allBookings", getAllBookings)
router.post("/cancelBooking/:id", cancelBookings)
router.post("/favProperties/:rid", favProperties)
router.post("/allFavProperties/", allFavProperties)

// Add new route for user role management
router.post("/updateRole/:userId", updateUserMetadata);
router.post('/updateRole/:userId', updateUserRole);

// Add new routes for role verification
router.get('/clerk/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await clerkClient.users.getUser(userId);
    res.json({
      roles: user.unsafeMetadata?.roles || ['buyer'],
      activeRole: user.unsafeMetadata?.activeRole || 'buyer'
    });
  } catch (error) {
    console.error('Clerk user fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user data from Clerk' });
  }
});

router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      select: { roles: true, activeRole: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      roles: user.roles,
      activeRole: user.activeRole
    });
  } catch (error) {
    console.error('Database user fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user data from database' });
  }
});

// Move sync routes to API namespace
router.post("/api/users/sync-roles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { roles, primaryRole } = req.body;

    console.log('Syncing roles:', { userId, roles, primaryRole });

    if (!userId || !roles || !primaryRole) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        roles,
        primaryRole,
        lastRoleUpdate: new Date()
      },
      create: {
        clerkId: userId,
        roles,
        primaryRole,
        email: 'pending@example.com', // Temporary email
        username: `user_${userId}`, // Temporary username
        first_name: 'Pending',
        last_name: 'User'
      }
    });

    console.log('User updated:', user);
    res.json(user);
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Fix: Add the metadata update route with correct path
router.post("/api/users/:userId/metadata", async (req, res) => {
  const { userId } = req.params;
  const { publicMetadata } = req.body;

  try {
    // Update database
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        roles: publicMetadata.roles,
        primaryRole: publicMetadata.primaryRole,
        lastRoleUpdate: new Date()
      },
      create: {
        clerkId: userId,
        roles: publicMetadata.roles,
        primaryRole: publicMetadata.primaryRole,
        email: 'pending@example.com',
        username: `user_${userId}`,
        first_name: 'Pending',
        last_name: 'User'
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Metadata update failed:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/users/sync-profile/:userId", syncUserData);
router.post("/users/:userId/metadata", updateUserMetadata);

export { router as userRoute }