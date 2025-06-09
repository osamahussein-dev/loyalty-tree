import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Park,
  LocalOffer,
  Person,
  ExitToApp,
  Nature as EcoIcon,
  Store as StoreIcon,
  AccountCircle,
  History,
  CardGiftcard,
} from "@mui/icons-material";
import { logout } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Close drawer when navigating on mobile
  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    ...(user?.role === "retailer"
      ? [
          {
            text: "Retailer Dashboard",
            icon: <Dashboard />,
            path: "/retailer/dashboard",
          },
          {
            text: "Create Voucher",
            icon: <LocalOffer />,
            path: "/retailer/vouchers/create",
          },
        ]
      : [
          { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
          { text: "Plant Tree", icon: <Park />, path: "/plant-tree" },
          { text: "Tree History", icon: <History />, path: "/tree-history" },
          { text: "Vouchers", icon: <LocalOffer />, path: "/vouchers" },
          { text: "My Vouchers", icon: <CardGiftcard />, path: "/my-vouchers" },
          { text: "Profile", icon: <AccountCircle />, path: "/profile" },
        ]),
  ];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", px: 2 }}>
        <EcoIcon sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          LoyaltyTree
        </Typography>
      </Toolbar>
      <Divider />

      {user && (
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
              mr: 2,
            }}
          >
            {user.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" noWrap>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.role === "retailer" ? "Retailer" : "Customer"}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider />

      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List sx={{ px: 1, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center" }}
          >
            <EcoIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              LoyaltyTree
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user?.role !== "retailer" && (
              <Tooltip title="Your points">
                <Badge
                  badgeContent={user?.points}
                  color="primary"
                  max={9999}
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.75rem",
                      height: "1.5rem",
                      minWidth: "1.5rem",
                      padding: "0 6px",
                    },
                  }}
                >
                  <Chip
                    icon={<EcoIcon fontSize="small" />}
                    label="Points"
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                </Badge>
              </Tooltip>
            )}

            {user?.role === "retailer" && (
              <Tooltip title="Retailer account">
                <Chip
                  icon={<StoreIcon fontSize="small" />}
                  label="Retailer"
                  color="secondary"
                  size="small"
                />
              </Tooltip>
            )}

            <IconButton onClick={handleMenu} size="medium" color="primary">
              <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                {user?.name?.[0]}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 2,
                sx: { mt: 1, minWidth: 180 },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
              >
                <ListItemIcon>
                  <Person fontSize="small" color="primary" />
                </ListItemIcon>
                <Typography variant="body2">Profile</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" color="error" />
                </ListItemIcon>
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "background.default",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default Layout;
