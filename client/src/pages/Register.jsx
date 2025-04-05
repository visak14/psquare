import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import Carousel from "./Carousel";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { registerUser } from "../api/authApi.js";
import { BASE_URL } from "../config.js"; 
export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.fullName.trim())
      tempErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    if (!formData.password.trim()) tempErrors.password = "Password is required";
    if (!formData.confirmPassword.trim())
      tempErrors.confirmPassword = "Confirm Password is required";
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const user = await registerUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        dispatch(loginSuccess(user));
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      } catch (error) {
        console.error("Registration failed:", error.response?.data?.message);
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
          <h2 className="auth-title">Register</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Full Name<span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}

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
                src={showPassword ? "/images/open.png" : "/images/close.png"}
                alt="Toggle Password"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && <p className="error">{errors.password}</p>}

            <label>
              Confirm Password<span className="required">*</span>
            </label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <img
                src={
                  showConfirmPassword ? "/images/open.png" : "/images/close.png"
                }
                alt="Toggle Confirm Password"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}

            <button type="submit" className="auth-btn">
              Register
            </button>
          </form>
          <p className="auth-footer">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
