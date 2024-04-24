import jwt from "jsonwebtoken"; // Importing the JSON Web Token library
import User from "../models/user.models.js"; // Importing the User model

// Middleware function to protect routes
const protectRoute = async (req, res, next) => {
    try {
        // Extracting JWT token from the request cookies
        const token = req.cookies.jwt;

        // If no token is provided, return 401 Unauthorized error
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        // Verifying the JWT token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If the token is invalid, return 401 Unauthorized error
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        // Finding the user associated with the token in the database
        const user = await User.findById(decoded.userId).select("-password");

        // If user not found, return 404 Not Found error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach the user object to the request
        req.user = user;

        // Call next middleware function
        next();
    } catch (error) {
        // Catching any errors that occur during the process
        console.log("Error in protectRoute middleware: ", error.message);
        // Return 500 Internal Server Error in case of an error
        res.status(500).json({ error: "Internal server error" });
    }
};

// Exporting the protectRoute middleware function as default export
export default protectRoute;
