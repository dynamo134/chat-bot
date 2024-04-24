import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/generateToken.js";
// Controller for user signup
export const signup = async (req, res) => {
	try {
		// Extract required fields from request body
		const { fullName, username, password, confirmPassword, gender } = req.body;

		// Check if passwords match
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		// Check if username already exists
		const user = await User.findOne({ username });
		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// Hash the password before saving it to the database
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Generate profile picture URL based on gender and username
		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		// Create a new user object with hashed password and profile picture URL
		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});


		// Check if user is successfully created
		if (newUser) {
			// Generate JWT token and set it as a cookie
			generateTokenAndSetCookie(newUser._id, res);

			// Save the new user to the database
			await newUser.save();

			// Return user information in the response
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
		} else {
			// Return error response if user creation failed
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		// Handle any errors that occur during signup process
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller for user login
export const login = async (req, res) => {
	try {
		// Extract username and password from request body
		const { username, password } = req.body;
		
		// Check if the user with the provided username exists
		const user = await User.findOne({ username });
		
		// Check if the password is correct by comparing with the hashed password stored in the database
		if (!user) {
			return res.status(400).json({ error: "Invalid username " });
		}
	
		// Compare passwords
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
	
		// If passwords don't match, return error response
		if (!isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid password" });
		}
	
		// Generate authentication token and set it as a cookie
		generateTokenAndSetCookie(user._id, res);

		// Return user information in the response
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		// Handle any errors that occur during login process
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller for user logout
export const logout = (req, res) => {
	try {
		// Clear the jwt cookie to logout the user
		res.cookie("jwt", "", { maxAge: 0 });
		// Return success message in the response
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		// Handle any errors that occur during logout process
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
