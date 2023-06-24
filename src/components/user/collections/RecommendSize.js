import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

export function RecommendSize() {
  const [showModal, setShowModal] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
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
          setRecommendedSize(data.cloth_size);
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
        Find your size
      </Link>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Find Your Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <form>
            <div className="form-group">
              <label>Your Weight: (kg)</label>
              <input
                type="number"
                name="weight"
                value={weight}
                onChange={handleInputChange}
                className={`form-control ${error && !weight ? 'is-invalid' : ''}`}
                min={40}
                max={100}
              />
              {error && !weight && <div className="invalid-feedback">Weight is required.</div>}
            </div>
            <div className="form-group">
              <label>Your Height: (cm)</label>
              <input
                type="number"
                name="height"
                value={height}
                onChange={handleInputChange}
                className={`form-control ${error && !height ? 'is-invalid' : ''}`}
                min={150}
                max={190}
              />
              {error && !height && <div className="invalid-feedback">Height is required.</div>}
            </div>
            {error && <p className="error my-2" style={{ fontWeight: "600" }}>{error}</p>}
            <div className="form-group row mt-3">
              <div className="col-md-3 mx-3">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleRecommend}
                >
                  Recommend
                </button>
              </div>
              <div className="col-md-4 offset-md-4">
                <label
                  className="form-label mx-2"
                  style={{ fontWeight: "700", fontSize: "120%" }}
                >
                  Your Size:
                </label>
                <label
                  className="form-label"
                  style={{ fontWeight: "700", fontSize: "120%" }}
                >
                  {recommendedSize}
                </label>
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
