import { useEffect, useState } from "react";

const images = [
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    text: "Find your perfect stay\nComfort meets luxury"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    text: "Rent with confidence\nVerified listings only"
  }
];

function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="carousel"
      style={{ backgroundImage: `url(${images[index].url})` }}
    >
      <div className="carousel-overlay">
        <h1>
          {images[index].text.split("\n").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h1>
      </div>
    </div>
  );
}

export default Carousel;
