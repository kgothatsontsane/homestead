import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

// Function to create a new property
export const createProperty = asyncHandler(async (req, res) => {
    console.log("Received request to create property");
    const { data } = req.body;

    if (!data) {
        console.log("Request body does not contain data property");
        return res.status(400).json({ message: "Request body must contain data property" });
    }

    const {
        title,
        description,
        price,
        address,
        city,
        country,
        area,
        image,
        facilities,
        ownerEmail
    } = data;

    console.log("Request data:", data);

    // Validate required fields
    const requiredFields = {
        title, description, price, address, city,
        country, area, image, facilities, ownerEmail
    };

    const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missingFields.length > 0) {
        return res.status(400).json({ message: "All fields are required", missingFields });  
    }  

    console.log("Facilities data:", facilities);

    try {
        const property = await prisma.property.create({
            data: {
                title,
                description,
                price,
                address,
                city,
                country,
                area,
                image,
                facilities: facilities,
                owner: { connect: { email: ownerEmail } }
            }
        });

        console.log("Property created successfully:", property);
        res.status(201).json({ message: "Property created successfully", property });
    } catch (error) {
        console.error("Error creating property:", error);
        if (error.code === "P2002") {
            res.status(409).json({ message: "A property with this address already exists" });
        } else {
            res.status(500).json({ message: "Property could not be created" });
        }
    }
});

// Function to retrieve all properties/documents
export const getAllProperties = asyncHandler(async (req, res) => {
    console.log("Received request to fetch all properties");
    try {
        const properties = await prisma.property.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        console.log("Properties fetched successfully:", properties);
        res.send(properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).send({ error: "An error occurred while fetching properties." });
    }
})

// Function to get specific properties/documents
export const getProperty = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("Received request to fetch property with ID:", id);

    try {
        const property = await prisma.property.findUnique({
            where: { id }
        });
        if (!property) {
            console.log("Property not found with ID:", id);
            return res.status(404).json({ message: "Property not found" });
        }
        console.log("Property fetched successfully:", property);
        res.send(property);
    } catch (error) {
        console.error("Error fetching property:", error);
        res.status(500).json({ message: "Property could not be fetched" });
    }
})