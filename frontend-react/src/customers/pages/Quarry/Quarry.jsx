import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Backdrop,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import MenuItemCard from "../../components/MenuItem/MenuItemCard";
import { useDispatch, useSelector } from "react-redux";
import { getQuarryById, getQuarriesCategory } from "../../../State/Customers/Quarry/quarry.action";
import { getMenuItemsByQuarryId } from "../../../State/Customers/Menu/menu.action";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TodayIcon from '@mui/icons-material/Today';

// const categories = [
//   "Thali",
//   "Starters",
//   "Kenya Main Course",
//   "Rice and Biryani",
//   "Breads",
//   "Accompaniments",
//   "Dessert",
// ];

const materialTypes = [
  {label:"All",value:"all"}
  
];
const Quarry = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { quarry, menu } = useSelector((store) => store);
  const navigate = useNavigate();

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const materialType = searchParams.get("material_type");
  const materialCategory = searchParams.get("material_category");
  const jwt=localStorage.getItem("jwt")

  useEffect(() => {
    dispatch(
      getQuarryById({
        jwt: localStorage.getItem("jwt"),
        quarryId: id,
      })
    );
    dispatch(
      getMenuItemsByQuarryId({
        jwt: localStorage.getItem("jwt"),
        quarryId: id,
        materialCategory: materialCategory || ""
      })
    );
    dispatch(getQuarriesCategory({quarryId:id,jwt}))
  }, [id,materialType,getQuarriesCategory]);

  const handleFilter = (e, value) => {
    const searchParams = new URLSearchParams(location.search);
  
    if(value==="all"){
      searchParams.delete(e.target.name);
      searchParams.delete("material_category");
    }
    else searchParams.set(e.target.name, e.target.value); 

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  return (
    <><div className="px-5 lg:px-20 ">
      <section>
        <h3 className="text-gray-500 py-2 mt-10">
          Home/{quarry.quarry?.address.country}/
          {quarry.quarry?.name}/{quarry.quarry?.id}/Order Online
        </h3>
        <div>
         
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <img
            className="w-full h-[40vh] object-cover"
            src={quarry.quarry?.images[0]}
            alt=""
          />
            </Grid>
            <Grid item xs={12} lg={6}>
            <img
            className="w-full h-[40vh] object-cover"
            src={quarry.quarry?.images[1]}
            alt=""
          />
            </Grid>
            <Grid item xs={12} lg={6}>
            <img
            className="w-full h-[40vh] object-cover"
            src={quarry.quarry?.images[2]}
            alt=""
          />
            </Grid>
          </Grid>
        </div>
        <div className="pt-3 pb-5">
          <h1 className="text-4xl font-semibold">
            {quarry.quarry?.name}
          </h1>
          <p className="text-gray-500 mt-1">{quarry.quarry?.description}</p>
          <div className="space-y-3 mt-3">
              <p className="text-gray-500 flex items-center gap-3">
            <LocationOnIcon/> <span>{quarry.quarry?.address.streetAddress}
              </span> 
          </p>
          <p className="flex items-center gap-3 text-gray-500">
           <TodayIcon/> <span className=" text-orange-300"> {quarry.quarry?.openingHours} (Today)</span>  
          </p>
          </div>
        
        </div>
      </section>
      <Divider />

      <section className="pt-[2rem] lg:flex relative ">
        <div className="space-y-10 lg:w-[20%] filter">
          <div className="box space-y-5 lg:sticky top-28">
            
            <div className="">
              <Typography sx={{ paddingBottom: "1rem" }} variant="h5">
                Material Type
              </Typography>
              <FormControl className="py-10 space-y-5" component="fieldset">
                <RadioGroup
                  name="material_type"
                  value={materialType || "all"}
                  onChange={handleFilter}
                >
                  {materialTypes?.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      value={item.value}
                      control={<Radio />}
                      label={item.label}
                      sx={{ color: "gray" }}
                    />
                  ))}
                </RadioGroup>
                <Divider/>
                <Typography sx={{ paddingBottom: "1rem" }} variant="h5">
                Material Category
              </Typography>
                <RadioGroup
                  name="material_category"
                  value={materialCategory || "all"}
                  onChange={handleFilter}
                >
                   <FormControlLabel
                      
                      value={"all"}
                      control={<Radio />}
                      label={"All"}
                      sx={{ color: "gray" }}
                    />
                  {quarry?.categories.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      value={item.name}
                      control={<Radio />}
                      label={item.name}
                      sx={{ color: "gray" }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="lg:w-[80%] space-y-5 lg:pl-10">
          {menu?.menuItems.map((item) => (
            <MenuItemCard item={item} />
            // <p>ashok</p>
          ))}
        </div>
      </section>
    </div>
    <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={menu.loading || quarry.loading}
  
>
  <CircularProgress color="inherit" />
</Backdrop>
    </>
    
  );
};

export default Quarry;
