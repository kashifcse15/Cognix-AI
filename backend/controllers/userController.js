import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import Chat from "../models/Chat.js";

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}

export const registerUser = async (req,res) =>{ // API to register User
    const {name,email,password} = req.body;

    try{
        const userExists=await User.findOne({email});
        if(userExists){
            return res.json({success:false, message:'User Already exists'})
        }
        const user=await User.create({name,email,password});
        const token = generateToken(user._id);
        res.json({success:true, token});
    }
    catch(error){
        return res.json({success:false, message:error.message});
    }
}

export const loginUser=async (req,res)=>{ // if user already there & try to login
    const {email,password} = req.body;
    try {
        const user=await User.findOne({email});
        if(user){
            const isMatch=await bcrypt.compare(password, user.password);
            if(isMatch){
                const token=generateToken(user._id);
                return res.json({success:true, token})
            }
        }
        return res.json({success:false, message:"Invalid EMAIL or PASSWORD"});
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}

export const getUser=async (req,res)=>{ //API to get User data
    try {
        const user=req.user;
        return res.json({success:true,user});
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}

//API to get Published Images
export const getPublishedImages=async(req,res)=>{
    try {
        const publishedImagesMessages=await Chat.aggregate([
            {$unwind :"$messages"}, //breaks the array
            {
                $match :{  //mongodb checks every msg where this two are true
                "messages.isImage":true,
                "messages.isPublished":true
            }
        },
        {
            $project:{  //we dont need everything just this 3 , (normally mongodb send id also)
                _id:0, // but we dont need id
                imageUrl: "$messages.content",
                userName: "$userName"
            }
        }
        ])
        res.json({success:true, images:publishedImagesMessages.reverse()});
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}