import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'
import { isValid, parse, format } from 'date-fns'

// Function to create a new user
export const createUser = asyncHandler(async (req, res) => {
  console.log("Creating a user");

  let { email, password, name } = req.body;

  // Validate and sanitize input
  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) {
      const user = await prisma.user.create({
        data: { email, password, name },
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
  } catch (err) {
    console.error("Error creating user:", err.message);
    if (err.code === 'P2002') { // Prisma unique constraint violation error code
      res.status(409).json({ message: "Duplicate entry" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// Function to book a viewing for a user
export const bookViewing = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;
  console.log(`Booking viewing for user: ${email} on property ID: ${id} for date: ${date}`);

  // Validate and sanitize input
  if (!email || !date || !id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate date format
  const dateFormats = ['dd/MM/yy', 'yyyy-MM-dd', 'MM/dd/yyyy'];
  let parsedDate;
  for (const formatString of dateFormats) {
    parsedDate = parse(date, formatString, new Date());
    if (isValid(parsedDate)) {
      break;
    }
  }

  if (!isValid(parsedDate)) {
    return res.status(400).json({ message: "Invalid date format. Use DD/MM/YY, YYYY-MM-DD, or MM/DD/YYYY format." });
  }

  const formattedDate = format(parsedDate, 'yyyy-MM-dd');

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedViewings: true }
    });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const property = await prisma.property.findUnique({
      where: { id }
    });
    if (!property) {
      console.log("Property not found with ID:", id);
      return res.status(404).json({ message: "Property not found" });
    }

    if (user.bookedViewings.some((viewing) => viewing.id === id)) {
      console.log("User has already booked to view this property:", id);
      res.status(404).json({ message: "You have already booked to view this property" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedViewings: {
            push: {
              id, date: formattedDate
            }
          }
        }
      });
      console.log(`Viewing booked successfully for user: ${email} on property ID: ${id} for date: ${formattedDate}`);
      res.status(200).json({ message: "Your viewing has been booked successfully", booking: { propertyId: id, date: formattedDate } });
    }
  } catch (err) {
    console.error("Error booking viewing:", err.message);
    if (err.code === 'P2002') { // Prisma unique constraint violation error code
      res.sendStatus(409).json({ message: "Duplicate entry" });
    } else {
      res.sendStatus(500).json({ message: "Internal server error" });
    }
  }
})

// Function to retrieve all bookings for a user
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body
  console.log(`Fetching all bookings for user: ${email}`);

  // Validate and sanitize input
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedViewings: true }
    });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }
    if (user.bookedViewings.length === 0) {
      console.log("No bookings found for user:", email);
      return res.status(404).json({ message: "No bookings found" });
    }
    console.log("Bookings fetched successfully for user:", email);
    res.status(200).json(user.bookedViewings)
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
})

// Function to cancel bookings (cancelBookings)
export const cancelBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params
  console.log(`Cancelling booking for user: ${email} on property ID: ${id}`);

  // Validate and sanitize input
  if (!email || !id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedViewings: true }
    });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const property = await prisma.property.findUnique({
      where: { id }
    });
    if (!property) {
      console.log("Property not found with ID:", id);
      return res.status(404).json({ message: "Property not found" });
    }

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
      console.log(`Booking cancelled successfully for user: ${email} on property ID: ${id}`);
      res.status(200).json({ message: "Your booking was cancelled successfully", booking: { propertyId: id } })
    }
  } catch (err) {
    console.error("Error cancelling booking:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
})

// Function to add a residency to favorites
export const favProperties = asyncHandler(async (req, res) => {
  const { email } = req.body; // extracting email from the request body
  const { rid } = req.params;
  console.log(`Updating favorite properties for user: ${email} with property ID: ${rid}`);

  // Validate and sanitize input
  if (!email || !rid) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const property = await prisma.property.findUnique({
      where: { id: rid }
    });
    if (!property) {
      console.log("Property not found with ID:", rid);
      return res.status(404).json({ message: "Property not found" });
    }

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
      console.log(`Property removed from favorites for user: ${email} with property ID: ${rid}`);
      res.status(200).json({ message: "Property removed from favorites", user: updateUser })
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
      console.log(`Property added to favorites for user: ${email} with property ID: ${rid}`);
      res.status(200).json({ message: "Property added to favorites", user: updateUser })
    }
  } catch (err) {
    console.error("Error updating favorite properties:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
})

// Function to get all favorite Properties for a user
export const allFavProperties = asyncHandler(async (req, res) => {
  const { email } = req.body
  console.log(`Fetching all favorite properties for user: ${email}`);

  // Validate and sanitize input
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { favPropertiesID: true }
    });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }
    if (user.favPropertiesID.length === 0) {
      console.log("No favorite properties found for user:", email);
      return res.status(404).json({ message: "No favorite properties found" });
    }
    console.log("Favorite properties fetched successfully for user:", email);
    res.status(200).json(user.favPropertiesID)
  } catch (err) {
    console.error("Error fetching favorite properties:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
})