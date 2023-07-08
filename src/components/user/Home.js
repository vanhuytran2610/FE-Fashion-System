import React, { useEffect } from "react";

import AutoSlider from "./AutoSlider";
import image1 from "../../images/12.jpg";
import image2 from "../../images/13.jpg";
import image3 from "../../images/14.jpg";
import image4 from "../../images/15.jpg";
import image5 from "../../images/16.jpg";

function Home() {
  const images1 = [image1, image2, image3];
  const images2 = [image3, image4, image5];

  useEffect(() => {
    document.title = "Home"; // Set document title
  }, []);

  return (
    <div>
      <AutoSlider images={images1} interval={4000} />
      <AutoSlider images={images2} interval={4000} />
    </div>
  );
}

export default Home;
