import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import {errorHandler} from "../util/error.js";

export const signup = async (req, res, next) => {
    console.log("user post request : ",req.body)

    const {username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({username, email, password:hashedPassword});

    try{
        await newUser.save();
        res.status(201).json('User created successfully!!');
    }catch(e){
        //manual error handling
        // next(errorHandler(550, 'Error creating user!!'));

        //actual error handling
        next(e);
    }
}
