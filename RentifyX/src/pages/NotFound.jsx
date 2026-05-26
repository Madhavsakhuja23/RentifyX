import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const NotFound = () => {
  return (
    <>
      <Header />
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        padding: "24px 16px",
        background: "var(--bg-secondary, #f8f9fa)"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: "500px" }}
        >
          <h1 style={{
            fontSize: "clamp(4rem, 12vw, 6rem)",
            fontWeight: 800,
            color: "rgb(255, 102, 0)",
            marginBottom: "12px",
            lineHeight: 1
          }}>
            404
          </h1>
          <h2 style={{
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 700,
            marginBottom: "16px",
            color: "var(--text-primary, #111)"
          }}>
            Oops! Page not found.
          </h2>
          <p style={{
            color: "var(--text-secondary, #6b7280)",
            marginBottom: "32px",
            fontSize: "clamp(14px, 2vw, 16px)",
            lineHeight: 1.6
          }}>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              background: "rgb(255, 102, 0)",
              color: "white",
              borderRadius: "999px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "15px",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 25px rgba(255, 102, 0, 0.3)"
            }}
          >
            <Home size={18} />
            Back to Home
          </Link>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;