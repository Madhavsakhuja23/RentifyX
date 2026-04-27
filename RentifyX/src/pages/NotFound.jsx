import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-center px-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="display-1 fw-bold text-primary mb-3" style={{ fontSize: "6rem" }}>
            404
          </h1>
          <h2 className="mb-4">Oops! Page not found.</h2>
          <p className="text-muted mb-5" style={{ maxWidth: "500px", margin: "0 auto" }}>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill">
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