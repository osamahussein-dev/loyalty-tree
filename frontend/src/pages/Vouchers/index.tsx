import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Container,
  Chip,
  Divider,
  Stack,
  Alert,
} from "@mui/material";
import { Store, CalendarMonth, Redeem } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { redeemVoucher } from "../../store/slices/voucherSlice";
import { updatePoints } from "../../store/slices/authSlice";
import api from "../../utils/api";

interface Voucher {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  imageUrl: string;
  retailer: string;
  expiryDate: string;
}

interface BackendVoucher {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  quantity: number;
  expiryDate: string;
  imageUrl?: string;
  retailerId: string;
  retailer?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const Vouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await api.get("/vouchers/available");
        console.log("Fetched vouchers:", response.data);

        // Transform the data to match our component's expected format
        const transformedVouchers = response.data.map(
          (voucher: BackendVoucher) => ({
            id: voucher.id,
            title: voucher.title,
            description: voucher.description,
            pointsCost: voucher.pointsRequired,
            imageUrl: voucher.imageUrl || "/images/eco-store.jpg", // Fallback image
            retailer: voucher.retailer?.name || "Eco Retailer",
            expiryDate: voucher.expiryDate,
          })
        );

        setVouchers(transformedVouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        enqueueSnackbar("Failed to load vouchers", { variant: "error" });

        // Fallback to mock data if API fails
        setVouchers([
          {
            id: "1",
            title: "Green Coffee Voucher",
            description: "10% off on any eco-friendly coffee purchase",
            pointsCost: 500,
            imageUrl: "/images/coffee-voucher.jpg",
            retailer: "Green Coffee Co.",
            expiryDate: "2024-12-31",
          },
          {
            id: "2",
            title: "Eco Store Discount",
            description: "15% off on sustainable products",
            pointsCost: 750,
            imageUrl: "/images/eco-store.jpg",
            retailer: "EcoStore",
            expiryDate: "2024-12-31",
          },
        ]);
      }
    };

    fetchVouchers();
  }, [enqueueSnackbar]);

  const handleRedeemClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setDialogOpen(true);
  };

  const handleRedeem = async () => {
    if (!selectedVoucher || !user) return;

    if (user.points < selectedVoucher.pointsCost) {
      enqueueSnackbar("Not enough points to redeem this voucher", {
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Use Redux action to redeem voucher
      const result = await dispatch(redeemVoucher(selectedVoucher.id));

      if (redeemVoucher.fulfilled.match(result)) {
        // Update user points in the auth state
        dispatch(updatePoints(result.payload.remainingPoints));

        enqueueSnackbar("Voucher redeemed successfully!", {
          variant: "success",
        });
        setDialogOpen(false);

        // Refresh vouchers list after redemption
        const vouchersResponse = await api.get("/vouchers/available");
        const transformedVouchers = vouchersResponse.data.map(
          (voucher: BackendVoucher) => ({
            id: voucher.id,
            title: voucher.title,
            description: voucher.description,
            pointsCost: voucher.pointsRequired,
            imageUrl: voucher.imageUrl || "/images/eco-store.jpg",
            retailer: voucher.retailer?.name || "Eco Retailer",
            expiryDate: voucher.expiryDate,
          })
        );

        setVouchers(transformedVouchers);
      } else {
        // Handle rejection
        const errorMessage =
          (result.payload as string) || "Failed to redeem voucher";
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    } catch (err) {
      console.error("Error redeeming voucher:", err);
      enqueueSnackbar("Failed to redeem voucher", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
            }}
          >
            <Redeem color="primary" sx={{ fontSize: 32 }} />
            Available Vouchers
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Redeem your points for exclusive offers from our eco-friendly
            partners
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {vouchers.map((voucher) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={voucher.imageUrl}
                  alt={voucher.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      fontWeight="medium"
                    >
                      {voucher.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {voucher.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        icon={<Store fontSize="small" />}
                        label={voucher.retailer}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        icon={<CalendarMonth fontSize="small" />}
                        label={`Expires: ${new Date(
                          voucher.expiryDate
                        ).toLocaleDateString()}`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={`${voucher.pointsCost} points`}
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleRedeemClick(voucher)}
                        disabled={!user || user.points < voucher.pointsCost}
                        startIcon={<Redeem />}
                        sx={{ borderRadius: 8 }}
                      >
                        Redeem
                      </Button>
                    </Box>

                    {user && user.points < voucher.pointsCost && (
                      <Alert
                        severity="info"
                        sx={{ mt: 2, fontSize: "0.75rem" }}
                      >
                        You need {voucher.pointsCost - user.points} more points
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        <Dialog
          open={dialogOpen}
          onClose={() => !loading && setDialogOpen(false)}
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Confirm Redemption
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {selectedVoucher && (
              <Box sx={{ py: 1 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  {selectedVoucher.title}
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedVoucher.description}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Store fontSize="small" color="primary" />
                  <Typography variant="body2">
                    {selectedVoucher.retailer}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">Your current points:</Typography>
                  <Chip
                    label={user?.points || 0}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Typography variant="body2">Points to redeem:</Typography>
                  <Chip
                    label={selectedVoucher.pointsCost}
                    color="secondary"
                    size="small"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Typography variant="body2">Remaining points:</Typography>
                  <Chip
                    label={(user?.points || 0) - selectedVoucher.pointsCost}
                    color="default"
                    size="small"
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setDialogOpen(false)}
              disabled={loading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRedeem}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Redeem />}
            >
              {loading ? "Redeeming..." : "Confirm Redemption"}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default Vouchers;
