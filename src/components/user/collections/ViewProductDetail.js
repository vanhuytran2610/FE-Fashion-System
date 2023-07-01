/* eslint-disable no-unreachable */
/* eslint-disable jsx-a11y/img-redundant-alt */

import React, { createContext, useContext, useEffect, useState } from "react";

import { Carousel } from "react-bootstrap";
import { Loading } from "../../Loading";
import { RecommendSize } from "./RecommendSize";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

export function ViewProductDetail(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [size_id, setSizeId] = useState(0);

  const handleInput = (e) => {
    setSizeId(e.target.value);
    console.log("Selected size:", e.target.value);
  };

  useEffect(() => {
    let isMounted = true;

    const category_id = props.match.params.category;
    const product_id = props.match.params.product;
    axios.get(`/api/get-product/${category_id}/${product_id}`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setProduct(res.data.data[0]);
          setLoading(false);
          console.log(res.data.data);
        } else if (res.data.status === 404) {
          history.push("/");
        } else if (res.data.status === 400) {
          history.push(`/category/${category_id}`);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [props.match.params.category, props.match.params.product, history]);

  useEffect(() => {
    if (product && product.sizes) {
      // Calculate total quantity of all sizes
      let total = 0;
      for (const item of product.sizes) {
        total += item.pivot.quantity;
      }
      setTotalQuantity(total);
    }
  }, [product]);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevCount) => prevCount - 1);
    }
  };
  const handleIncrement = () => {
    if (quantity < 10) {
      setQuantity((prevCount) => prevCount + 1);
    }
  };

  const submitAddtocart = (e) => {
    e.preventDefault();

    if (!size_id) {
      swal("Error", "Please select a size", "error");
      return;
    }

    const data = {
      product_id: product.id,
      product_quantity: quantity,
      size_id: size_id, // Assuming the selected size ID is stored in product.size_id
    };
    console.log(data);

    axios.post(`/api/add-to-cart`, data).then((res) => {
      if (res.data.status === 201) {
        //Created - Data Inserted
        swal("Success", res.data.message, "success").then(() => {
          window.location.reload();
        });
      } else if (res.data.status === 409) {
        //Already added to cart
        swal("Warning", res.data.message, "warning");
      } else if (res.data.status === 401) {
        //Unauthenticated
        swal("Error", res.data.message, "error");
      } else if (res.data.status === 404) {
        //Not Found
        swal("Warning", res.data.message, "warning");
      } else if (res.data.status === 407) {
        //Not Found
        swal("Warning", res.data.message, "warning");
      }
    });
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="py-3">
          <div className="container">
            <div className="row my-5">
              <div className="col-md-6 mx-4">
                {product && product.images && product.images.length > 1 ? (
                  <div className="row">
                    <div className="col-md-9">
                      <Carousel interval={null} pause={true}>
                        {product.images.map((image, index) => (
                          <Carousel.Item key={index}>
                            <img
                              src={`http://localhost:8000/${image.image_path}`}
                              alt={`Image ${index + 1}`}
                              className="d-block w-100"
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </div>
                    <div className="col-md-2">
                      {product.images.map((image, index) => (
                        <div className="d-flex flex-column" key={index}>
                          <img
                            src={`http://localhost:8000/${image.image_path}`}
                            alt={`Image ${index + 1}`}
                            className="w-100 mb-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center">
                    <h4>
                      <i class="bi bi-card-image"></i> No images available
                    </h4>
                  </div>
                )}
              </div>

              <div className="col-md-4 mx-4">
                <h5>{product && product.name}</h5>
                <h6 className="mb-5">
                  {product &&
                    product.price &&
                    product.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  VND
                </h6>
                <p className="mb-5"> {product && product.description} </p>
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="color-square border"
                    style={{
                      backgroundColor: product && product.color.color,
                      width: "20px",
                      height: "20px",
                    }}
                  ></div>
                  <p className="mb-0 ms-2">{product && product.color.color}</p>
                </div>
                <hr></hr>
                <div className="my-4">
                  <label
                    htmlFor="size_id"
                    className="form-label mt-2"
                    style={{ fontWeight: "700" }}
                  >
                    Select Size
                  </label>
                  <select
                    name="size_id"
                    className="form-control"
                    onChange={handleInput}
                    value={size_id}
                    required
                  >
                    <option value="">Size</option>
                    {product &&
                      product.sizes &&
                      product.sizes.map((item) => {
                        if (item.pivot.quantity > 5) {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.size}
                            </option>
                          );
                        } else if (
                          item.pivot.quantity <= 5 &&
                          item.pivot.quantity >= 1
                        ) {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.size}{" "}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              Low Stock
                            </option>
                          );
                        } else if (item.pivot.quantity <= 0) {
                          return (
                            <option key={item.id} value={item.id} disabled>
                              {item.size}{" "}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              Out Of Stock
                            </option>
                          );
                        }
                      })}
                  </select>
                  <RecommendSize />
                </div>
                <hr />
                <div>
                  <label
                    className="form-label mt-2"
                    style={{ fontWeight: "700" }}
                  >
                    Quantity
                  </label>
                  <div className="row">
                    <div className="col-md-5 mt-1">
                      <div className="input-group">
                        <button
                          type="button"
                          onClick={handleDecrement}
                          className="input-group-text"
                        >
                          -
                        </button>
                        <div className="form-control text-center">
                          {quantity}
                        </div>
                        <button
                          type="button"
                          onClick={handleIncrement}
                          className="input-group-text"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div>{avail_stock}</div> */}
                <div className="row my-5">
                  <div>
                    <button
                      type="button"
                      className={`btn btn-dark col-md-5 ${
                        totalQuantity === 0 ? "opacity-50" : ""
                      }`}
                      onClick={submitAddtocart}
                      disabled={totalQuantity === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
