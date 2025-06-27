import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { uploadToCloudinary } from "../utils/UploadToCloudnary";
import { createMenuItem } from "../../State/Customers/Menu/menu.action";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  pricingUnit: Yup.string().required("Pricing unit is required"),
  pricePerUnit: Yup.number()
    .typeError("Price per unit must be a number")
    .required("Price per unit is required")
    .min(1, "Price must be at least 1"),
  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .min(0.1, "Quantity must be greater than 0"),
});

const initialValues = {
  name: "",
  description: "",
  pricingUnit: "",
  pricePerUnit: "",
  quantity: 0,
  images: [],
  quarryId: "",
  category: "",
};

const AddMenuForm = () => {
  const dispatch = useDispatch();
  const { quarry, auth, menu } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const [uploadImage, setUploadingImage] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      values.quarryId = quarry.usersQuarry.id;
      try {
        dispatch(createMenuItem({ menu: values, jwt: auth.jwt || jwt }));
        resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (menu.message || menu.error) setOpenSnackBar(true);
  }, [menu.message, menu.error]);

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  const getSafeMessage = () => {
    if (menu.message) return menu.message;
    if (typeof menu.error === "string") return menu.error;
    if (menu.error?.response?.data?.message) return menu.error.response.data.message;
    if (menu.error?.message) return menu.error.message;
    return "An error occurred. Please try again.";
  };

  return (
    <>
      <div className="lg:px-32 px-5 lg:flex justify-center min-h-screen items-center pb-5">
        <div>
          <h1 className="font-bold text-2xl text-center py-2">Add New Material Item</h1>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Grid container spacing={2}>
              {/* Image Upload */}
              <Grid item xs={12} className="flex flex-wrap gap-5">
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <label className="relative" htmlFor="fileInput">
                  <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600">
                    <AddPhotoAlternateIcon />
                  </span>
                  {uploadImage && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <CircularProgress />
                    </div>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {formik.values.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`ProductImage ${index + 1}`}
                        className="w-24 h-24 object-cover"
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 0 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </Grid>

              {/* Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>

              {/* Pricing Unit */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Pricing Unit</InputLabel>
                  <Select
                    id="pricingUnit"
                    name="pricingUnit"
                    label="Pricing Unit"
                    onChange={formik.handleChange}
                    value={formik.values.pricingUnit}
                  >
                    <MenuItem value="TONNE">Per Tonne</MenuItem>
                    <MenuItem value="PIECE">Per Piece</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Price Per Unit */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="pricePerUnit"
                  name="pricePerUnit"
                  label="Price per Unit (Ksh)"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.pricePerUnit}
                  error={formik.touched.pricePerUnit && Boolean(formik.errors.pricePerUnit)}
                  helperText={formik.touched.pricePerUnit && formik.errors.pricePerUnit}
                />
              </Grid>

              {/* Quantity */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="quantity"
                  name="quantity"
                  label={formik.values.pricingUnit === "PIECE" ? "Number of Pieces" : "Weight (Tonnes)"}
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.quantity}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>
            </Grid>

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Create Material Item
            </Button>
          </form>
        </div>
      </div>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={menu.error ? "error" : "success"} sx={{ width: "100%" }}>
          {getSafeMessage()}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddMenuForm;



