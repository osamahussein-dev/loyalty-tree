import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TreePlanting from "../pages/TreePlanting";
import Vouchers from "../pages/Vouchers";
import MyVouchers from "../pages/MyVouchers";
import RetailerDashboard from "../pages/RetailerDashboard";
import CreateVoucher from "../pages/CreateVoucher";
import Profile from "../pages/Profile";
import { useAppSelector } from "../hooks/redux";
import TreeHistory from "../pages/TreeHistory";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="plant-tree" element={<TreePlanting />} />
        <Route path="vouchers" element={<Vouchers />} />
        <Route path="my-vouchers" element={<MyVouchers />} />
        <Route path="profile" element={<Profile />} />
        <Route path="tree-history" element={<TreeHistory />} />
        <Route
          path="retailer/dashboard"
          element={
            <ProtectedRoute roles={["retailer"]}>
              <RetailerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="retailer/vouchers/create"
          element={
            <ProtectedRoute roles={["retailer"]}>
              <CreateVoucher />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
