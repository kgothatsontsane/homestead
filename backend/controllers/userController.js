import { isValid, parse } from "date-fns";
import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

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
          updatedAt: true,
        },
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
    if (err.code === "P2002") {
      // Prisma unique constraint violation error code
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
  console.log(
    `Booking viewing for user: ${email} on property ID: ${id} for date: ${date}`
  );

  // Validate and sanitize input
  if (!email || !date || !id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate date format
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  if (!isValid(parsedDate)) {
    return res.status(400).json({
      message: "Invalid date format. Use YYYY-MM-DD format (e.g. 2024-01-31).",
    });
  }

  // No need for additional formatting since input is already in correct format
  const formattedDate = date;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedViewings: true },
    });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const property = await prisma.property.findUnique({
      where: { id },
    });
    if (!property) {
      console.log("Property not found with ID:", id);
      return res.status(404).json({ message: "Property not found" });
    }

    if (user.bookedViewings.some((viewing) => viewing.id === id)) {
      console.log("User has already booked to view this property:", id);
      res
        .status(404)
        .json({ message: "You have already booked to view this property" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedViewings: {
            push: {
              id,
              date: formattedDate,
            },
          },
        },
      });
      console.log(
        `Viewing booked successfully for user: ${email} on property ID: ${id} for date: ${formattedDate}`
      );
      res
        .status(200)
        .json({
          message: "Your viewing has been booked successfully",
          booking: { propertyId: id, date: formattedDate },
        });
    }
  } catch (err) {
    console.error("Error booking viewing:", err.message);
    if (err.code === "P2002") {
      // Prisma unique constraint violation error code
      res.status(409).json({ message: "Duplicate entry" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// Function to retrieve all bookings for a user
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(`Fetching all bookings for user: ${email}`);

  // Validate and sanitize input
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedViewings: true },
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
    res.status(200).json(user.bookedViewings);
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Function to cancel bookings (cancelBookings)
export const cancelBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  console.log(`Cancelling booking for user: ${email} on property ID: ${id}`);

  // Validate and sanitize input
  if (!email || !id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedViewings: true },
    });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const property = await prisma.property.findUnique({
      where: { id },
    });
    if (!property) {
      console.log("Property not found with ID:", id);
      return res.status(404).json({ message: "Property not found" });
    }

    const index = user.bookedViewings.findIndex((viewing) => viewing.id === id);
    if (index === -1) {
      console.log("Booking not found for property ID:", id);
      res.status(404).json({ message: "The booking was not found" });
    } else {
      user.bookedViewings.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: { bookedViewings: user.bookedViewings },
      });
      console.log(
        `Booking cancelled successfully for user: ${email} on property ID: ${id}`
      );
      res
        .status(200)
        .json({
          message: "Your booking was cancelled successfully",
          booking: { propertyId: id },
        });
    }
  } catch (err) {
    console.error("Error cancelling booking:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Function to add a residency to favorites
export const favProperties = asyncHandler(async (req, res) => {
  const { email } = req.body; // extracting email from the request body
  const { rid } = req.params;
  console.log(
    `Updating favorite properties for user: ${email} with property ID: ${rid}`
  );

  // Validate and sanitize input
  if (!email || !rid) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const property = await prisma.property.findUnique({
      where: { id: rid },
    });
    if (!property) {
      console.log("Property not found with ID:", rid);
      return res.status(404).json({ message: "Property not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email },
        select: { favPropertiesID: true },
      });
      if (!user) {
        throw new Error("User not found");
      }

      if (user.favPropertiesID.includes(rid)) {
        return await tx.user.update({
          where: { email },
          data: {
            favPropertiesID: {
              set: user.favPropertiesID.filter((id) => id !== rid),
            },
          },
          select: {
            id: true,
            email: true,
            name: true,
            favPropertiesID: true,
          },
        });
      } else {
        return await tx.user.update({
          where: { email },
          data: {
            favPropertiesID: {
              push: rid,
            },
          },
          select: {
            id: true,
            email: true,
            name: true,
            favPropertiesID: true,
          },
        });
      }
    });

    if (result.favPropertiesID.includes(rid)) {
      console.log(
        `Property added to favorites for user: ${email} with property ID: ${rid}`
      );
      res
        .status(200)
        .json({ message: "Property added to favorites", user: result });
    } else {
      console.log(
        `Property removed from favorites for user: ${email} with property ID: ${rid}`
      );
      res
        .status(200)
        .json({ message: "Property removed from favorites", user: result });
    }
  } catch (err) {
    console.error("Error updating favorite properties:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Function to get all favorite Properties for a user
export const allFavProperties = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(`Fetching all favorite properties for user: ${email}`);

  // Validate and sanitize input
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { favPropertiesID: true },
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
    res.status(200).json(user.favPropertiesID);
  } catch (err) {
    console.error("Error fetching favorite properties:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add this new controller function
export const updateUserMetadata = async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({
      message: "User ID and role are required",
    });
  }

  try {
    // Update user metadata using Clerk's backend SDK
    const user = await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        role: role,
        updatedAt: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      message: "User role updated successfully",
      role: role,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

export const updateUserRoles = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { roles, activeRole } = req.body;

  if (!userId || !roles || !activeRole) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Update both Clerk metadata and database
    const [clerkUser, dbUser] = await Promise.all([
      clerkClient.users.updateUser(userId, {
        privateMetadata: {
          roles,
          activeRole,
          lastUpdated: new Date().toISOString(),
        },
      }),
      prisma.user.update({
        where: { clerkId: userId },
        data: {
          roles,
          activeRole,
          role: activeRole, // Keep legacy role field in sync
        },
      }),
    ]);

    res.status(200).json({
      message: "User roles updated successfully",
      user: dbUser,
    });
  } catch (error) {
    console.error("Error updating user roles:", error);
    res.status(500).json({ message: "Failed to update user roles" });
  }
});

export const switchActiveRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  if (!userId || !newRole) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Verify user has this role
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user.roles.includes(newRole)) {
      return res.status(400).json({ message: "User does not have this role" });
    }

    // Update both Clerk and database
    await Promise.all([
      clerkClient.users.updateUser(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          activeRole: newRole,
          lastUpdated: new Date().toISOString(),
        },
      }),
      prisma.user.update({
        where: { clerkId: userId },
        data: {
          activeRole: newRole,
          role: newRole, // Keep legacy role field in sync
        },
      }),
    ]);

    res.status(200).json({
      message: "Active role switched successfully",
      activeRole: newRole,
    });
  } catch (error) {
    console.error("Error switching active role:", error);
    res.status(500).json({ message: "Failed to switch active role" });
  }
});
