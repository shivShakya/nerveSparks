import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const URL = "https://back-shivshakya.vercel.app";
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function logData() {
    try {
      const response = await fetch(`${URL}/login`, {
        method: 'post',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      
      if (result.user === null) {
        alert('Please Register Yourself first');
      } else {
        alert('You have logged in successfully');
        localStorage.setItem('Authorization', result);
        navigate('/cars/:id');
      }

      console.log(result);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login. Please try again.',);
    }
  }

  const roleOptions = ['admin', 'user', 'dealership'];

  return (
    <div className="log-in">
      <h1>LogIn</h1>

      <div className="log-form">
        <h3>Email</h3>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="in-log"
          placeholder="Email"
        />

        <h3>Password</h3>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="in-log"
          placeholder="Password"
        />

        {/* Dropdown menu for selecting the role */}
        <h3>Role</h3>
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="in-log"
        >
          <option value="">Select Role</option>
          {roleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <br />
        <br />
        <br />
        <button className="log-btn" onClick={logData}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Login;
