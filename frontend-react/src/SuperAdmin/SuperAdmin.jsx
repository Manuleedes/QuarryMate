import React from "react";
import { Route, Routes } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSideBar";
import SuperAdminCustomerTable from "./SuperAdminCustomerTable/SuperAdminCustomerTable";
import Customers from "./SuperAdminCustomerTable/Customers";
import QuarryTable from "./Quarries/QuarryTable";
import SuperAdminQuarry from "./Quarries/SuperAdminQuarry";
import QuarryRequest from "./QuarryRequest/QuarryRequest";



const SuperAdmin = () => {
  return (
    <div className="lg:flex justify-between">
      <div className="">
       
        <SuperAdminSidebar />
      </div>

      <div className="w-[80vw]">
        <Routes>
          <Route path="/customers" element={<Customers/>}></Route>
          <Route path="/quarries" element={<SuperAdminQuarry/>}></Route>
          <Route path="/quarry-request" element={<QuarryRequest/>}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default SuperAdmin;
