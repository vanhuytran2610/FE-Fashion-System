import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Loading } from "../../Loading";
import ReactPaginate from "react-paginate";
import axios from "axios";
import swal from "sweetalert";

export function ViewProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    document.title = "Product";
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    axios
      .get("/api/auth/get-all-products")
      .then((response) => {
        if (response.data.status === 200) {
          setProducts(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    if (searchTerm) {
      setLoading(true);
      axios
        .get(`/api/products/search?search=${searchTerm}`)
        .then((response) => {
          setSearchResults(response.data);

          console.log(searchResults.length);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = (e, productId) => {
    const checked = e.target.checked;
    if (productId === "all") {
      setSelectAll(checked);
      if (checked) {
        const allProductIds = products.map((product) => product.id);
        setSelectedProducts(allProductIds);
      } else {
        setSelectedProducts([]);
      }
    } else {
      if (checked) {
        setSelectedProducts((prevSelected) => [...prevSelected, productId]);
      } else {
        setSelectedProducts((prevSelected) =>
          prevSelected.filter((id) => id !== productId)
        );
      }
    }
  };

  const deleteSelectedProducts = () => {
    if (selectedProducts.length === 0) {
      swal("Warning", "No products selected", "warning");
      return;
    }

    swal({
      title: "Are you sure?",
      text: "You want to delete the selected products",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmDelete) => {
      if (confirmDelete) {
        axios
          .post("/api/auth/delete-products", {
            productIds: selectedProducts,
          })
          .then((res) => {
            if (res.data.status === 200) {
              swal("Success", res.data.message, "success");
              setProducts((prevProductList) =>
                prevProductList.filter(
                  (product) => !selectedProducts.includes(product.id)
                )
              );
              setSelectedProducts([]);
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

  const deleteProduct = (id) => {
    axios
      .delete(`/api/auth/delete-product/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success");
          setProducts((prevProductList) =>
            prevProductList.filter((product) => product.id !== id)
          );
        } else if (res.data.status === 404) {
          swal("Error", res.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const offset = currentPage * itemsPerPage;
  const pageCount =
    Math.ceil(
      searchResults.length > 0 ? searchResults.length : products.length
    ) / itemsPerPage;
  const paginatedProducts =
    searchResults.length > 0
      ? searchResults.slice(offset, offset + itemsPerPage)
      : products.slice(offset, offset + itemsPerPage);

  return (
    <div className="container p-4">
      <div className="card">
        <div className="card-header">
          <h4>
            Product List
            <Link
              to="/admin/add-product"
              className="btn btn-secondary btn-md float-end"
            >
              <i className="bi bi-plus-circle-fill"></i> Create Product
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <div className="mb-3 d-flex">
            <input
              type="text"
              className="form-control mx-1"
              placeholder="Search products"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button className="btn btn-secondary mx-1" onClick={handleSearch}>
              Search
            </button>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="table-responsive my-3">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleCheckboxChange(e, "all")}
                      />
                    </th>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th className="w-25">Size-Quantity</th>
                    <th>Avatar Image</th>
                    <th>Images</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {searchTerm !== "" ? (
                    searchResults.length > 0 ? (
                      paginatedProducts.map((product, index) => (
                        <tr key={product.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={(e) =>
                                handleCheckboxChange(e, product.id)
                              }
                            />
                          </td>
                          <td>{product.id}</td>
                          <td>{product.category.category}</td>
                          <td>{product.name}</td>
                          <td>
                            {product.price.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            )}{" "}
                            VND
                          </td>
                          <td className="w-25">
                            <ul>
                              {product.sizes && product.sizes.length > 0 ? (
                                product.sizes.map((size) => (
                                  <li key={size.id}>
                                    Size: {size.size}, Quantity:{" "}
                                    {size.pivot.quantity}
                                  </li>
                                ))
                              ) : (
                                <li>No sizes available</li>
                              )}
                            </ul>
                          </td>
                          <td>
                            <img
                              src={`http://localhost:8000/${product.image_avatar}`}
                              width="80px"
                              alt={product.name}
                            />
                          </td>
                          <td>
                            <ul className="list-unstyled">
                              {product.images && product.images.length > 0 ? (
                                product.images.map((image) => (
                                  <li key={image.id}>
                                    <img
                                      width="80px"
                                      src={`http://localhost:8000/${image.image_path}`}
                                      alt={image.image_path}
                                      className="my-1"
                                    />
                                  </li>
                                ))
                              ) : (
                                <li>No images available</li>
                              )}
                            </ul>
                          </td>
                          <td>
                            <Link
                              to={`edit-product/${product.id}`}
                              className="btn btn-warning btn-md"
                            >
                              Edit
                            </Link>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger btn-md"
                              onClick={() => deleteProduct(product.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10">
                          <h4>No products found</h4>
                        </td>
                      </tr>
                    )
                  ) : (
                    paginatedProducts.map((product, index) => (
                      <tr key={product.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) =>
                              handleCheckboxChange(e, product.id)
                            }
                          />
                        </td>
                        <td>{product.id}</td>
                        <td>{product.category.category}</td>
                        <td>{product.name}</td>
                        <td>
                          {product.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          VND
                        </td>
                        <td className="w-25">
                          <ul>
                            {product.sizes && product.sizes.length > 0 ? (
                              product.sizes.map((size) => (
                                <li key={size.id}>
                                  Size: {size.size}, Quantity:{" "}
                                  {size.pivot.quantity}
                                </li>
                              ))
                            ) : (
                              <li>No sizes available</li>
                            )}
                          </ul>
                        </td>
                        <td>
                          <img
                            src={`http://localhost:8000/${product.image_avatar}`}
                            width="80px"
                            alt={product.name}
                          />
                        </td>
                        <td>
                          <ul className="list-unstyled">
                            {product.images && product.images.length > 0 ? (
                              product.images.map((image) => (
                                <li key={image.id}>
                                  <img
                                    width="80px"
                                    src={`http://localhost:8000/${image.image_path}`}
                                    alt={image.image_path}
                                    className="my-1"
                                  />
                                </li>
                              ))
                            ) : (
                              <li>No images available</li>
                            )}
                          </ul>
                        </td>
                        <td>
                          <Link
                            to={`edit-product/${product.id}`}
                            className="btn btn-warning btn-md"
                          >
                            Edit
                          </Link>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-md"
                            onClick={() => deleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-danger btn-md"
                  onClick={deleteSelectedProducts}
                  disabled={selectedProducts.length === 0}
                >
                  Delete Selected
                </button>
              </div>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination justify-content-end"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
