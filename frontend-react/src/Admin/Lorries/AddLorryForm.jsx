import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { uploadToCloudinary } from "../utils/UploadToCloudnary";
import { createLorry } from "../../State/Admin/Lorry/lorry.actions";

const validationSchema = Yup.object({
  plateNumber: Yup.string().required("Plate number is required"),
  lorryName: Yup.string(),
  description: Yup.string(),
  imageUrl: Yup.string().url("Invalid image URL"),
});

const AddLorryForm = () => {
  const dispatch = useDispatch();
  const { lorry = {} } = useSelector((state) => state);
  const { currentQuarry } = useSelector((state) => state.quarry);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const formik = useFormik({
    initialValues: {
      plateNumber: "",
      lorryName: "",
      description: "",
      imageUrl: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const jwt = localStorage.getItem("jwt");

    
      const quarryId = currentQuarry?.id || localStorage.getItem("quarryId");
      console.log("Quarry ID used:", quarryId); 

      if (!quarryId) {
        alert("Quarry ID not found. Please ensure you are managing a quarry.");
        return;
      }

      const payload = {
        plateNumber: values.plateNumber,
        lorryName: values.lorryName,
        description: values.description,
        images: values.imageUrl ? [values.imageUrl] : [],
        quarryId,
        jwt,
      };

      dispatch(createLorry(payload));
      resetForm();
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const uploadedImageUrl = await uploadToCloudinary(file);
    formik.setFieldValue("imageUrl", uploadedImageUrl);
    setUploadingImage(false);
  };

  useEffect(() => {
    if (lorry?.message || lorry?.error) {
      setOpenSnackBar(true);
    }
  }, [lorry?.message, lorry?.error]);

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  return (
    <div className="lg:px-32 px-5 flex justify-center items-center py-10">
      <form onSubmit={formik.handleSubmit} className="space-y-4 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center">Add New Lorry</h1>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <label htmlFor="fileInput">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center border p-3 rounded-md border-gray-600">
                <AddPhotoAlternateIcon />
              </span>
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              {uploadingImage && <CircularProgress size={24} />}
              {formik.values.imageUrl && (
                <div className="mt-2 relative">
                  <img
                    src={formik.values.imageUrl}
                    alt="Lorry"
                    className="w-24 h-24 object-cover rounded"
                  />
                  <IconButton
                    size="small"
                    onClick={() => formik.setFieldValue("imageUrl", "")}
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              )}
            </label>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Plate Number"
              name="plateNumber"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.plateNumber}
              error={formik.touched.plateNumber && Boolean(formik.errors.plateNumber)}
              helperText={formik.touched.plateNumber && formik.errors.plateNumber}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lorry Name (optional)"
              name="lorryName"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.lorryName}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description (optional)"
              name="description"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.description}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={uploadingImage}
        >
          Add Lorry
        </Button>
      </form>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {(lorry?.message || lorry?.error) && (
          <Alert severity={lorry?.error ? "error" : "success"} sx={{ width: "100%" }}>
            {lorry?.message || lorry?.error}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default AddLorryForm;






