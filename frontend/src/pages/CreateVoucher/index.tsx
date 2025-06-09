import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Paper,
} from "@mui/material";
import { Store, LocalOffer, CloudUpload } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useAppDispatch } from "../../hooks/redux";
import { createVoucher } from "../../store/slices/voucherSlice";

const CreateVoucher = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointsCost, setPointsCost] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !pointsCost ||
      !quantity ||
      !expiryDate ||
      !selectedImage
    ) {
      enqueueSnackbar("Please fill in all fields including the voucher image", {
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Create FormData for the API request
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("pointsRequired", pointsCost.toString());
      formData.append("quantity", quantity.toString());
      formData.append("expiryDate", expiryDate.toISOString());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      console.log("Submitting voucher with data:", {
        title,
        description,
        pointsRequired: pointsCost,
        quantity,
        expiryDate: expiryDate.toISOString(),
        image: selectedImage ? selectedImage.name : "No image",
      });

      const resultAction = await dispatch(createVoucher(formData));

      if (createVoucher.fulfilled.match(resultAction)) {
        enqueueSnackbar("Voucher created successfully!", {
          variant: "success",
        });
        // Reset form
        setTitle("");
        setDescription("");
        setPointsCost("");
        setQuantity("");
        setExpiryDate(null);
        setSelectedImage(null);
        setImagePreview(null);
      } else if (
        createVoucher.rejected.match(resultAction) &&
        resultAction.payload
      ) {
        enqueueSnackbar(resultAction.payload as string, { variant: "error" });
      } else {
        enqueueSnackbar("Failed to create voucher. Please try again.", {
          variant: "error",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create voucher. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <LocalOffer sx={{ fontSize: 32, mr: 2, color: "primary.main" }} />
          <Typography variant="h4">Create New Voucher</Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="body1" paragraph>
            Create a new voucher that customers can redeem with their earned
            points. Attractive vouchers with good value will encourage more tree
            planting!
          </Typography>
        </Paper>

        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 3 }}>
                <Box>
                  <TextField
                    required
                    fullWidth
                    label="Voucher Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., 20% Off All Eco-Products"
                  />
                </Box>
                <Box>
                  <TextField
                    required
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what customers will get with this voucher"
                    multiline
                    rows={3}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <Box>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="points-cost">Points Cost</InputLabel>
                      <OutlinedInput
                        id="points-cost"
                        value={pointsCost}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^[0-9]+$/.test(value)) {
                            setPointsCost(value === "" ? "" : Number(value));
                          }
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <Store fontSize="small" />
                          </InputAdornment>
                        }
                        label="Points Cost"
                      />
                      <FormHelperText>
                        How many points a customer needs to redeem this voucher
                      </FormHelperText>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="quantity">
                        Quantity Available
                      </InputLabel>
                      <OutlinedInput
                        id="quantity"
                        value={quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^[0-9]+$/.test(value)) {
                            setQuantity(value === "" ? "" : Number(value));
                          }
                        }}
                        label="Quantity Available"
                      />
                      <FormHelperText>
                        How many vouchers are available for redemption
                      </FormHelperText>
                    </FormControl>
                  </Box>
                  <Box>
                    <TextField
                      label="Expiry Date"
                      type="date"
                      fullWidth
                      required
                      value={
                        expiryDate ? expiryDate.toISOString().split("T")[0] : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : null;
                        setExpiryDate(date);
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText="When this voucher will expire"
                      inputProps={{
                        min: new Date().toISOString().split("T")[0],
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Voucher Image*
                  </Typography>
                  <Box
                    sx={{
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 2,
                      textAlign: "center",
                      mb: 2,
                      cursor: "pointer",
                      bgcolor: "background.paper",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                      },
                    }}
                    component="label"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                      required
                    />
                    {imagePreview ? (
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Voucher preview"
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          objectFit: "contain",
                          mb: 2,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          py: 3,
                        }}
                      >
                        <CloudUpload
                          color="primary"
                          sx={{ fontSize: 48, mb: 1 }}
                        />
                        <Typography variant="body1" gutterBottom>
                          Click or drag to upload voucher image
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Recommended size: 800x600px, max 2MB
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? "Creating Voucher..." : "Create Voucher"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default CreateVoucher;
