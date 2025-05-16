import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteMaterialAction,
  getMenuItemsByQuarryId,
  updateMenuItemsAvailability,
} from "../../State/Customers/Menu/menu.action";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import DeleteIcon from "@mui/icons-material/Delete";
import { Create, Remove } from "@mui/icons-material";

const MenuItemTable = ({ isDashboard, name }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menu,  quarry,auth } = useSelector((store) => store);
  const { id } = useParams();
  const jwt=localStorage.getItem("jwt");

  useEffect(() => {
    
      if(quarry.usersQuarry){
       dispatch( getMenuItemsByQuarryId({
        quarryId: quarry.usersQuarry?.id,
        jwt: localStorage.getItem("jwt"),
        materialCategory: "",
      }));
      }
      
    
  }, [quarry.usersQuarry]);

  // console.log(
  //   "-------- ",
  //   menu.menuItems[1].ingredients,
  //   categorizedIngredients(menu.menuItems[1].ingredients)
  // );

  

  const handleMaterialAvialability = (materialId) => {
    dispatch(updateMenuItemsAvailability({materialId,jwt:auth.jwt || jwt}));
  };

  const handleDeleteMaterial = (materialId) => {
    dispatch(deleteMaterialAction({materialId,jwt:auth.jwt || jwt}));
  };

  return (
    <Box width={"100%"}>
      <Card className="mt-1">
        <CardHeader
          title={name}
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
          action={
            <IconButton onClick={() => navigate("/admin/quarry/add-menu")}>
              <Create />
            </IconButton>
          }
        />
        <TableContainer>
          <Table aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                {/* <TableCell sx={{ textAlign: "center" }}>Category</TableCell> */}
                {!isDashboard && (
                  <TableCell sx={{ textAlign: "" }}>
                    Ingredients
                  </TableCell>
                )}
                <TableCell sx={{ textAlign: "center" }}>Price</TableCell>
                {/* <TableCell sx={{ textAlign: "center" }}>Quantity</TableCell> */}

                <TableCell sx={{ textAlign: "center" }}>Availabilty</TableCell>
                {!isDashboard && (
                  <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {menu.menuItems?.map((item) => (
                <TableRow
                  hover
                  key={item.id}
                  sx={{
                    "&:last-of-type td, &:last-of-type th": { border: 0 },
                  }}
                >
                   <TableCell>
                    {" "}
                    <Avatar alt={item.name} src={item.images[0]} />{" "}
                  </TableCell>

                  <TableCell
                    sx={{ py: (theme) => `${theme.spacing(0.5)} !important` }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.875rem !important",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="caption">{item.brand}</Typography>
                    </Box>
                  </TableCell>

                   {/* {!isDashboard && (
                    <TableCell>
                      {Object.keys(
                        categorizedIngredients(item?.ingredients)
                      )?.map((category) => (
                        <div key={category}>
                          <p className="font-semibold">{category}</p>
                          <div className="pl-5">
                            {categorizedIngredients(item?.ingredients)[
                              category
                            ].map((ingredient, index) => (
                              <div
                                key={ingredient.id}
                                className="flex gap-1 items-center"
                              >
                                <div>
                                  <HorizontalRuleIcon
                                    sx={{ fontSize: "1rem" }}
                                  />
                                </div>
                                <div
                                  key={ingredient.id}
                                  className="flex gap-4 items-center"
                                >
                                  <p>{ingredient.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </TableCell>  
                  )}  */}
                  <TableCell sx={{ textAlign: "center" }}>
                    ₹{item.price}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      color={item.available ? "success" : "error"}
                      variant="text"
                      onClick={() => handleMaterialAvialability(item.id)}
                    >
                      {item.available ? "in stock" : "out of stock"}
                    </Button>
                  </TableCell>

                  {!isDashboard && (
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton onClick={() => handleDeleteMaterial(item.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={menu.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default MenuItemTable;
