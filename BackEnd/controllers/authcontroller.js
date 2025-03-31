const User = require("../models/userModel");

// Signup Controller
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Received signup request:", req.body);
    try {
        // Create a new user in the database
        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: "User signed up successfully!", user: newUser });
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).json({ message: "Error signing up user.", error });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ where: { email } });

        if (user && user.password === password) {
            res.status(200).json({ message: "Login successful!" });
        } else {
            res.status(401).json({ message: "Invalid email or password." });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user.", error });
    }
};