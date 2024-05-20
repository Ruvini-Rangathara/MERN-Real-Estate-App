import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoute from "./route/user.route.js";
import authRoute from "./route/auth.route.js";
import cookieParser from 'cookie-parser';
import listingRoute from "./route/listing.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

mongoose.connect(process.env.MONGO).then(r => {
    console.log('Connected to MongoDB!!');
}).catch(e => {
    console.log('Error connecting to MongoDB!! Error: ', e);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000!!');
});

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/listing', listingRoute)


// Error handling middleware (should be placed in the end)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});