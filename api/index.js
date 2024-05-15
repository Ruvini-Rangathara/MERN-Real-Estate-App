import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoute from "./route/user.route.js";

const app = express();
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


