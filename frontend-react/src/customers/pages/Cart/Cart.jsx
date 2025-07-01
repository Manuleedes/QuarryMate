import {
  Button,
  Card,
  Divider,
  IconButton,
  Snackbar,
  Box,
  Modal,
  Grid,
  TextField,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import AddressCard from "../../components/Address/AddressCard";
import CartItemCard from "../../components/CartItem/CartItemCard";
import { useDispatch, useSelector } from "react-redux";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createOrder } from "../../../State/Customers/Orders/Action";
import { findCart } from "../../../State/Customers/Cart/cart.action";
import { isValid } from "../../util/ValidToOrder";
import { cartTotal } from "./totalPay";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { getMenuItemsByQuarryId } from "../../../State/Customers/Menu/menu.action";
import { clearCartAction } from "../../../State/Customers/Cart/cart.action";

const initialValues = {
  streetAddress: "",
  state: "",
  pincode: "",
  city: "",
};

const validationSchema = Yup.object().shape({
  streetAddress: Yup.string().required("Street Address is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be 6 digits"),
  city: Yup.string().required("City is required"),
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  p: 4,
};

const Cart = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const { cart, auth, quarry } = useSelector((store) => store);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const jwt = localStorage.getItem("jwt");

  const handleCloseAddressModal = () => setOpenAddressModal(false);
  const handleOpenAddressModal = () => setOpenAddressModal(true);

  const refreshMaterials = async () => {
    if (quarry.usersQuarry) {
      await dispatch(
        getMenuItemsByQuarryId({
          quarryId: quarry.usersQuarry.id,
          jwt: auth.jwt || jwt,
          materialCategory: "",
        })
      );
    }
  };

  useEffect(() => {
    if (jwt) {
      dispatch(findCart(jwt));
    }
  }, [dispatch, jwt]);

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      jwt,
      order: {
        quarryId: cart.cartItems[0].material?.quarry.id,
        deliveryAddress: {
          fullName: auth.user?.fullName,
          streetAddress: values.streetAddress,
          city: values.city,
          state: values.state,
          postalCode: values.pincode,
          country: "Kenya",
        },
      },
    };

    if (isValid(cart.cartItems)) {
      await dispatch(createOrder(data));
      await dispatch(clearCartAction()); // clear cart after order
      await refreshMaterials(); // refresh material quantities
      resetForm();
    } else {
      setOpenSnackbar(true);
    }
  };

  const createOrderUsingSelectedAddress = async (deliveryAddress) => {
    const data = {
      jwt,
      order: {
        quarryId: cart.cartItems[0].material.quarry.id,
        deliveryAddress: deliveryAddress,
      },
    };

    if (isValid(cart.cartItems)) {
      await dispatch(createOrder(data));
      await dispatch(clearCartAction());
      await refreshMaterials();
    } else {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Fragment>
      {cart.cartItems.length > 0 ? (
        <main className="lg:flex justify-between">
          {/* Left Section: Cart Items */}
          <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
            {cart.cartItems.map((item, i) => (
              <CartItemCard item={item} key={item.id || i} />
            ))}

            <Divider />
            <div className="billDetails px-5 text-sm">
              <p className="font-extralight py-5">Bill Details</p>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <p>Item Total</p>
                  <p>Ksh.{cartTotal(cart.cartItems).toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>Delivery Fee</p>
                  <p>Ksh.21</p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>Platform Fee</p>
                  <p>Ksh.5</p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>GST and Quarry Charges</p>
                  <p>Ksh.33</p>
                </div>
                <Divider />
                <div className="flex justify-between text-gray-400 font-semibold">
                  <p>Total Pay</p>
                  <p>
                    Ksh.
                    {(
                      cartTotal(cart.cartItems) +
                      21 +
                      5 +
                      33
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Section: Address Selection */}
          <Divider orientation="vertical" flexItem />
          <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
            <div className="w-full max-w-2xl">
              <h1 className="text-center font-semibold text-2xl py-10">
                Choose Delivery Address
              </h1>
              <div className="flex gap-5 flex-wrap justify-center">
                {auth.user?.addresses?.map((item, index) => (
                  <AddressCard
                    key={item.id || index}
                    handleSelectAddress={createOrderUsingSelectedAddress}
                    item={item}
                    showButton={true}
                  />
                ))}

                <Card className="flex flex-col justify-center items-center p-5 w-64">
                  <div className="flex space-x-5 items-center">
                    <AddLocationAltIcon />
                    <div className="space-y-5">
                      <p>Add New Address</p>
                      <Button
                        onClick={handleOpenAddressModal}
                        fullWidth
                        variant="contained"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <div className="flex h-[90vh] justify-center items-center">
          <div className="text-center space-y-5">
            <RemoveShoppingCartIcon sx={{ width: "8rem", height: "8rem" }} />
            <p className="font-bold text-2xl">Your Cart Is Empty</p>
          </div>
        </div>
      )}

      {/* Address Modal */}
      <Modal open={openAddressModal} onClose={handleCloseAddressModal}>
        <Box sx={style}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    name="streetAddress"
                    as={TextField}
                    label="Street Address"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="streetAddress" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="state"
                    as={TextField}
                    label="State"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="state" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="pincode"
                    as={TextField}
                    label="Pincode"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="pincode" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="city"
                    as={TextField}
                    label="City"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="city" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Deliver Here
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message="Please add items from one quarry only when placing an order."
      />
    </Fragment>
  );
};

export default Cart;



