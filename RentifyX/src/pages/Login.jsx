import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { loginApi, googleAuthApi } from "../api";
import { useAuth } from "../seller/context/AuthContext";
import "./Login.css";


const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

 const handleGoogleLogin = async () => {
  try {
    setError("");
    setGoogleLoading(true);

    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Send to backend for authentication
    const data = await googleAuthApi(
      firebaseUser.displayName,
      firebaseUser.email,
      firebaseUser.photoURL
    );

    // Store user in context
    login(data.user);

    // Redirect based on role
    if (data.user.role == "owner" || data.user.role == "both") {
      navigate("/seller/dashboard");
    } else {
      navigate("/");
    }

  } catch (error) {
    console.log(error);
    setError(error.message || "Google login failed");
  } finally {
    setGoogleLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const data = await loginApi(email, password);

      // Store user in context
      login(data.user);

      // Redirect based on role
      if (data.user.role === "owner" || data.user.role === "both") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container-fluid login-wrapper">
      <div className="row min-vh-100">
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="login-card"
          >
            <Link to="/" className="back-home-btn">
              <ArrowLeft size={18} />
              Home
            </Link>

            <Link to="/" className="login-logo">
              <div className="logo-box">R</div>
              <span>RentifyX</span>
            </Link>

            <h3 className="mb-1">Welcome back</h3>
            <p className="text-muted mb-4">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit}>
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

              {error && (
                <p className="text-danger small mb-3">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-100">
                Sign In
              </Button>
            </form>

            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              >
{googleLoading ? "Please wait..." : "Continue with Google"}
            </button>

            <p className="text-center mt-3 small">
              Don’t have an account?{" "}
              <Link to="/signup">Sign up</Link>
            </p>
          </motion.div>
        </div>

        <div className="col-lg-6 d-none d-lg-flex login-brand">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-white"
          >
            <h2>Rent Smarter, Not Harder</h2>
            <p className="opacity-75 mt-3">
              Properties, vehicles & travel stays – all in one place.
            </p>

            <div className="row mt-5">
              <div className="col">
                <h3>10K+</h3>
                <p>Users</p>
              </div>
              <div className="col">
                <h3>8K+</h3>
                <p>Listings</p>
              </div>
              <div className="col">
                <h3>50+</h3>
                <p>Cities</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;