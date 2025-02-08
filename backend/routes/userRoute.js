import express from 'express';
import { createUser, bookViewing, getAllBookings, cancelBookings, favProperties, allFavProperties, updateUserMetadata } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', createUser)
router.post("/bookViewing/:id", bookViewing)
router.post("/allBookings", getAllBookings)
router.post("/cancelBooking/:id", cancelBookings)
router.post("/favProperties/:rid", favProperties)
router.post("/allFavProperties/", allFavProperties)

// Add new route for user role management
router.post("/updateRole/:userId", updateUserMetadata);

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

export { router as userRoute }