import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    
    const { token } = req.headers
    if (!token) {
        
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.body.userId=token_decoded.id

    next()
  } catch (error) {
    console.error("Error verifying token:", error) 
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export default authUser
