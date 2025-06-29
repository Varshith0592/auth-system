import {User} from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../brevo/emails.js'
import crypto from 'crypto'



export const signup=async(req,res)=>{
    try {
        const {email,password,name}=req.body
        if(!email||!password||!name){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            })
        }
        const isUserAlreadyExists=await User.findOne({email})
        if(isUserAlreadyExists){
            return res.status(404).json({
                success:false,
                message:"User already exists"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const verificationToken=Math.floor(100000+Math.random()*900000).toString()


        const user=new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt:Date.now()+24*60*60*1000
        })
        const savedUser=await user.save()

        const token=generateTokenAndSetCookie(res,user._id)

        await sendVerificationEmail(user.email,verificationToken)

        res.status(201).json({
            success:true,
            message:"Account Creation Successful",
            user:{
                ...user._doc,
                password:undefined
            }
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const isValidPassword=await bcrypt.compare(password,user.password)
        if(!isValidPassword){
            return res.status(401).json({
                success:false,
                message:"Invalid password"
            })
        }

        const token=generateTokenAndSetCookie(res,user._id)

        user.lastLogin=new Date()
        await user.save()

        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}

export const logout=async(req,res)=>{
    try {
        res.clearCookie("token")
        res.status(200).json({
            success:true,
            message:"Logged out successfully"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}

export const verifyEmail=async(req,res)=>{
    try{
        const {code}=req.body
        const user=await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid verification code or expired code!"
            })
        }

        user.isVerified=true
        user.verificationToken=null
        user.verificationTokenExpiresAt=null

        await user.save()

        await sendWelcomeEmail(user.email,user.name)

        res.status(200).json({
            success:true,
            message:"Email verified successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}

export const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Email not found"
            })
        }
        const resetToken=crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt=Date.now()+1*60*60*1000

        user.resetPasswordToken=resetToken
        user.resetPasswordExpiresAt=resetTokenExpiresAt

        await user.save()

        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({
            success:true,
            message:"Password reset email sent successfully",
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}

export const resetPassword=async(req,res)=>{
    try {
        const {token}=req.params
        const {password}=req.body
        const user=await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt:Date.now()}
        })
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired link"
            })
        }
        
        const hashPassword=await bcrypt.hash(password,10)

        user.password=hashPassword
        user.resetPasswordToken=null
        user.resetPasswordExpiresAt=null

        await user.save()

        sendResetSuccessEmail(user.email)

        res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}

export const checkAuth=async(req,res)=>{
    try {
        const user=await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Please login again"
            })
        }

        res.status(200).json({
            success:true,
            user:user
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}

