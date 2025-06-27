import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./Dashboard/AdminDashboard";
import AdminSidebar from "./AdminSidebar";
import QuarryDashboard from "./Dashboard/QuarryDashboard";
import QuarriesOrder from "./Orders/QuarriesOrder";
import QuarriesMenu from "./Material/QuarriesMenu";
import AddMenuForm from "./Material/AddMenuForm";
import CreateQuarryForm from "./AddQuarries/CreateQuarryForm";
import QuarriesLorries from "./Lorries/QuarriesLorries";
import AddLorryForm from "./Lorries/AddLorryForm";
import Category from "./Category/Category";
import { useDispatch, useSelector } from "react-redux";
import { getQuarriesCategory } from "../State/Customers/Quarry/quarry.action";
import Details from "./Details/Details";
import AdminNavbar from "./AdminNavbar";
import { getUsersOrders } from "../State/Customers/Orders/Action";
import { fetchQuarriesOrder } from "../State/Admin/Order/quarries.order.action";

const Admin = () => {
  const dispatch = useDispatch();
  const [openSideBar, setOpenSideBar] = useState(false);
  const handleOpenSideBar = () => setOpenSideBar(true);
  const handleCloseSideBar = () => setOpenSideBar(false);
  const { auth, quarry } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  useEffect(() => {
    if (quarry.usersQuarry) {
      dispatch(
        getQuarriesCategory({
          jwt: auth.jwt || jwt,
          quarryId: quarry.usersQuarry?.id,
        })
      );

      dispatch(
        fetchQuarriesOrder({
          quarryId: quarry.usersQuarry?.id,
          jwt: auth.jwt || jwt,
        })
      );
    }
  }, [quarry.usersQuarry]);
  return (
    <div>
      <AdminNavbar handleOpenSideBar={handleOpenSideBar} />
      <div className="lg:flex justify-between">
        <div className="">
          <AdminSidebar handleClose={handleCloseSideBar} open={openSideBar} />
        </div>

        <div className="lg:w-[80vw]">
          <Routes>
            <Route path="/" element={<QuarryDashboard />} />
            <Route path="/orders" element={<QuarriesOrder />} />
            <Route path="/menu" element={<QuarriesMenu />} />
            <Route path="/add-menu" element={<AddMenuForm />} />
            <Route path="/add-quarry" element={<CreateQuarryForm />} />
            <Route path="/category" element={<Category />} />
            <Route path="/lorries" element={<QuarriesLorries />} />
            <Route path="/add-lorry" element={<AddLorryForm />} />
            <Route path="/details" element={<Details />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
