import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { propertyRoute } from './routes/propertyRoute.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000; // Ensure port is 8000

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use('/api/user', userRoute);
app.use('/api/property', propertyRoute);