import "moment-timezone";

import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Loading } from "../../Loading";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";

export function OrderDetail(props) {
  const orderId = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    let isMounted = true;
    document.title = "Orders";

    axios
      .get(`/api/auth/order/${orderId}`)
      .then((res) => {
        if (isMounted) {
          if (res.data.status === 200) {
            setOrder(res.data.data);
            setLoading(false);
            console.log(res.data.data);
          } else if (res.data.status === 401) {
            swal("Error", res.data.message, "error");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  let displayOrders = "";
  if (loading) {
    return <Loading />;
  } else {
    displayOrders = (
      <>
        <div>
          <div className="my-2 mx-3">
            <h4>Customer Information:</h4>
            <table className="table table-bordered my-4" style={{ fontWeight: "700" }}>
              <tbody>
                <tr>
                  <td>Email</td>
                  <td>{order.email}</td>
                </tr>
                <tr>
                  <td>Full Name</td>
                  <td>
                    {order.firstname} {order.lastname}
                  </td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>{order.phone}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>
                    {order.address}, {order.ward.name}, {order.district.name},{" "}
                    {order.province.name}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
                  className="col-md-5 my-3 mx-4 "
                  style={{ fontWeight: "600" }}
                >
                  <ul
                    className="list-unstyled text-dark align-item-center my-5"
                    style={{ fontSize: "100%" }}
                  >
                    <li>
                      <p>Product Name: {item.product.name}</p>
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
                      <p>Payment Mode: {order.payment_mode}</p>
                    </li>
                    <li>
                      <p>Payment: {order.status === 0 ? "Unpaid" : "Paid"}</p>
                    </li>
                    <button className="btn btn-dark" disabled={order.status===0}>
                        Payment Confirm
                    </button>
                  </ul>
                </div>
              </div>
            </>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="container px-4 my-5">
      <div className="card">
        <div className="card-header">
          <h4>Detail</h4>
        </div>
        <div className="card-body">{displayOrders}</div>
      </div>
    </div>
  );
}
