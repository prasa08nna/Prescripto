import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.status(401).json({ success: false, message: "Unauthorized - Token Missing" });
    }

    const token_decoded = jwt.verify(dtoken, process.env.JWT_SECRET_KEY);
    req.docId = token_decoded.id || null;
    
    if (!req.docId) {
        return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ success: false, message: "Unauthorized - Token Invalid" });
  }
};


export default authDoctor
