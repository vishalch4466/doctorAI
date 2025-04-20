import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(""); // Error state for displaying messages
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [localPart] = email.split("@");

    if (!regex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (localPart.length < 5) {
      setError("The portion before '@' must be at least 5 characters long.");
      return false;
    }
    return true;
  };

  // Password validation function
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setError(
        "Password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return false;
    }
    return true;
  };

  // Phone validation function
  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    if (!regex.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
    return true;
  };

  // Form submission handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    // Validate fields
    if (
      !validateEmail(email) ||
      !validatePassword(password) ||
      !validatePhone(phone)
    ) {
      return; // Stop if validation fails
    }

    try {
      await axios.post("http://localhost:8000/signup", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim(),
      });
      alert("User registered successfully!");
      navigate("/"); // Redirect to login or homepage
    } catch (error) {
      console.error(
        "Error registering user:",
        error.response?.data?.message || error.message
      );
      setError(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={() =>
            (window.location.href = "http://localhost:8000/auth/google")
          }
          className="w-full bg-white text-black py-2 rounded-md hover:bg-gray-200 flex items-center justify-center space-x-3 border border-gray-300 mt-4"
        >
          <FaGoogle className="text-red-500 text-2xl" />
          <span className="text-sm">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;

