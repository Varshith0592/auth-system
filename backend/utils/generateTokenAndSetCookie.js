import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie=(res,userId)=>{
    try {
        const token = jwt.sign({
            userId:userId
        },process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"Lax",
            maxAge:7*24*60*60*1000
        })
        
        return token
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message: 'Internal Server Error'
        })
    }
}