import React, { useEffect } from "react";
import QuarryCard from "./QuarryCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQuarryByUserId } from "../../State/Customers/Quarry/quarry.action";
import AddressCard from "../../customers/components/Address/AddressCard";
import AddQuarryCard from "./AddQuarryCard";


const AdminDashboard = () => {
  const params = useParams();
  const {quarry}=useSelector(state=>state);
  console.log("params", params);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getQuarryByUserId());
  }, []);

  return (
    <div className="lg:px-20">
     
      <div className="lg:flex flex-wrap justify-center">
        {quarry.usersQuarry.map((item) => (
          <QuarryCard item={item}/>
        ))}
        {quarry.usersQuarry.length<1 && <AddQuarryCard/>}
      </div>
    </div>
  );
};

export default AdminDashboard;
