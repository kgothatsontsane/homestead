import express from 'express';
import { createUser, bookViewing, getAllBookings, cancelBookings, favProperties, allFavProperties } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', createUser)
router.post("/bookViewing/:id", bookViewing)
router.post("/allBookings", getAllBookings)
router.post("/cancelBooking/:id", cancelBookings)
router.post("/favProperties/:rid", favProperties)
router.post("/allFavProperties/", allFavProperties)

export { router as userRoute }