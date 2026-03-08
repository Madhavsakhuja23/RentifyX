import { useState, useEffect } from "react";
import heroHouses from "../../assets/hero-houses.webp";
import heroFlats from "../../assets/hero-flats.webp";
import heroTravel from "../../assets/hero-travel.webp";
import heroPg from "../../assets/hero-pg.webp";
import "./HeroCarousel.css";

const slides = [
    { image: heroHouses, title: "Find Your Dream Home", desc: "Spacious houses for long-term living", category: "houses" },
    { image: heroFlats, title: "Urban Living, Redefined", desc: "Modern flats in the heart of the city", category: "flats" },
    { image: heroPg, title: "Community & Comfort", desc: "Affordable PGs and hostels for students & professionals", category: "pgs" },
    { image: heroTravel, title: "Stay Anywhere, Anytime", desc: "Hourly travel stays for every journey", category: "travel" },
];

const categories = [
    { key: "houses", label: "Houses" },
    { key: "flats", label: "Flats" },
    { key: "pgs", label: "PGs" },
    { key: "travel", label: "Travel Stays" },
];

const HeroCarousel = ({ activeCategory, onCategoryChange }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[current];

    return (
        <section className="hero-carousel">
            {slides.map((s, i) => (
                <div
                    key={s.category}
                    className="carousel-slide"
                    style={{
                        opacity: i === current ? 1 : 0,
                        zIndex: i === current ? 1 : 0
                    }}
                >
                    <img
                        src={s.image}
                        alt={s.title}
                        className="carousel-image"
                    />
                    <div className="carousel-overlay" />
                </div>
            ))}

            <div className="carousel-content">
                <h1 className="carousel-title">
                    {slide.title}
                </h1>
                <p className="carousel-desc">
                    {slide.desc}
                </p>
            </div>

            <div className="carousel-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`dot ${i === current ? "active" : ""}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;
