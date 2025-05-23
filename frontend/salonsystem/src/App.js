import React, { useState } from "react";
import "./App.css"; // Make sure you have your styles here or import SignUp.css styles here

function App() {
  // State to hold form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form validation or API call here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="welcome-box">
          <h1>Welcome !!</h1>
          <p>
            Discover our exclusive beauty services tailored just for you. Book
            your appointment and feel radiant every day.
          </p>
        </div>
      </div>
      <div className="right-panel">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
          <p className="or">or with...</p>
          <div className="social-icons">
            <div className="icon">O</div>
            <div className="icon">O</div>
            <div className="icon">O</div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
