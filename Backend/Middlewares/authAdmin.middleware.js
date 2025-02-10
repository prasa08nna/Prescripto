import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers

    if (!atoken) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    
    const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET_KEY)

   
    if (token_decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
    }

   
    next()
  } catch (error) {
    console.error("Error verifying token:", error) 
    return res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export default authAdmin
