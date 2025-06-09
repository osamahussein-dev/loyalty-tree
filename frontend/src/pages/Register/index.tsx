import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Park, Person, Store } from "@mui/icons-material";
import { register } from "../../store/slices/authSlice";
import { useSnackbar } from "notistack";
import { useAppDispatch } from "../../hooks/redux";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "retailer">("customer");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleRoleChange = (
    event: React.MouseEvent<HTMLElement>,
    newRole: "customer" | "retailer"
  ) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting registration with:", { email, name, role });
      const result = await dispatch(register({ email, password, name, role }));

      if (register.fulfilled.match(result)) {
        console.log("Registration successful:", result.payload);

        // Store token and user in localStorage
        localStorage.setItem("token", result.payload.token);
        localStorage.setItem("user", JSON.stringify(result.payload.user));

        const userRole = result.payload.user.role;
        console.log("User role:", userRole);

        if (userRole === "retailer") {
          navigate("/retailer/dashboard");
        } else if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else if (register.rejected.match(result)) {
        console.error("Registration rejected:", result.error, result.payload);
        throw new Error((result.payload as string) || "Registration failed");
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      disableGutters
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          mx: 2,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Park sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
        </motion.div>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Create your LoyaltyTree Account
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={4}
              textAlign="center"
            >
              Join us in making the world greener
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={handleRoleChange}
                aria-label="account type"
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="customer" aria-label="customer account">
                  <Person sx={{ mr: 1 }} /> Customer
                </ToggleButton>
                <ToggleButton value="retailer" aria-label="retailer account">
                  <Store sx={{ mr: 1 }} /> Retailer
                </ToggleButton>
              </ToggleButtonGroup>

              <TextField
                required
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword !== "" && password !== confirmPassword}
                helperText={
                  confirmPassword !== "" && password !== confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Already have an account? Sign In
                </Link>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Register;
