import { Carousel } from "react-bootstrap";
import React from "react";

const AutoSlider = ({ images, interval }) => {
  return (
    <div>
      <Carousel fade interval={interval} pause="hover" >
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block"
              style={{width: "100vw", height: "100vh"}}
              src={image}
              alt={`Slide ${index}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default AutoSlider;
