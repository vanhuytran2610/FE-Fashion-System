import React from "react";
import { Carousel } from "react-bootstrap";

const AutoSlider = ({ images, interval }) => {
  return (
    <Carousel fade interval={interval} pause="hover">
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img className="d-block w-100 h-100" src={image} alt={`Slide ${index}`} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default AutoSlider;