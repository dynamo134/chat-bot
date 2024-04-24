import jwt from "jsonwebtoken";

// Function to generate JWT token and set it as a cookie
const generateTokenAndSetCookie = (userId, res) => {
    // Generate JWT token with userId payload and sign it using JWT_SECRET from environment variables
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d", // Token expires in 15 days
    });

    // Set JWT token as a cookie in the response
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // Max age of the cookie in milliseconds (15 days)
        httpOnly: true, // Cookie accessible only through HTTP(S) protocol, not JavaScript
        sameSite: "strict", // Cookie sent only with same-site requests, preventing cross-site request forgery (CSRF) attacks
        secure: process.env.NODE_ENV !== "development", // Cookie sent only over HTTPS in production environment
    });
};

export default generateTokenAndSetCookie;
