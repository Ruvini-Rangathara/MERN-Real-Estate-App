import User from "../model/user.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
    console.log("user post request : ",req.body)

    const {username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({username, email, password:hashedPassword});

    try{
        await newUser.save();
        res.status(201).json('User created successfully!!');
    }catch(e){
        res.status(500).json(e.message);
    }
}