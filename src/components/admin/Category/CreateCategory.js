import React, { useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

export function CreateCategory() {
  const [categories, setCategories] = useState([{ category: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("/api/auth/create-category", {
          categories,
        })
        .then((res) => {
          if (res.data.status === 201) {
            swal("Success", res.data.message, "success");
            setCategories([{ category: "" }]);
          } else if (res.data.status === 422) {
            console.log(res.data.error);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCategories = [...categories];
    updatedCategories[index] = { ...updatedCategories[index], [name]: value };
    setCategories(updatedCategories);
  };

  const handleAddCategory = () => {
    setCategories([...categories, { category: "" }]);
  };

  const handleRemoveCategory = (index) => {
    if (categories.length > 1) {
      const updatedCategories = [...categories];
      updatedCategories.splice(index, 1);
      setCategories(updatedCategories);
    }
  };

  return (
    <div className="container p-4">
      <div className="card">
        <div className="card-header">
          <h4>
            Create New Category
            <Link
              to="/admin/view-category"
              className="btn btn-secondary btn-md float-end"
            >
              <i class="bi bi-arrow-left-circle"></i> {''}View Category
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {categories.map((category, index) => (
              <div key={index} className="row px-2">
                <div className="mb-3 col-md-12">
                  <label for="category" class="form-label">
                    Category {index + 1}:
                  </label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control"
                      id="category"
                      name="category"
                      value={category.category}
                      onChange={(e) => handleInputChange(e, index)}
                      required
                    />
                    <div className="col-md-1 px-5 pt-1">
                      {categories.length > 1 && (
                        <i
                          class="bi bi-dash-circle-fill"
                          style={{ fontSize: 20 }}
                          onClick={() => handleRemoveCategory(index)}
                        ></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary my-3 mx-2"
              onClick={handleAddCategory}
            >
              <i class="bi bi-plus-circle-fill"></i> Add Category
            </button>
            <br></br>
            <button type="submit" className="btn btn-dark float-end my-3 mx-2">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
