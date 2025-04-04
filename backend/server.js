express = require("express");
dotenv = require("dotenv");
cors = require("cors");
jwt = require("jsonwebtoken");
bcrypt = require("bcrypt");
const { Pool } = require("pg");
bodyParser = require("body-parser");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET ;

console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Disable SSL in development
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ✅ CONNECT TO DATABASE
pool.connect()
  .then(() => console.log("✅ Connected to Neon PostgreSQL!"))
  .catch(err => console.error("❌ Connection error:", err));

// ✅ USER SIGN-UP
app.post("/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔹 Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Insert into database
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    const userId = result.rows[0].id;

    // 🔹 Create JWT token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ 
      message: "User created successfully", 
      token, 
      user: result.rows[0] 
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// ✅ USER LOGIN
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔹 Find user in PostgreSQL
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    // 🔹 Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // تحديث حالة المستخدم إلى "Online"
    await pool.query("UPDATE users SET status = TRUE WHERE id = $1", [user.id]);

    // 🔹 Generate JWT Token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.post("/auth/logout", async (req, res) => {
  const { username } = req.body;
  
  try {
    const result = await pool.query(
      "UPDATE users SET status = FALSE WHERE username = $1",
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error logging out" });
  }
});


// ✅ SERVER LISTEN
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/history", async (req, res) => {
  const { username, search_query } = req.body;

  try {
    const userResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userId = userResult.rows[0].id;

    await pool.query(
      "INSERT INTO history (user_id, query) VALUES ($1, $2)", 
      [userId, search_query]
    );

    res.json({ success: true, message: "Search saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: "Error saving history",
      error: err.message
    });
  }
});

app.get("/history/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const userResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userId = userResult.rows[0].id;
    const historyResult = await pool.query(
      "SELECT query as name, created_at as timestamp FROM history WHERE user_id = $1 ORDER BY created_at DESC", 
      [userId]
    );

    res.json({ success: true, history: historyResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching history",
      error: err.message
    });
  }
});
