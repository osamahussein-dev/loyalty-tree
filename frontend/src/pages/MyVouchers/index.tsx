import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Chip,
  Divider,
  Stack,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Store,
  CalendarMonth,
  LocalOffer,
  ContentCopy,
  CheckCircle,
  Schedule,
  Cancel,
  QrCode,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import {
  fetchMyRedemptions,
  type VoucherRedemption,
} from "../../store/slices/voucherSlice";

const MyVouchers = () => {
  const [selectedVoucher, setSelectedVoucher] =
    useState<VoucherRedemption | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { redemptions, loading } = useAppSelector((state) => state.vouchers);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchMyRedemptions());
  }, [dispatch]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    enqueueSnackbar("Voucher code copied to clipboard!", {
      variant: "success",
    });
  };

  const handleViewDetails = (voucher: VoucherRedemption) => {
    setSelectedVoucher(voucher);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "used":
        return "default";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle fontSize="small" />;
      case "used":
        return <Schedule fontSize="small" />;
      case "expired":
        return <Cancel fontSize="small" />;
      default:
        return <Schedule fontSize="small" />;
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
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
            <LocalOffer color="primary" sx={{ fontSize: 32 }} />
            My Vouchers
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View and manage your redeemed vouchers
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Typography>Loading your vouchers...</Typography>
          </Box>
        ) : redemptions.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <LocalOffer
              sx={{ fontSize: 60, color: "primary.light", mb: 2, opacity: 0.7 }}
            />
            <Typography variant="h6" gutterBottom>
              No Vouchers Yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 400, mx: "auto" }}
            >
              You haven't redeemed any vouchers yet. Visit the vouchers page to
              redeem your points for exclusive offers!
            </Typography>
          </Box>
        ) : (
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
            {redemptions.map((redemption) => (
              <Box key={redemption.id}>
                <motion.div
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
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                      opacity: isExpired(redemption.expiresAt) ? 0.7 : 1,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          component="div"
                          fontWeight="medium"
                          gutterBottom
                        >
                          {redemption.voucher.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {redemption.voucher.description}
                        </Typography>
                      </Box>

                      <Stack spacing={1} sx={{ mb: 2 }}>
                        <Chip
                          icon={<Store fontSize="small" />}
                          label={redemption.voucher.retailer.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          icon={getStatusIcon(redemption.status)}
                          label={redemption.status.toUpperCase()}
                          size="small"
                          color={
                            getStatusColor(redemption.status) as
                              | "success"
                              | "default"
                              | "error"
                          }
                        />
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Voucher Code
                            </Typography>
                            <Typography
                              variant="h6"
                              fontFamily="monospace"
                              fontWeight="bold"
                              color="primary.main"
                            >
                              {redemption.redemptionCode}
                            </Typography>
                          </Box>
                          <Tooltip title="Copy code">
                            <IconButton
                              onClick={() =>
                                handleCopyCode(redemption.redemptionCode)
                              }
                              size="small"
                              color="primary"
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                          icon={<CalendarMonth fontSize="small" />}
                          label={`Expires: ${new Date(
                            redemption.expiresAt
                          ).toLocaleDateString()}`}
                          size="small"
                          color={
                            isExpired(redemption.expiresAt)
                              ? "error"
                              : "secondary"
                          }
                          variant="outlined"
                        />
                      </Stack>

                      {isExpired(redemption.expiresAt) && (
                        <Alert
                          severity="error"
                          sx={{ mt: 2, fontSize: "0.75rem" }}
                        >
                          This voucher has expired
                        </Alert>
                      )}

                      <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleViewDetails(redemption)}
                          startIcon={<QrCode />}
                          size="small"
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Voucher Details
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {selectedVoucher && (
              <Box sx={{ py: 1 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  {selectedVoucher.voucher.title}
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedVoucher.voucher.description}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Store fontSize="small" color="primary" />
                  <Typography variant="body2">
                    {selectedVoucher.voucher.retailer.name}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    bgcolor: "primary.light",
                    borderRadius: 2,
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="caption" color="primary.contrastText">
                    Voucher Code
                  </Typography>
                  <Typography
                    variant="h4"
                    fontFamily="monospace"
                    fontWeight="bold"
                    color="primary.contrastText"
                    sx={{ mb: 1 }}
                  >
                    {selectedVoucher.redemptionCode}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      handleCopyCode(selectedVoucher.redemptionCode)
                    }
                    startIcon={<ContentCopy />}
                    size="small"
                  >
                    Copy Code
                  </Button>
                </Paper>

                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">Status:</Typography>
                    <Chip
                      icon={getStatusIcon(selectedVoucher.status)}
                      label={selectedVoucher.status.toUpperCase()}
                      size="small"
                      color={
                        getStatusColor(selectedVoucher.status) as
                          | "success"
                          | "default"
                          | "error"
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">Points Spent:</Typography>
                    <Chip
                      label={`${selectedVoucher.pointsSpent} points`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">Redeemed On:</Typography>
                    <Typography variant="body2">
                      {new Date(selectedVoucher.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">Expires On:</Typography>
                    <Typography
                      variant="body2"
                      color={
                        isExpired(selectedVoucher.expiresAt)
                          ? "error"
                          : "text.primary"
                      }
                    >
                      {new Date(selectedVoucher.expiresAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setDialogOpen(false)} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default MyVouchers;
