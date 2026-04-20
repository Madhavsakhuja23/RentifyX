import { motion } from "framer-motion";
import { Pause, Play} from "lucide-react";
import "./AboutUs.css";
import { useState } from "react";

const stats = [
  { value: "20+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "800+", label: "Properties Listed" },
  { value: "10+", label: "Cities Covered" },
];


const AboutUs = () => {
  const [play, Setpause] = useState(true);

const toggle =()=>{
  Setpause(!(play));
}
  return (
    <section className="about-section">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* Left – Image */}
          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="about-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                alt="About RentifyX"
              />
              <button className="play-btn" onClick={toggle}>
                {play?<Play size={22}/> : <Pause size={22}/>}
              </button>
            </div>
          </motion.div>

          {/* Right – Content */}
          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h6 className="about-badge">About Us</h6>
            <h2 className="about-title">
              About The Story Behind Us
            </h2>

            <p className="about-text">
              RentifyX was built to simplify how people rent and list properties,
              vehicles, and travel stays. Our mission is to connect people with
              trusted rentals through a seamless, transparent, and secure platform.
            </p>

            {/* Stats */}
            <div className="row g-3 mt-4">
              {stats.map((item) => (
                <div key={item.label} className="col-6 col-md-3">
                  <div className="about-stat">
                    <h4>{item.value}</h4>
                    <span>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="about-btn mt-4">
              Know More About Us
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;