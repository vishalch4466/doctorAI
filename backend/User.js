// models/User.js
import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // For Google auth, password will not be required
  googleId: { type: String, required: true, unique: true }, // Store the Google ID for the user
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

export default User;
