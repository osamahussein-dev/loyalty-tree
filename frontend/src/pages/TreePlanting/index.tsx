import { useState } from "react";
import api from "../../utils/api";
import { useAppDispatch } from "../../hooks/redux";
import { updatePoints } from "../../store/slices/authSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Paper,
  Container,
  Stack,
  Divider,
  Alert,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  CloudUpload,
  Park,
  LocationOn,
  PhotoCamera,
  Send,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSnackbar } from "notistack";

interface Location {
  lat: number;
  lng: number;
}

const LocationPicker = ({
  onLocationSelect,
}: {
  onLocationSelect: (location: Location) => void;
}) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const TreePlanting = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        enqueueSnackbar("Image size should be less than 5MB", {
          variant: "error",
        });
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedLocation || !selectedImage) {
      enqueueSnackbar("Please select both location and image", {
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Create a FormData object to send the image and location data
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("latitude", selectedLocation.lat.toString());
      formData.append("longitude", selectedLocation.lng.toString());

      // Upload the image to the server
      const response = await api.post("/trees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update user points in Redux store
      if (response.data.newTotalPoints) {
        dispatch(updatePoints(response.data.newTotalPoints));

        // Update localStorage with new points
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.points = response.data.newTotalPoints;
          localStorage.setItem("user", JSON.stringify(user));
        }
      }

      // Show success message with points awarded
      enqueueSnackbar(
        `Tree planting submitted successfully! You earned 100 points!`,
        {
          variant: "success",
        }
      );

      // Reset form
      setSelectedImage(null);
      setSelectedLocation(null);
    } catch (error) {
      console.error("Error submitting tree planting:", error);
      enqueueSnackbar("Failed to submit tree planting", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
              <Park color="primary" sx={{ fontSize: 32 }} />
              Plant a Tree
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Document your tree planting to earn points and help the
              environment
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Box sx={{ flex: 1 }}>
              <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: "medium",
                      mb: 2,
                    }}
                  >
                    <LocationOn color="primary" />
                    Select Planting Location
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      height: 400,
                      overflow: "hidden",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <MapContainer
                      center={{ lat: 51.505, lng: -0.09 }}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationPicker onLocationSelect={setSelectedLocation} />
                      {selectedLocation && (
                        <Marker
                          position={[
                            selectedLocation.lat,
                            selectedLocation.lng,
                          ]}
                        />
                      )}
                    </MapContainer>
                  </Paper>
                  {selectedLocation ? (
                    <Chip
                      icon={<LocationOn fontSize="small" />}
                      label={`${selectedLocation.lat.toFixed(
                        6
                      )}, ${selectedLocation.lng.toFixed(6)}`}
                      color="success"
                      variant="outlined"
                      sx={{ mt: 2 }}
                    />
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Click on the map to select the tree planting location
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: "medium",
                      mb: 2,
                    }}
                  >
                    <PhotoCamera color="primary" />
                    Upload Tree Photo
                  </Typography>
                  <Box
                    sx={{
                      border: "2px dashed",
                      borderColor: selectedImage
                        ? "success.main"
                        : "primary.main",
                      borderRadius: 2,
                      p: 4,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: "action.hover",
                        transform: "translateY(-4px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      },
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    component="label"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageSelect}
                    />
                    {selectedImage ? (
                      <>
                        <CloudUpload
                          color="success"
                          sx={{ fontSize: 48, mb: 2 }}
                        />
                        <Typography fontWeight="medium" color="success.main">
                          {selectedImage.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click to change photo
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CloudUpload
                          color="primary"
                          sx={{ fontSize: 48, mb: 2 }}
                        />
                        <Typography fontWeight="medium">
                          Click to upload tree photo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Max size: 5MB
                        </Typography>
                      </>
                    )}
                  </Box>

                  {loading && (
                    <Box sx={{ width: "100%", mt: 3 }}>
                      <LinearProgress />
                    </Box>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 8,
                      fontWeight: "bold",
                    }}
                    disabled={!selectedLocation || !selectedImage || loading}
                    onClick={handleSubmit}
                    startIcon={<Send />}
                  >
                    {loading ? "Submitting..." : "Submit Tree Planting"}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Stack>

          <Box sx={{ mt: 4 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                How it works:
              </Typography>
              <Typography variant="body2">
                1. Select the exact location where you planted the tree
              </Typography>
              <Typography variant="body2">
                2. Upload a clear photo of the planted tree
              </Typography>
              <Typography variant="body2">
                3. Submit your planting to earn 100 points
              </Typography>
              <Typography variant="body2">
                4. Use your points to redeem vouchers and rewards!
              </Typography>
            </Alert>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TreePlanting;
