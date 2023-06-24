import "moment-timezone";

import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Loading } from "../Loading";
import axios from "axios";
import moment from "moment";

export function Order() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState(1); // Number of orders to display initially
  const [showLoadMore, setShowLoadMore] = useState(true);

  const handleLoadMore = () => {
    setVisibleOrders((prevVisibleOrders) => prevVisibleOrders + 5); // Increase the number of visible orders
    if (visibleOrders >= orders.length) {
      setShowLoadMore(false); // Hide the "Load More" button if all orders have been displayed
    }
  };

  useEffect(() => {
    let isMounted = true;
    document.title = "Orders";

    axios
      .get("/api/orders")
      .then((res) => {
        if (isMounted) {
          if (res.data.status === 200) {
            setOrders(res.data.data);
            setLoading(false);
            console.log(res.data.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  let displayOrders = "";
  if (loading) {
    return <Loading />;
  } else {
    displayOrders = orders.slice(0, visibleOrders).map((order) => {
      return (
        <>
          <div>
            {order.order_items.map((item) => (
              <>
                <div className="row mx-3">
                  <div className="col-md-6 my-3 text-center">
                    <Link
                      to={`/category/${item.product.category_id}/${item.product.id}`}
                    >
                      <img
                        src={`http://localhost:8000/${item.product.image_avatar}`}
                        alt={item.product.name}
                        className="w-50"
                      />
                    </Link>
                  </div>
                  <div
                    className="col-md-5 my-5 mx-4 "
                    style={{ fontWeight: "600", fontSize: "100%" }}
                  >
                    <ul
                      className="list-unstyled text-dark align-item-center my-5"
                      style={{ fontSize: "100%" }}
                    >
                      <li>
                        <p>{item.product.name}</p>
                      </li>
                      <li>
                        <p>Size: {item.size.size}</p>
                      </li>
                      <li>
                        <p className="d-flex">
                          Color:{" "}
                          <div
                            className="color-square border mx-2 mt-1"
                            style={{
                              backgroundColor: item && item.product.color.color,
                              width: "16px",
                              height: "16px",
                            }}
                          ></div>{" "}
                          {item.product.color.color}
                        </p>
                      </li>
                      <li>
                        <p>Quantity: {item.quantity}</p>
                      </li>
                      <li>
                        <p>
                          Purchase Date:{" "}
                          {moment(item.created_at)
                            .tz("Asia/Ho_Chi_Minh")
                            .format("HH:mm:ss DD-MM-YYYY")}
                        </p>
                      </li>
                      <li>
                        <p>Payment: {order.status === 0 ? "Paid" : "Unpaid"}</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            ))}
          </div>
        </>
      );
    });
  }

  return (
    <div className="container px-4 my-5">
      <div className="card">
        <div className="card-header">
          <h4>Order List</h4>
        </div>
        <div className="card-body">
          {orders.length === 0 ? (
            <h4>No Item In Your Order List</h4>
          ) : (
            <>
              {displayOrders}
              {showLoadMore && (
                <div className="text-start">
                  <button
                    className="btn btn-secondary mt-3"
                    onClick={handleLoadMore}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
