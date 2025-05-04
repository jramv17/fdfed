const admin_verify=(req,res,next)=>{
    if(req.isAdmin){
        next();
    }else{
        return res.status(403).json({message:"Access denied. You are not an admin."});
    }
}

module.exports={admin_verify};