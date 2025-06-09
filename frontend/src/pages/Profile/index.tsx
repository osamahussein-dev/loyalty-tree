import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { Edit, Save, Cancel, Nature as EcoIcon } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { getProfile, updateProfile } from "../../store/slices/authSlice";
import { useSnackbar } from "notistack";

const Profile = () => {
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit mode, reset fields
      if (user) {
        setName(user.name);
        setEmail(user.email);
      }
    }
    setEditMode(!editMode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError(null);

    try {
      const resultAction = await dispatch(
        updateProfile({
          name,
          email,
        })
      );

      if (updateProfile.fulfilled.match(resultAction)) {
        setEditMode(false);
        enqueueSnackbar("Profile updated successfully", { variant: "success" });
      } else if (updateProfile.rejected.match(resultAction)) {
        const errorMessage =
          (resultAction.payload as string) || "Failed to update profile";
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";

      setError(errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Profile Information */}
          <Box sx={{ flex: { md: 2 }, width: "100%" }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
              }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "primary.main",
                      fontSize: "2rem",
                      mr: 3,
                    }}
                  >
                    {user?.name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="medium">
                      {user?.name}
                    </Typography>
                    <Chip
                      label={
                        user?.role === "retailer" ? "Retailer" : "Customer"
                      }
                      color={
                        user?.role === "retailer" ? "secondary" : "primary"
                      }
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>

                <Divider />

                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editMode}
                  fullWidth
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />

                <TextField
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editMode}
                  fullWidth
                  variant={editMode ? "outlined" : "filled"}
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {!editMode ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={handleEditToggle}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleEditToggle}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<Save />}
                        disabled={updateLoading}
                      >
                        {updateLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Points Summary (for regular users) */}
          {user?.role !== "retailer" && (
            <Box sx={{ flex: { md: 1 }, width: "100%" }}>
              <Card
                sx={{
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    py: 4,
                    flexGrow: 1,
                  }}
                >
                  <EcoIcon
                    color="primary"
                    sx={{ fontSize: 60, mb: 2, opacity: 0.8 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Your Points
                  </Typography>
                  <Typography
                    variant="h3"
                    color="primary.main"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    {user?.points || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Plant more trees to earn points and redeem them for exciting
                    rewards!
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </motion.div>
    </Container>
  );
};

export default Profile;
