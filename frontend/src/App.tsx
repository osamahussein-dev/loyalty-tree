import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { theme } from "./theme";
import AppRoutes from "./routes";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { getProfile } from "./store/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Fetch fresh user data on app initialization if user is logged in
    if (token) {
      dispatch(getProfile());
    }
  }, [dispatch, token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Router>
          <AppRoutes />
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
