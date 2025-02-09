import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decodedToken.id, role: decodedToken.role }
    next()
    return req.user
  } catch (error) {
    console.log("Error occurred: ", error)
    res.status(401).json({ message: "Authentication failed" })
  }
}

