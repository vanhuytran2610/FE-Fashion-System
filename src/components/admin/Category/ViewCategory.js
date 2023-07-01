import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Loading } from "../../Loading";
import { UpdateCategory } from "./UpdateCategory";
import axios from "axios";
import swal from "sweetalert";

export function ViewCategory() {
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get(`/api/get-categories`)
      .then((res) => {
        if (res.status === 200) {
          setCategoryList(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const searchCategories = () => {
    axios
      .get(`/api/auth/categories/search?q=${searchQuery}`)
      .then((res) => {
        if (res.data.status === 200) {
          setCategoryList(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const sortCategories = () => {
    axios
      .get(`/api/auth/categories/sort?order=${sortOrder}`)
      .then((res) => {
        if (res.data.status === 200) {
          setCategoryList(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCheckboxChange = (e, categoryId) => {
    const checked = e.target.checked;
    if (categoryId === "all") {
      setSelectAll(checked);
      if (checked) {
        const allCategoryIds = categoryList.map((category) => category.id);
        setSelectedCategories(allCategoryIds);
      } else {
        setSelectedCategories([]);
      }
    } else {
      if (checked) {
        setSelectedCategories((prevSelected) => [...prevSelected, categoryId]);
      } else {
        setSelectedCategories((prevSelected) =>
          prevSelected.filter((id) => id !== categoryId)
        );
      }
    }
  };

  const updateCategoryName = (categoryId, categoryName) => {
    setCategoryList((prevCategoryList) =>
      prevCategoryList.map((item) => {
        if (item.id === categoryId) {
          return { ...item, category: categoryName };
        }
        return item;
      })
    );
  };

  const deleteCategory = (id) => {
    axios
      .delete(`/api/auth/delete-category/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success");
          setCategoryList((prevCategoryList) =>
            prevCategoryList.filter((item) => item.id !== id)
          );
        } else if (res.data.status === 404) {
          swal("Error", res.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteSelectedCategories = () => {
    if (selectedCategories.length === 0) {
      swal("Warning", "No categories selected", "warning");
      return;
    }

    swal({
      title: "Are you sure?",
      text: "You want to delete the selected categories",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmDelete) => {
      if (confirmDelete) {
        axios
          .post("/api/auth/delete-categories", {
            categoryIds: selectedCategories,
          })
          .then((res) => {
            if (res.data.status === 200) {
              swal("Success", res.data.message, "success");
              setCategoryList((prevCategoryList) =>
                prevCategoryList.filter(
                  (item) => !selectedCategories.includes(item.id)
                )
              );
              setSelectedCategories([]);
            } else if (res.data.status === 404) {
              console.log(res.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <div className="container p-4">
      <div className="card">
        <div className="card-header">
          <h4>
            Category List
            <Link
              to="/admin/add-category"
              className="btn btn-secondary btn-md float-end"
            >
              <i className="bi bi-plus-circle-fill"></i> Create Category
            </Link>
          </h4>
        </div>
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="row">
                <div className="mb-3 d-flex col-md-6">
                  <input
                    type="text"
                    className="form-control mx-2"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={searchCategories}
                  >
                    Search
                  </button>
                </div>
                <div className="mb-3 d-flex col-md-6">
                  <label
                    className="mx-2 mt-2"
                    style={{ width: "25%" }}
                    htmlFor="sortOrder"
                  >
                    Sort Order:
                  </label>
                  <select
                    id="sortOrder"
                    className="form-select mx-2"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="asc">Oldest</option>
                    <option value="desc">Newest</option>
                  </select>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={sortCategories}
                  >
                    Sort
                  </button>
                </div>
              </div>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleCheckboxChange(e, "all")}
                      />
                    </th>
                    <th>ID Number</th>
                    <th>Category Name</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(item.id)}
                          onChange={(e) => handleCheckboxChange(e, item.id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{item.category}</td>
                      <td>
                        <UpdateCategory
                          categoryId={item.id}
                          initialCategoryName={item.category}
                          updateCategoryName={updateCategoryName}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-md"
                          onClick={() => deleteCategory(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-danger btn-md"
                  onClick={deleteSelectedCategories}
                  disabled={selectedCategories.length === 0}
                >
                  Delete Selected
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
