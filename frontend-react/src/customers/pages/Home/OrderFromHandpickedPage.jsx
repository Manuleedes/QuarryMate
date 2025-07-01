import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuarriesAction } from "../../../State/Customers/Quarry/quarry.action";
import QuarryCard from "../../components/QuarryCard/QuarryCard";
//import Navbar from "../../components/Navbar/Navbar";

const OrderFromHandpickedPage = () => {
  const { auth, quarry } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user) {
      dispatch(getAllQuarriesAction(localStorage.getItem("jwt")));
    }
  }, [auth.user]);

  return (
    <div>
    
      <section className="px-5 lg:px-20 mt-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-400 py-3 ">
            Order From Our Favourite Quarries
          </h1>
          <div className="flex flex-wrap items-center justify-around">
            {quarry.quarries.map((item, i) => (
              <QuarryCard data={item} index={i} key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderFromHandpickedPage;
