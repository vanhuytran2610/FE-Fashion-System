import "moment-timezone";

import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Loading } from "../../Loading";
import ReactPaginate from "react-paginate";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";
import vi from "moment/locale/vi";

export function Order() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    let isMounted = true;
    document.title = "Orders";

    axios.get(`/api/auth/orders`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setOrders(res.data.data);
          setLoading(false);
        } else if (res.data.status === 401) {
          swal("Error", res.data.message, "error");
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleCheckboxChange = (e, orderId) => {
    const checked = e.target.checked;
    if (orderId === "all") {
      setSelectAll(checked);
      if (checked) {
        const allOrderIds = orders.map((order) => order.id);
        setSelectedOrders(allOrderIds);
      } else {
        setSelectedOrders([]);
      }
    } else {
      if (checked) {
        setSelectedOrders((prevSelected) => [...prevSelected, orderId]);
      } else {
        setSelectedOrders((prevSelected) =>
          prevSelected.filter((id) => id !== orderId)
        );
      }
    }
  };

  const deleteOrder = (id) => {
    axios
      .delete(`/api/auth/orders/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success");
          setOrders((prevOrderList) =>
            prevOrderList.filter((item) => item.id !== id)
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteSelectedOrders = () => {
    if (selectedOrders.length === 0) {
      swal("Warning", "No orders selected", "warning");
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
          .post("/api/auth/orders", {
            orderIds: selectedOrders,
          })
          .then((res) => {
            if (res.data.status === 200) {
              swal("Success", res.data.message, "success");
              setOrders((prevOrderList) =>
                prevOrderList.filter(
                  (item) => !selectedOrders.includes(item.id)
                )
              );
              setSelectedOrders([]);
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

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(orders.length / itemsPerPage);
  const displayOrders = orders
    .slice(offset, offset + itemsPerPage)
    .map((item) => {
      const vietnameseTime = moment.utc(item.created_at).format("HH:mm:ss, DD-MM-YYYY");
      return (
        <tr key={item.id}>
          <td>
            <input
              type="checkbox"
              checked={selectedOrders.includes(item.id)}
              onChange={(e) => handleCheckboxChange(e, item.id)}
            />
          </td>

          <td>{item.id}</td>
          <td>{item.tracking_no}</td>
          <td>{item.phone}</td>
          <td>{item.email}</td>
          <td>{vietnameseTime}</td>
          <td>
            <Link
              to={`order/${item.id}`}
              className="btn btn-success btn-sm mx-2"
            >
              View
            </Link>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => deleteOrder(item.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

  return (
    <div className="pt-4">
      <hr />
      <div className="container px-0">
        <div className="card border-0">
          <div className="card-title bg-white row mx-1 my-0 pt-2">
            <h4 className="col-md-6">Order List</h4>
            <div className="pagination-container col-md-6">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination justify-content-end"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
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
                    <th>Tracking No.</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Order Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{displayOrders}</tbody>
              </table>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-danger btn-md"
                  onClick={deleteSelectedOrders}
                  disabled={selectedOrders.length === 0}
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
