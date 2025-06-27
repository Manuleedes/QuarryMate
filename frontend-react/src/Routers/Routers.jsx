import React from "react";
import { Route, Routes } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";
import Admin from "../Admin/Admin";
import AdminDashboard from "../Admin/Dashboard/AdminDashboard";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import { useSelector } from "react-redux";
import NotFound from "../customers/pages/NotFound/NotFound";
import CreateQuarryForm from "../Admin/AddQuarries/CreateQuarryForm";
import AdminRouters from "./AdminRouters";

const Routers = () => {
  const { auth } = useSelector((store) => store);

  return (
    <>
   
    <Routes>
      
      <Route
        path="/admin/quarry/*"
        element={<AdminRouters/>}
      />
      <Route path="/*" element={<CustomerRoutes />} />
    </Routes>
    </>
    
  );
};

export default Routers;
