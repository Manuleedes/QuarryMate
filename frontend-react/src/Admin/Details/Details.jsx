import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InstagramIcon from "@mui/icons-material/Instagram";
// import XIcon from '@mui/icons-material/X';
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import {
  updateQuarry,
  updateQuarryStatus,
} from "../../State/Customers/Quarry/quarry.action";

const Details = () => {
  const dispatch = useDispatch();
  const { auth, quarry } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  const handleQuarryStatus = () => {
    dispatch(
      updateQuarryStatus({
        quarryId: quarry.usersQuarry.id,
        jwt: auth.jwt || jwt,
      })
    );
  };
  return (
    <div className="lg:px-20 px-5">
      <div className="py-5 flex justify-center items-center gap-5">
        <h1 className="text-2xl lg:text-7xl text-center font-bold p-5">
          {quarry.usersQuarry?.name}
        </h1>
        <div>
          <Button
            onClick={handleQuarryStatus}
            size="large"
            // sx={{ padding: "1rem 2rem" }}
            className="py-[1rem] px-[2rem]"
            variant="contained"
            color={quarry.usersQuarry?.open ? "error" : "primary"}
          >
            {quarry.usersQuarry?.open
              ? "Close"
              : "Open"}
          </Button>
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={<span className="text-gray-300"> Quarry</span>}
            />
            <CardContent>
              <div className="space-y-4 text-gray-200">
                <div className="flex">
                  <p className="w-48">Owner</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    {quarry.usersQuarry?.owner.fullName}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Quarry Name</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    {quarry.usersQuarry?.name}
                  </p>
                </div>
                {/* <div className="flex">
                  <p className="w-48">Cuisine Type</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    {quarry.usersQuarry?.cuisineType}
                  </p>
                </div> */}
                <div className="flex">
                  <p className="w-48">Opening Hours</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    {quarry.usersQuarry?.openingHours}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Status</p>
                  <div className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    {quarry.usersQuarry?.open ? (
                      <span className="px-5 py-2 rounded-full bg-green-400 text-gray-950">
                        Open
                      </span>
                    ) : (
                      <span className="text-black px-5 py-2 rounded-full bg-red-400">
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardHeader
              title={<span className="text-gray-300"> Address</span>}
            />
            <CardContent>
              <div className="space-y-3 text-gray-200">
                <div className="flex">
                  <p className="w-48">Country</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    {quarry.usersQuarry?.address.country}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">City</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    {quarry.usersQuarry?.address.city}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Postal Code</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    {quarry.usersQuarry?.address.postalCode}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Street Address</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    {quarry.usersQuarry?.address.streetAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardHeader
              title={<span className="text-gray-300"> Contact</span>}
            />
            <CardContent>
              <div className="space-y-3 text-gray-200">
                <div className="flex">
                  <p className="w-48">Email</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>
                    {quarry.usersQuarry?.contactInformation.email}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Mobile</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>
                    {" +91"}
                    {quarry.usersQuarry?.contactInformation.mobile}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="w-48">Social</p>
                  <div className="text-gray-400 flex items-center pb-3">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    <a
                      target="_blank"
                      href={
                        quarry.usersQuarry?.contactInformation.instagram
                      }
                      rel="noreferrer"
                    >
                      <InstagramIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a
                      className="ml-5"
                      href={
                        quarry.usersQuarry?.contactInformation.instagram
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TwitterIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a
                      className="ml-5"
                      href={
                        quarry.usersQuarry?.contactInformation.instagram
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkedInIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a
                      className="ml-5"
                      href={
                        quarry.usersQuarry?.contactInformation.instagram
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FacebookIcon sx={{ fontSize: "3rem" }} />
                    </a>
                  </div>
                </div>
                {/* <div className="flex">
                  <p className="w-48">Twitter</p>
                  <p className="text-gray-400">
                    {" "}
                    <span className="pr-5">-</span>{" "}
                    <a
                      href={
                        restaurant.usersRestaurant?.contactInformation.instagram
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TwitterIcon sx={{fontSize:"3rem"}} />
                    </a>
                  </p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Details;
