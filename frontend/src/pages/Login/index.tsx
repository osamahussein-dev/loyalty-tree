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
import { login } from "../../store/slices/authSlice";
import { useSnackbar } from "notistack";
import { useAppDispatch } from "../../hooks/redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    try {
      console.log("Attempting login with:", { email, role });
      const result = await dispatch(login({ email, password, role }));

      if (login.fulfilled.match(result)) {
        console.log("Login successful:", result.payload);

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
      } else if (login.rejected.match(result)) {
        console.error("Login rejected:", result.error, result.payload);
        throw new Error((result.payload as string) || "Login failed");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials.";
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Park
                sx={{
                  fontSize: 56,
                  color: "primary.main",
                  mb: 2,
                }}
              />
            </motion.div>
            <Typography component="h1" variant="h4" gutterBottom>
              Welcome to LoyaltyTree
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={4}
              textAlign="center"
            >
              Plant trees, earn points, redeem rewards
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  mt: 2,
                  fontSize: "1.1rem",
                }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Don't have an account? Sign Up
                </Link>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Login;
