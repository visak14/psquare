


import React, { useState, useEffect } from 'react';

const Carousel = () => {
  
  const images = [
    "/images/rect.png",  
    "/images/rect.png",
    "/images/rect.png",
    "/images/rect.png"
  ];


  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);  // Loop back to 0 after the last image
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <img src={images[currentIndex]} alt={`carousel-image-${currentIndex}`} />
    </div>
  );
};

export default Carousel;
