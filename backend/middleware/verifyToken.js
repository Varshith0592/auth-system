import jwt from 'jsonwebtoken'

export const verifyToken=async(req,res,next)=>{
    try {
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
        req.userId=decoded.userId
        next()


        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}