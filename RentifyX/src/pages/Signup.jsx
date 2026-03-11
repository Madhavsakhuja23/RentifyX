import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../seller/context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import "./Signup.css";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();

  if (name && email && password) {

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // check if email already exists
    const userExists = existingUsers.find((user) => user.email === email);

    if (userExists) {
      alert("User already exists. Please login.");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role,
    };

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Auto-login the user after signup for better UX
    login(newUser);

    if (role === "owner" || role === "both") {
      navigate("/seller/dashboard");
    } else {
      navigate("/");
    }
  }
};

  return (
    <div className="container-fluid signup-wrapper">
      <div className="row min-vh-100">

        {/* Left – Branding */}
        <div className="col-lg-6 d-none d-lg-flex signup-brand">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <h2>Join the RentifyX Community</h2>
            <p className="opacity-75 mt-3">
              Rent or list assets with a seamless experience.
            </p>

            <div className="row mt-5">
              <div className="col">
                <h3>Free</h3>
                <p>To Join</p>
              </div>
              <div className="col">
                <h3>Instant</h3>
                <p>Setup</p>
              </div>
              <div className="col">
                <h3>Secure</h3>
                <p>Platform</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right – Form */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="signup-card"
          >

            {/* Back button */}
            <Link to="/" className="back-home-btn">
              <ArrowLeft size={18} />
              Home
            </Link>

            <Link to="/" className="signup-logo">
              <div className="logo-box">R</div>
              <span>RentifyX</span>
            </Link>

            <h3>Create an account</h3>
            <p className="text-muted mb-4">
              Enter your details to get started
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3 position-relative">
                <User className="input-icon" size={18} />
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3 position-relative">
                <Mail className="input-icon" size={18} />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <Lock className="input-icon" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="form-label fw-medium" style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
                  I want to
                </label>
                <div className="role-selection">
                  <label className={`role-option ${role === "user" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      value="user"
                      checked={role === "user"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span>Rent</span>
                  </label>
                  <label className={`role-option ${role === "owner" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      value="owner"
                      checked={role === "owner"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span>List</span>
                  </label>
                  <label className={`role-option ${role === "both" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      value="both"
                      checked={role === "both"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span>Both</span>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-100">
                Create Account
              </Button>
            </form>

            <p className="text-center mt-3 small">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
