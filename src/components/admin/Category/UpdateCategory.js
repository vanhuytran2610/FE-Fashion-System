/* eslint-disable react-hooks/exhaustive-deps */

import { Button, Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import axios from "axios";

export function UpdateCategory({
  categoryId,
  initialCategoryName,
  updateCategoryName,
}) {
  const [categoryName, setCategoryName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  

  const fetchCategoryName = () => {
    axios
      .get(`/api/auth/get-category/${categoryId}`)
      .then((response) => {
        if (response.data.status === 404) {
          console.error(response.data.message);
        } else if (response.data.status === 200) {
          setCategoryName(response.data.data);
          setInputValue(response.data.data.category);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleUpdateCategory = () => {
    try {
      axios
        .put(`/api/auth/update-category/${categoryId}`, {
          category: inputValue,
        })
        .then((res) => {
          if (res.data.status === 200) {
            console.log("Category updated");
            updateCategoryName(categoryId, inputValue);
            handleCloseModal();
          } else if (res.data.status === 404) {
            console.error(res.data.message);
          } else if (res.data.status === 422) {
            console.error(res.data.error);
          }
        });
    } catch (error) {
      console.log(error);
      // Handle error scenarios, such as displaying an error message to the user
    }
  };

  useEffect(() => {
    fetchCategoryName();
  }, []);

  return (
    <div>
      <Button variant="warning" onClick={handleShowModal}>
        Edit
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Category Name:</Form.Label>
            <Form.Control
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateCategory}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
