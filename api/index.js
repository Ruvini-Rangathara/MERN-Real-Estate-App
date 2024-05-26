import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoute from "./route/user.route.js";
import authRoute from "./route/auth.route.js";
import cookieParser from 'cookie-parser';
import listingRoute from "./route/listing.route.js";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

// Database Connection
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000 // 45 seconds timeout
}).then(() => {
    console.log('Connected to MongoDB!!');
}).catch(e => {
    console.error("Error connecting to MongoDB!!");
    console.error("URI: ", process.env.MONGO);
    console.error('Error: ', e.message);
});

// Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/listing', listingRoute);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware (should be placed at the end)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!!`);
});
