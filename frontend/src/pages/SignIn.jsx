import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        alert('Signed in successfully');

        // Redirect to the home page after successful login
        navigate('/landing');
      } else {
        const data = await res.json();
        setError(data.message || 'Error signing in');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (

     <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center">Sign in</h2>
      {error && <p className="signin-error">{error}</p>}

      <form onSubmit={handleSubmit} className="signin-form">
        <div className="">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md mb-5"
          />
        </div>

        <div className="">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md mb-5"
          />
        </div>

        <button type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" >
          Sign In
        </button>
      </form>

      <div className="mt-4 text-center">
        <p>
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
    </div>
  );
}
