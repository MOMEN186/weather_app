const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/authroutes");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

app.use(cors());
// Routes
app.use("/auth", authRoutes);
app.use(express.json());
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

