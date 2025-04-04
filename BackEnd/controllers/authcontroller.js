const {User,blackList} = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// Signup Controller
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    console.log("Received signup request:", req.body);
    try {

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }
        // Create a new user in the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
      
        const newUser = await User.create({ username, email,password: hashedPassword });
     
        res.status(201).json({ message: "User signed up successfully!", user: newUser });
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).json({ message: "Error signing up user.", error });
    }
};

function genToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {expiresIn:"7d"})
}
const isTokenBlacklisted = async (token) => {
    const blacklistedToken = await blackList.findOne({ 
        where: { token } 
    });

    if (!blacklistedToken) return false; // Token is not blacklisted

    // Check if the token has expired
    if (new Date() > blacklistedToken.expiresAt) {
        await Blacklist.destroy({ where: { token } }); // Remove expired token
        return false;
    }

    return true;
};
// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
       
        const user = await User.findOne({ where: { email } });
        console.log(user);
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (passwordMatch) {
            let token = await genToken(user.id);
            while (await isTokenBlacklisted(token)) {
                token = await genToken(user.id);
            }
            res.status(200).json({ message: "Login successful!",token});
        } else {

            res.status(401).json({ message: "Invalid email or password." });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user.", error });
    }
};

exports.logout = async (req, res) => {
    try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await blackList.create({
            token: req.token,
            userId: decoded.userID,
            expiresAt
        });
        res.status(200).json({ message: "User logged out" });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "cant logout" });
    }
}