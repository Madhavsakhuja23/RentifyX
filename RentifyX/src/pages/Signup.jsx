import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { signupApi, googleAuthApi } from "../api";
import { useAuth } from "../seller/context/AuthContext";
import "./Signup.css";


const Signup = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Send to backend for authentication
      const data = await googleAuthApi(
  firebaseUser.displayName || "Google User",
  firebaseUser.email,
  firebaseUser.photoURL,
  role
);

      // Store user in context
      login(data.user, data.token);

      // Redirect based on role
      console.log(data.user.role);
      if (data.user.role == "owner" || data.user.role == "both") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      setError(error.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must contain 8+ characters, uppercase, lowercase, number and special character."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await signupApi(name, email, password, role);

      // signupApi now returns user data directly
      login(data.user, data.token);

      // Redirect based on role
      console.log(data.user.role);
      if (data.user.role == "owner" || data.user.role == "both") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.log(err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container-fluid signup-wrapper">
      <div className="row min-vh-100">
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

        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="signup-card"
          >
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

            {error && (
              <div className="alert alert-danger small">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3 position-relative">
                <User className="input-icon" size={18} />
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div className="mb-4">
                <label className="form-label fw-medium">
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
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Continue with Google"}
            </button>

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