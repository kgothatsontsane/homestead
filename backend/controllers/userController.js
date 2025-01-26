import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

// Function to create a new user
export const createUser = asyncHandler(async (req, res) => {
  console.log("Creating a user");

  let { email, password, name } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (!userExists) {
    const user = await prisma.user.create({
      data: req.body,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });
    console.log("User created successfully:", user);
    res.status(201).json({
      message: "User Created Successfully",
      user: user,
    });
  } else {
    console.log("User already registered:", email);
    res.status(409).json({ message: "User already registered" });
  }
});

// Function to book a viewing for a user
export const bookViewing = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;
  console.log(`Booking viewing for user: ${email} on property ID: ${id} for date: ${date}`);

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedViewings: true }
    });
    if (alreadyBooked.bookedViewings.some((viewing) => viewing.id === id)) {
      console.log("User has already booked to view this property:", id);
      res.status(404).json({ message: "You have already booked to view this property" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedViewings: {
            push: {
              id, date
            }
          }
        }
      });
      console.log("Viewing booked successfully for user:", email);
      res.send("Your viewing has been booked successfully");
    }
  } catch (err) {
    console.error("Error booking viewing:", err.message);
    throw new Error(err.message);
  }
})

// Function to retrieve all bookings for a user
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body
  console.log(`Fetching all bookings for user: ${email}`);

  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedViewings: true }
    })
    console.log("Bookings fetched successfully for user:", email);
    res.status(202).send(bookings)
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    throw new Error(err.message)
  }
})

// Function to cancel bookings (cancelBookings)
export const cancelBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params
  console.log(`Cancelling booking for user: ${email} on property ID: ${id}`);

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedViewings: true }
    })
    const index = user.bookedViewings.findIndex((viewing) => viewing.id === id)
    if (index === -1) {
      console.log("Booking not found for property ID:", id);
      res.status(404).json({ message: "The booking was not found" })
    } else {
      user.bookedViewings.splice(index, 1)
      await prisma.user.update({
        where: { email },
        data: { bookedViewings: user.bookedViewings }
      })
      console.log("Booking cancelled successfully for user:", email);
      res.send("Your booking was cancelled successfully")
    }
  } catch (err) {
    console.error("Error cancelling booking:", err.message);
    throw new Error(err.message)
  }
})

// Function to add a residency to favorites
export const favProperties = asyncHandler(async (req, res) => {
  const { email } = req.body; // extracting email from the request body
  const { rid } = req.params;
  console.log(`Updating favorite properties for user: ${email} with property ID: ${rid}`);

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user.favPropertiesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favPropertiesID: {
            set: user.favPropertiesID.filter((id) => id !== rid)
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          favPropertiesID: true
        }
      })
      console.log("Property removed from favorites for user:", email);
      res.send({ message: "Property removed from favorites", user: updateUser })
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favPropertiesID: {
            push: rid
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          favPropertiesID: true
        }
      })
      console.log("Property added to favorites for user:", email);
      res.send({ message: "Property added to favorites", user: updateUser })
    }
  } catch (err) {
    console.error("Error updating favorite properties:", err.message);
    throw new Error(err.message)
  }
})

// Function to get all favorite Properties for a user
export const allFavProperties = asyncHandler(async (req, res) => {
  const { email } = req.body
  console.log(`Fetching all favorite properties for user: ${email}`);

  try {
    const favResd = await prisma.user.findUnique({
      where: { email },
      select: { favPropertiesID: true }
    })
    console.log("Favorite properties fetched successfully for user:", email);
    res.status(200).send(favResd)
  } catch (err) {
    console.error("Error fetching favorite properties:", err.message);
    throw new Error(err.message)
  }
})