import { clerkClient } from "@clerk/clerk-sdk-node";

export const initializeClerk = () => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not set in environment variables");
  }

  return clerkClient;
};

export default clerkClient;
