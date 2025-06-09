import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  CardMedia,
} from "@mui/material";
import {
  Add as AddIcon,
  Store as StoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import {
  fetchRetailerVouchers,
  fetchRetailerStats,
  deleteVoucher,
  updateVoucher,
} from "../../store/slices/voucherSlice";
import type { Voucher } from "../../store/slices/voucherSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { motion } from "framer-motion";

const RetailerDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { vouchers, stats, loading, error } = useAppSelector(
    (state) => state.vouchers
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Redirect if not a retailer
    if (user && user.role !== "retailer") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const fetchData = useCallback(() => {
    console.log("Fetching retailer data...");
    dispatch(fetchRetailerVouchers())
      .then((result) => {
        console.log("Vouchers fetch result:", result);
      })
      .catch((error) => {
        console.error("Error fetching vouchers:", error);
      });

    dispatch(fetchRetailerStats())
      .then((result) => {
        console.log("Stats fetch result:", result);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  const handleCreateVoucher = () => {
    navigate("/retailer/vouchers/create");
  };

  const handleEditClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setDeleteDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedVoucher(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedVoucher(null);
  };

  const handleEditVoucher = async () => {
    if (selectedVoucher) {
      try {
        // Create FormData for the API request
        const formData = new FormData();
        formData.append("title", selectedVoucher.title);
        formData.append("description", selectedVoucher.description);
        formData.append(
          "pointsRequired",
          selectedVoucher.pointsRequired.toString()
        );
        formData.append("quantity", selectedVoucher.quantity.toString());
        formData.append(
          "expiryDate",
          new Date(selectedVoucher.expiryDate).toISOString()
        );

        const resultAction = await dispatch(
          updateVoucher({ id: selectedVoucher.id, data: formData })
        );

        if (updateVoucher.fulfilled.match(resultAction)) {
          enqueueSnackbar("Voucher updated successfully!", {
            variant: "success",
          });
          handleEditDialogClose();
        } else if (
          updateVoucher.rejected.match(resultAction) &&
          resultAction.payload
        ) {
          enqueueSnackbar(resultAction.payload as string, { variant: "error" });
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update voucher";
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    }
  };

  const handleDeleteVoucher = async () => {
    if (selectedVoucher) {
      try {
        const resultAction = await dispatch(deleteVoucher(selectedVoucher.id));

        if (deleteVoucher.fulfilled.match(resultAction)) {
          enqueueSnackbar("Voucher deleted successfully!", {
            variant: "success",
          });
          handleDeleteDialogClose();
        } else if (
          deleteVoucher.rejected.match(resultAction) &&
          resultAction.payload
        ) {
          enqueueSnackbar(resultAction.payload as string, { variant: "error" });
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete voucher";
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <StoreIcon sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
          <Typography variant="h4" component="h1">
            Retailer Dashboard
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 3,
          }}
        >
          {/* Summary Cards */}
          <Box sx={{ gridColumn: { xs: "span 12", sm: "span 4" } }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Active Vouchers
                </Typography>
                <Typography
                  variant="h3"
                  color="primary.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {stats?.activeVouchers || 0}
                </Typography>
              </Paper>
            </motion.div>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 12", sm: "span 4" } }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Total Redemptions
                </Typography>
                <Typography
                  variant="h3"
                  color="primary.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {stats?.totalRedemptions || 0}
                </Typography>
              </Paper>
            </motion.div>
          </Box>

          <Box sx={{ gridColumn: { xs: "span 12", sm: "span 4" } }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Points Redeemed
                </Typography>
                <Typography
                  variant="h3"
                  color="primary.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {stats?.totalPointsRedeemed || 0}
                </Typography>
              </Paper>
            </motion.div>
          </Box>

          {/* Vouchers Section */}
          <Box sx={{ gridColumn: "span 12", mt: 4 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h5">Your Vouchers</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateVoucher}
              >
                Create Voucher
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {loading ? (
                <Typography>Loading vouchers...</Typography>
              ) : !vouchers || vouchers.length === 0 ? (
                <Typography>
                  No vouchers found. Create your first voucher!
                </Typography>
              ) : (
                Array.isArray(vouchers) &&
                vouchers.map((voucher, index) => (
                  <Box key={voucher.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 2,
                          boxShadow: 3,
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={
                            voucher.imageUrl ||
                            `https://source.unsplash.com/random/300x200?nature,${index}`
                          }
                          alt={voucher.title}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {voucher.title}
                          </Typography>
                          <Typography color="text.secondary" paragraph>
                            {voucher.description}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ mb: 1 }}
                          >
                            By:{" "}
                            {voucher.retailer?.name ||
                              user?.name ||
                              "Your Store"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Points:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {voucher.pointsRequired}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Available:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {voucher.quantity}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Expires:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {new Date(
                                voucher.expiryDate
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(voucher)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(voucher)}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Voucher</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={selectedVoucher?.title || ""}
              onChange={(e) => {
                if (selectedVoucher) {
                  setSelectedVoucher({
                    ...selectedVoucher,
                    title: e.target.value,
                  });
                }
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={selectedVoucher?.description || ""}
              onChange={(e) => {
                if (selectedVoucher) {
                  setSelectedVoucher({
                    ...selectedVoucher,
                    description: e.target.value,
                  });
                }
              }}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor="points-required">Points Required</InputLabel>
              <OutlinedInput
                id="points-required"
                value={selectedVoucher?.pointsRequired || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^[0-9]+$/.test(value)) {
                    if (selectedVoucher) {
                      setSelectedVoucher({
                        ...selectedVoucher,
                        pointsRequired: value === "" ? 0 : Number(value),
                      });
                    }
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <LocalOffer fontSize="small" />
                  </InputAdornment>
                }
                label="Points Required"
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="quantity">Quantity Available</InputLabel>
              <OutlinedInput
                id="quantity"
                value={selectedVoucher?.quantity || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^[0-9]+$/.test(value)) {
                    if (selectedVoucher) {
                      setSelectedVoucher({
                        ...selectedVoucher,
                        quantity: value === "" ? 0 : Number(value),
                      });
                    }
                  }
                }}
                label="Quantity Available"
              />
            </FormControl>
            <TextField
              label="Expiry Date"
              type="date"
              fullWidth
              value={selectedVoucher?.expiryDate.split("T")[0] || ""}
              onChange={(e) => {
                if (selectedVoucher) {
                  setSelectedVoucher({
                    ...selectedVoucher,
                    expiryDate: e.target.value,
                  });
                }
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button
            onClick={handleEditVoucher}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Voucher</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the voucher "
            {selectedVoucher?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button
            onClick={handleDeleteVoucher}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RetailerDashboard;
