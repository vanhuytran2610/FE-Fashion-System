import "chart.js/auto";

import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { Order } from "./Order/Order";
import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

function Dashboard() {
  const [dailyOrderData, setDailyOrderData] = useState({});
  const [dailyOrderQuantity, setDailyOrderQuantity] = useState(0);
  const [monthlyOrderData, setMonthlyOrderData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [categoryList, setCategoryList] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentMonthOrderLength, setCurrentMonthOrderLength] = useState(0);
  const [currentDayOrderData, setCurrentDayOrderData] = useState({});

  useEffect(() => {
    document.title = "Dashboard";
    fetchOrderData();
    fetchCategories();
    fetchProducts();
    fetchOrderDataByDate();
    fetchOrderDataByMonth();
  }, [selectedMonth]);

  const fetchOrderData = async () => {
    try {
      const response = await axios.get(
        `/api/auth/orders?month=${selectedMonth}`
      );
      if (response.data.status === 200) {
        const orders = response.data.data;
        const orderStatistics = processOrderData(orders);
        setMonthlyOrderData(orderStatistics);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrderDataByDate = async () => {
    try {
      const response = await axios.get("/api/auth/orders");
      if (response.data.status === 200) {
        const orders = response.data.data;
        setDailyOrderData(processOrderData(orders));
        const today = new Date().toISOString().split("T")[0];
        console.log(today);
        const currentDateOrders = orders.filter((order) => {
          const orderDate = order.created_at.split("T")[0];
          return orderDate === today;
        });
        setDailyOrderQuantity(currentDateOrders.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrderDataByMonth = async () => {
    try {
      const response = await axios.get("/api/auth/orders");
      if (response.data.status === 200) {
        const orders = response.data.data;
        setDailyOrderData(processOrderData(orders));
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const currentMonthOrders = orders.filter((order) => {
          const orderDate = new Date(order.created_at);
          return (
            orderDate.getFullYear() === currentYear &&
            orderDate.getMonth() + 1 === currentMonth
          );
        });
        setCurrentMonthOrderLength(currentMonthOrders.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = () => {
    axios
      .get(`/api/get-categories`)
      .then((res) => {
        if (res.status === 200) {
          setCategoryList(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchProducts = () => {
    axios
      .get("/api/auth/get-all-products")
      .then((response) => {
        if (response.data.status === 200) {
          setProducts(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const processOrderData = (orders) => {
    // Process the orders data and extract the necessary information for statistics
    const orderStatistics = {};

    // Loop through the orders and group them by date
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at).getDate();
      if (orderStatistics.hasOwnProperty(orderDate)) {
        orderStatistics[orderDate]++;
      } else {
        orderStatistics[orderDate] = 1;
      }
    });

    // Generate an array of days for the selected month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i+1);

    // Prepare the data for the chart
    const chartLabels = monthDays.map(
      (day) => `${currentYear}-${selectedMonth}-${day}`
    );
    const chartData = monthDays.map((day) => orderStatistics[day+1] || 0);

    return { labels: chartLabels, data: chartData };
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const scrollToOrder = () => {
    const orderElement = document.getElementById("order-section");
    if (orderElement) {
      orderElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="my-4">
      <div className="container px-4 py-2">
        <div className="row">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-success text-white mb-4">
              <div
                className="card-body row"
                style={{ fontWeight: "700", fontSize: "130%" }}
              >
                <p className="col-sm-9">Total Categories</p>
                <p className="col-sm-3 text-end">{categoryList.length}</p>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link
                  className="small text-white stretched-link"
                  to="/admin/view-category"
                >
                  View Details
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-warning text-white mb-4">
              <div
                className="card-body row"
                style={{ fontWeight: "700", fontSize: "130%" }}
              >
                <p className="col-sm-9">Total Products</p>
                <p className="col-sm-3 text-end">{products.length}</p>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link
                  className="small text-white stretched-link"
                  to="/admin/view-product"
                >
                  View Details
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-secondary text-white mb-4">
              <div
                className="card-body row"
                style={{ fontWeight: "700", fontSize: "130%" }}
              >
                <p className="col-sm-9">Orders in Day</p>
                <p className="col-sm-3 text-end">{dailyOrderQuantity}</p>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link
                  className="small text-white stretched-link"
                  onClick={scrollToOrder}
                >
                  View Details
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-dark text-white mb-4">
              <div
                className="card-body row"
                style={{ fontWeight: "700", fontSize: "130%" }}
              >
                <p className="col-sm-9">Orders in Month</p>
                <p className="col-sm-3 text-end">{currentMonthOrderLength}</p>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link
                  className="small text-white stretched-link"
                  onClick={scrollToOrder}
                >
                  View Details
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Order Statistics</h4>
          </div>
          <div className="card-body">
            <div className="my-3">
              <div className="text-end">
                <label
                  htmlFor="month-select"
                  style={{ fontWeight: "700" }}
                  className="mx-1"
                >
                  Select Month:{" "}
                </label>
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="mx-1 rounded"
                  style={{ fontWeight: "700" }}
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </div>
              <div>
                {monthlyOrderData &&
                  monthlyOrderData.labels &&
                  monthlyOrderData.data && (
                    <Bar
                      data={{
                        labels: monthlyOrderData.labels,
                        datasets: [
                          {
                            label: "Number of Orders",
                            data: monthlyOrderData.data,
                            backgroundColor: "rgba(0, 0, 0, 0.67)",
                          },
                        ],
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            grace: "5%",
                            ticks: {
                              precision: 0,
                            },
                          },
                        },
                      }}
                    />
                  )}
              </div>
            </div>
            <div id="order-section">
              <Order />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
