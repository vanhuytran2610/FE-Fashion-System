import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

export function RecommendSize() {
  const [showModal, setShowModal] = useState(false);
  const [weight, setWeight] = useState("40");
  const [height, setHeight] = useState("150");
  const [recommendedSize, setRecommendedSize] = useState("");
  const [error, setError] = useState(null);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "weight") {
      setWeight(value);
    } else if (name === "height") {
      setHeight(value);
    }
  };

  const handleRecommend = () => {
    // Perform form validation
    if (!weight || !height) {
      setError("Weight and height are required.");
      return;
    }

    if (Number(weight) < 40 || Number(weight) > 100) {
      setError("Weight must be between 40 and 100 kg.");
      return;
    }

    if (Number(height) < 150 || Number(height) > 190) {
      setError("Height must be between 150 and 190 cm.");
      return;
    }

    // Clear any previous errors
    setError(null);

    // Proceed with the API request
    fetch("http://localhost:5000/predict-size", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weight: Number(weight), height: Number(height) }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          const predictions = data.predictions;
          const sortedPredictions = predictions.sort(
            (a, b) => b.probability - a.probability
          );
          const topTwoSizes = sortedPredictions.slice(0, 2);
          setRecommendedSize(topTwoSizes);
        } else {
          setError(data.message || "An error occurred");
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again.");
        console.error(error);
      });
  };

  return (
    <div>
      <Link
        to="#"
        className="link-dark text-decoration-none text-uppercase"
        onClick={handleShowModal}
        style={{ fontWeight: "700", fontSize: "75%" }}
      >
        Find my size
      </Link>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>What is My Size?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group my-2">
              <label htmlFor="weight" style={{ fontWeight: "700" }}>
                Your Weight:
              </label>
              <br />
              <div className="row my-2">
                <input
                  type="range"
                  name="weight"
                  value={weight}
                  onChange={handleInputChange}
                  className={`col-md-9 mx-3 form-control-range ${
                    error && !weight ? "is-invalid" : ""
                  }`}
                  min={40}
                  max={100}
                />
                <div
                  className="col-md-2 text-end"
                  style={{ fontWeight: "700" }}
                >
                  {weight} kg
                </div>
              </div>

              {error && !weight && (
                <div className="invalid-feedback">Weight is required.</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="height" style={{ fontWeight: "700" }}>
                Your Height:
              </label>
              <br />
              <div className="row my-2">
                <input
                  type="range"
                  name="height"
                  value={height}
                  onChange={handleInputChange}
                  className={`col-md-9 mx-3 form-control-range ${
                    error && !height ? "is-invalid" : ""
                  }`}
                  min={150}
                  max={190}
                />
                <div
                  className="col-md-2 text-end"
                  style={{ fontWeight: "700" }}
                >
                  {height} cm
                </div>
              </div>

              {error && !height && (
                <div className="invalid-feedback">Height is required.</div>
              )}
            </div>
            {error && (
              <p className="error my-2" style={{ fontWeight: "600" }}>
                {error}
              </p>
            )}
            <div className="form-group">
              <div className="text-center my-4">
                <button
                  type="button"
                  className="btn btn-dark w-50"
                  onClick={handleRecommend}
                >
                  Recommend
                </button>
              </div>
            </div>
            <div className="">
              <div
                className="form-label text-center"
                style={{ fontWeight: "700", fontSize: "120%" }}
              >
                {recommendedSize && recommendedSize.length > 0 && (
                  <p>
                    {Math.round(recommendedSize[0].probability * 100)}% of
                    people like you bought size
                  </p>
                )}
              </div>
              <div className="my-2">
                {recommendedSize &&
                  recommendedSize.map((size, index) => (
                    <>
                      <div key={index}>
                        <div className="row">
                          <p
                            className="col-md-6"
                            style={{ fontWeight: "700", fontSize: "120%" }}
                          >
                            {size.size}
                          </p>
                          <p className="col-md-6 text-end" style={{ fontWeight: "700", fontSize: "120%" }}>
                            {Math.round(size.probability * 100)}%
                          </p>
                        </div>
                        <div
                          key={index}
                          className="progress-bar bg-dark col-sm-9"
                          role="progressbar"
                          style={{ width: `${size.probability * 100}%` }}
                          aria-valuenow={size.probability * 100}
                          aria-valuemin="0"
                          aria-valuemax="101"
                        >
                          {Math.round(size.probability * 100)}%
                        </div>
                        {index === 0 && <hr/>}
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
