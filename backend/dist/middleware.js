import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "123123";
export function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "Authorization header missing" });
    const token = authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Token missing" });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const id = payload.userId ?? payload.id;
        if (!id)
            return res.status(403).json({ message: "Invalid token" });
        req.user = { id };
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(403).json({ message: "Invalid token" });
    }
}
//# sourceMappingURL=middleware.js.map