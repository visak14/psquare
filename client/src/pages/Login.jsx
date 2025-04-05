import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import Carousel from "./Carousel";
import { useDispatch } from 'react-redux'; 
import { login } from "../redux/authSlice";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });



  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);


  
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    if (!formData.password.trim()) tempErrors.password = "Password is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(login(formData)).unwrap();
        navigate("/dashboard");
      } catch (error) {
        console.error("Login failed", error);
        alert(error || "Invalid credentials");
      }
    }
  };
  


  return (
    <div className="auth-container">
      <div className="auth-left">
        <Carousel />
        <h2 className="auth-heading">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h2>
        <p className="auth-text">
          Tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="auth-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Email Address<span className="required">*</span>
            </label>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <label>
              Password<span className="required">*</span>
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <img
                src={showPassword ? "/images/close.png" : "/images/open.png"}
                alt="Toggle Password"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && <p className="error">{errors.password}</p>}

            <div className="auth-actions">
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
