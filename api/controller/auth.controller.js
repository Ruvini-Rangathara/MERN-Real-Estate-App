import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import {errorHandler} from "../util/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {

    const {username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({username, email, password:hashedPassword});
    try{
        await newUser.save();
        res.status(201).json('User created successfully!!');
    }catch(e){
        console.error(e.message)
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
        if(!validUser) return  next(errorHandler(404, 'User not found!!'));

        const isValidPassword = await bcrypt.compare(password, validUser.password);
        if(!isValidPassword) return next(errorHandler(401, 'Invalid Password!!'));

        const token = jwt.sign({
            id:validUser._id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );

        const {password:pass, ...rest} = validUser._doc;

        res.cookie('access_token', token, {httpOnly:true}).status(200).json(rest);

    }catch (e) {
        console.error(e.message)
        next(e);
    }
}

export const google = async (req, res, next) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if(user){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
            const {password:pass, ...rest} = user._doc;
            res.cookie('access_token', token, {httpOnly:true})
                .status(200)
                .json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                    email:req.body.email,
                    password:hashedPassword,
                    avatar:req.body.photo
                });
            await newUser.save();
            const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET);
            const {password:pass, ...rest} = newUser._doc;
            res.cookie('access_token', token, {httpOnly:true})
                .status(200)
                .json(rest);
        }
    }catch (e) {
        console.error(e.message)
        next(e);
    }
}


export const signout = async (req, res, next) => {
    try{
        res.clearCookie('access_token');
        res.status(200).json('User has been signed out...');
    }catch (e) {
        console.error(e.message)
        next(e)
    }
}