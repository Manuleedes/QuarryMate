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
import DeleteIcon from "@mui/icons-material/Delete";
import { Create } from "@mui/icons-material";
import {
  deleteLorry,
  getLorriesByQuarryId,
  updateLorryAvailability,
} from "../../State/Admin/Lorry/lorry.actions";

const LorryTable = ({ name, isDashboard = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lorry = {}, quarry = {}, auth = {} } = useSelector((state) => state);
  const jwt = auth.jwt || localStorage.getItem("jwt");

  useEffect(() => {
    if (quarry.usersQuarry?.id) {
      dispatch(getLorriesByQuarryId({ quarryId: quarry.usersQuarry.id, jwt }));
    }
  }, [quarry.usersQuarry?.id]);

  const handleToggleAvailability = (lorryId, currentStatus) => {
    dispatch(updateLorryAvailability({ lorryId, available: !currentStatus, jwt }));
  };

  const handleDelete = (lorryId) => {
    dispatch(deleteLorry({ lorryId, jwt }));
  };

  return (
    <Box width="100%">
      <Card className="mt-1">
        <CardHeader
          title={name || "Lorries"}
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
          action={
            <IconButton onClick={() => navigate("/admin/quarry/add-lorry")}>
              <Create />
            </IconButton>
          }
        />

        <TableContainer>
          <Table aria-label="lorry table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Plate Number</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Capacity (T)</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                {!isDashboard && (
                  <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {lorry?.lorries && lorry.lorries.length > 0 ? (
                lorry.lorries.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Avatar
                        alt={item.name || "Lorry"}
                        src={item.images && item.images.length > 0 ? item.images[0] : ""}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                          {item.name || "N/A"}
                        </Typography>
                        <Typography variant="caption">
                          {item.description || "No description"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>{item.numberPlate}</TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      {item.capacityInTonnes}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        color={item.available ? "success" : "error"}
                        variant="text"
                        onClick={() => handleToggleAvailability(item.id, item.available)}
                      >
                        {item.available ? "available" : "unavailable"}
                      </Button>
                    </TableCell>

                    {!isDashboard && (
                      <TableCell sx={{ textAlign: "center" }}>
                        <IconButton onClick={() => handleDelete(item.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No lorries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={lorry?.loading || false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default LorryTable;



  