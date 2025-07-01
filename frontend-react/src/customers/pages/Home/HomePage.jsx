import React, { useEffect } from "react";
import "./HomePage.css";
import MultipleItemsCarousel from "../../components/MultiItemCarousel/MultiItemCarousel";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuarriesAction } from "../../../State/Customers/Quarry/quarry.action";
import { Link } from "react-router-dom";

// REMOVE Navbar import here if included in App layout globally
// import Navbar from "../../components/Navbar/Navbar";

const HomePage = () => {
  const { auth, quarry } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user) {
      dispatch(getAllQuarriesAction(localStorage.getItem("jwt")));
    }
  }, [auth.user]);

  return (
    <div>
      <section className="w-full flex justify-center py-5 bg-green-600">
        <Link
          to="/order-from-handpicked"
          className="bg-white text-green-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition"
        >
          Order From Our Favourite Quarries ➔
        </Link>
      </section>

      <section className="-z-50 banner relative flex flex-col justify-center items-center">
        <div className="w-[90%] md:w-[50vw] z-10 text-center">
          <p className="text-2xl lg:text-7xl font-bold z-10 py-5 text-white">
            Classic Builders QuarryMate
          </p>
          <p className="z-10 text-gray-300 text-xl lg:text-4xl">
            QuarryMate brings speed, simplicity, and reliability to every load.
            Quarrying made smarter...
          </p>
        </div>

        <div className="cover absolute top-0 left-0 right-0"></div>
        <div className="fadout"></div>
      </section>

      <section className="p-10 lg:py-10 lg:px-20">
        <p className="text-2xl font-semibold text-gray-400 py-3 pb-10">
          Top Materials..
        </p>
        <MultipleItemsCarousel />
      </section>
    </div>
  );
};

export default HomePage;


