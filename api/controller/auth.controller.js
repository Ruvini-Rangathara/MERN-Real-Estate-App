import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import {errorHandler} from "../util/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser) next(errorHandler(404, 'User not found!!'));
        const isValidPassword = await bcrypt.compare(password, validUser.password);
        if(!isValidPassword) next(errorHandler(401, 'Invalid Password!!'));

        const token = jwt.sign({
            id:validUser._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );

        const {password:pass, ...rest} = validUser._doc;

        res.cookie('access_token', token, {httpOnly:true}).status(200).json('User logged in successfully!!');

    }catch (e) {
        next(e);
    }
}