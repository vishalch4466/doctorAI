import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import jwt from "jsonwebtoken"; // Add JWT package
import "./passportConfig.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: true,
  })
);

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Database connection error:", err.message));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
});

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("Users", userSchema);

app.post("/signup", async (req, res) => {
  const { name, phone, email, password } = req.body;

  // Log the data received
  console.log(req.body); 

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      mobile: phone,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    console.error(error);  // Log the error for more details
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists." });
    } else if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Invalid data provided.", details: error.message });
    } else {
      return res
        .status(500)
        .json({ message: "Server error occurred.", details: error.message });
    }
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Search for user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});


// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Protected Route Example
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Access to protected route granted", user: req.user });
});

app.use(passport.initialize());
app.use(passport.session());

// Google Authentication routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signin",
    successRedirect: "http://localhost:5173/landing", // Redirect to home page on successful login
  })
);

