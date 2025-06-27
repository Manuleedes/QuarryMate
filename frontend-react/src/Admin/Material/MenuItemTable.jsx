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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMaterialAction,
  getMenuItemsByQuarryId,
  updateMenuItemsAvailability,
} from "../../State/Customers/Menu/menu.action";
import DeleteIcon from "@mui/icons-material/Delete";
import { Create } from "@mui/icons-material";

const MenuItemTable = ({ isDashboard, name }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menu, quarry, auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (quarry.usersQuarry) {
      dispatch(
        getMenuItemsByQuarryId({
          quarryId: quarry.usersQuarry.id,
          jwt: auth.jwt || jwt,
          materialCategory: "",
        })
      );
    }
  }, [quarry.usersQuarry]);

  const handleMaterialAvailability = (materialId) => {
    dispatch(updateMenuItemsAvailability({ materialId, jwt: auth.jwt || jwt }));
  };

  const handleDeleteMaterial = (materialId) => {
    dispatch(deleteMaterialAction({ materialId, jwt: auth.jwt || jwt }));
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
          <Table aria-label="menu items table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell align="center">Unit</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Price per Unit (Ksh)</TableCell>
                <TableCell align="center">Total Price (Ksh)</TableCell>
                <TableCell align="center">Lorries Required</TableCell>
                <TableCell align="center">Availability</TableCell>
                {!isDashboard && (
                  <TableCell align="center">Delete</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {menu.menuItems?.map((item) => {
                const pricePerUnit = item.pricePerUnit ?? 0;
                const quantity = item.quantity ?? 0;
                const totalPrice = pricePerUnit * quantity;
                const lorriesRequired =
                  item.pricingUnit === "PIECE"
                    ? Math.ceil(quantity / 1000) // adjust if blocks (500) or pieces (1000)
                    : Math.ceil(quantity / 18); // tonnes per lorry

                return (
                  <TableRow hover key={item.id}>
                    <TableCell>
                      <Avatar alt={item.name} src={item.images?.[0]} />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column">
                        <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption">
                          {item.category?.name ?? "-"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{item.pricingUnit}</TableCell>
                    <TableCell align="center">{quantity}</TableCell>
                    <TableCell align="center">
                      Ksh.{pricePerUnit.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      Ksh.{totalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">{lorriesRequired}</TableCell>
                    <TableCell align="center">
                      <Button
                        color={item.available ? "success" : "error"}
                        variant="text"
                        onClick={() => handleMaterialAvailability(item.id)}
                      >
                        {item.available ? "In Stock" : "Out of Stock"}
                      </Button>
                    </TableCell>
                    {!isDashboard && (
                      <TableCell align="center">
                        <IconButton onClick={() => handleDeleteMaterial(item.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
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


