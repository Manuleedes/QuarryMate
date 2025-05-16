import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "../Admin/Admin";
import AdminDashboard from "../Admin/Dashboard/AdminDashboard";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import NotFound from "../customers/pages/NotFound/NotFound";
import { useSelector } from "react-redux";
import CreateQuarryForm from "../Admin/AddQuarries/CreateQuarryForm";

const AdminRouters = () => {
  const { auth, quarry } = useSelector((store) => store);
  return (
    <div>
      <Routes>
        <Route
          path="/*"
          element={
            
            !quarry.usersQuarry ? (
              <CreateQuarryForm />
            ) : (
              <Admin />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default AdminRouters;
