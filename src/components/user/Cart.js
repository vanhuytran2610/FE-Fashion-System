/* eslint-disable jsx-a11y/anchor-is-valid */

import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Footer from "../../layouts/frontend/Footer";
import { Loading } from "../Loading";
import axios from "axios";
import swal from "sweetalert";

export function Cart() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  var total_price_all = 0;

  if (!localStorage.getItem("auth_token")) {
    swal("Warning", "Please log in to go to Cart", "error");
    history.push("/login");
  }

  const handleDecrement = (cart_id) => {
    setCart((cart) =>
      cart.map((item) =>
        cart_id === item.id
          ? {
              ...item,
              product_quantity:
                item.product_quantity - (item.product_quantity > 1 ? 1 : 0),
            }
          : item
      )
    );
    updateCartQuantity(cart_id, "dec");
  };
  const handleIncrement = (cart_id) => {
    setCart((cart) =>
      cart.map((item) =>
        cart_id === item.id
          ? {
              ...item,
              product_quantity:
                item.product_quantity + (item.product_quantity < 10 ? 1 : 0),
            }
          : item
      )
    );
    updateCartQuantity(cart_id, "inc");
  };

  function updateCartQuantity(cart_id, scope) {
    axios.put(`/api/update-quantity/${cart_id}/${scope}`).then((res) => {
      if (res.data.status === 200) {
        // swal("Success",res.data.message,"success");
        console.log(res.data.message);
      }
    });
  }

  const deleteCartItem = (e, cart_id) => {
    e.preventDefault();
    const updatedCart = cart.filter((item) => item.id !== cart_id);
    setCart(updatedCart);

    const thisClicked = e.currentTarget;

    axios.delete(`/api/delete-cartItem/${cart_id}`).then((res) => {
      if (res.data.status === 200) {
        thisClicked.closest("tr").remove();
      } else if (res.data.status === 404) {
        swal("Error", res.data.message, "error");
      }
    });
  };

  const handleCheckout = () => {
    let hasInvalidQuantity = false;

    cart.map((item) => {
      console.log(item.size_id);
      const product_size = item.product.sizes.find(
        (size) => (size.id === item.size_id)
      );
      console.log(product_size);
      if (item.product_quantity > product_size.pivot.quantity) {
        hasInvalidQuantity = true;
      }
    });

    if (hasInvalidQuantity) {
      swal("Warning", "Not enough product in stock", "warning");
    } else {
      swal({
        title: "Do you want to check out this cart?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((confirm) => {
        if(confirm) {
          history.push("/checkout");
        }
      })
      
    }
  };

  useEffect(() => {
    let isMounted = true;
    document.title = "Cart";

    axios.get(`/api/cart`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setCart(res.data.data);
          setLoading(false);
          console.log(res.data.data);
        } else if (res.data.status === 401) {
          history.push("/");
          swal("Error", res.data.message, "error");
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [history]);

  return (
    <div>
      <div>
        <div className="mx-2 my-5">
          <div className="container">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active text-dark"
                  id="cart-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#cart"
                  type="button"
                  role="tab"
                  aria-controls="cart"
                  aria-selected="true"
                  style={{ fontWeight: "700" }}
                >
                  Cart ({cart.length})
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="cart"
                role="tabpanel"
                aria-labelledby="cart-tab"
              >
                {cart.length === 0 ? (
                  <h4 className="my-5 mx-2">No Item in Cart.</h4>
                ) : (
                  <div className="row my-4">
                    {cart &&
                      cart.map((item, index) => {
                        let total_price_item =
                          item.product_quantity * item.product.price;
                        total_price_all += total_price_item;
                        return (
                          <div className="col-md-4 mb-5" key={index}>
                            <div className="card h-100 w-100 border-0 my-1">
                              <Link
                                to={`/category/${item.product.category_id}/${item.product_id}`}
                              >
                                <img
                                  src={`http://localhost:8000/${item.product.image_avatar}`}
                                  alt={item.product.name}
                                  className="w-100"
                                />
                              </Link>
                              <div className="row">
                                <Link
                                  to={`/category/${item.product.category_id}/${item.id}`}
                                  className="link-secondary text-decoration-none col-sm-7"
                                >
                                  <p style={{ fontSize: "80%" }}>
                                    {item.product.name}
                                  </p>
                                </Link>
                                <p
                                  className="link-secondary col-sm-5 text-end"
                                  style={{ fontSize: "80%", fontWeight: "600" }}
                                >
                                  {String(total_price_item).replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )}{" "}
                                  VND
                                </p>
                              </div>
                              <div className="row">
                                <div className="text-secondary col-sm-5">
                                  <p style={{ fontSize: "80%" }}>
                                    Size: {item.size.size}
                                  </p>
                                </div>
                                <div className="col-sm-7">
                                  <div className="d-flex justify-content-end">
                                    <div
                                      className="color-square border"
                                      style={{
                                        backgroundColor:
                                          item && item.product.color.color,
                                        width: "20px",
                                        height: "20px",
                                      }}
                                    ></div>
                                    <p
                                      style={{
                                        fontSize: "80%",
                                      }}
                                      className="ms-1 text-secondary"
                                    >
                                      {item && item.product.color.color}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                {/* <div className="col-sm-9"> */}

                                <div className="col-sm-6 mt-1">
                                  <div className="input-group">
                                    <button
                                      type="button"
                                      onClick={() => handleDecrement(item.id)}
                                      className="input-group-text"
                                    >
                                      -
                                    </button>
                                    <div className="form-control text-center">
                                      {item.product_quantity}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleIncrement(item.id)}
                                      className="input-group-text"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <div className="col-sm-6 text-end mt-1">
                                  <button
                                    type="button"
                                    onClick={(e) => deleteCartItem(e, item.id)}
                                    className="input-group-text btn btn-secondary"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/* </div> */}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer total={total_price_all} onCheckout={handleCheckout} cartLength={cart.length} />
    </div>
  );
}
