import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Park,
  LocalOffer,
  EmojiEvents,
  Timeline,
  CheckCircle,
  Nature,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAppSelector } from "../../hooks/redux";

interface TreeActivity {
  id: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
}

interface VoucherRedemption {
  id: string;
  voucherId: string;
  pointsSpent: number;
  redemptionCode: string;
  status: string;
  createdAt: string;
  voucher: {
    id: string;
    title: string;
    description: string;
    retailer: {
      name: string;
    };
  };
}

interface Activity {
  id: string;
  type: "tree" | "voucher";
  description: string;
  date: string;
  status: string;
}

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch tree plantings
        const treesResponse = await api.get("/trees/my");
        const trees = treesResponse.data;

        // Fetch voucher redemptions (if this endpoint exists)
        let vouchers = [];
        try {
          const vouchersResponse = await api.get("/vouchers/my-redemptions");
          vouchers = vouchersResponse.data;
        } catch {
          console.log("No voucher redemptions endpoint or no redemptions yet");
        }

        // Transform tree plantings to activities
        const treeActivities = trees.map((tree: TreeActivity) => ({
          id: tree.id,
          type: "tree" as const,
          description: `Tree planted at ${tree.latitude.toFixed(
            2
          )}, ${tree.longitude.toFixed(2)}`,
          date: tree.createdAt,
          status: tree.status,
        }));

        // Transform voucher redemptions to activities
        const voucherActivities = vouchers.map(
          (voucher: VoucherRedemption) => ({
            id: voucher.id,
            type: "voucher" as const,
            description: `Redeemed ${voucher.voucher.title}`,
            date: voucher.createdAt,
            status: "completed",
          })
        );

        // Combine and sort by date (newest first)
        const allActivities = [...treeActivities, ...voucherActivities].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
        // Fallback to empty activities
        setActivities([]);
      }
    };

    fetchActivities();
  }, []);

  const stats = [
    {
      title: "Total Points",
      value: user?.points || 0,
      icon: <EmojiEvents color="primary" />,
    },
    {
      title: "Trees Planted",
      value: activities.filter((a) => a.type === "tree").length,
      icon: <Park color="primary" />,
    },
    {
      title: "Vouchers Redeemed",
      value: activities.filter((a) => a.type === "voucher").length,
      icon: <LocalOffer color="primary" />,
    },
  ];

  return (
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
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Nature color="primary" sx={{ fontSize: 32 }} />
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's an overview of your environmental impact and rewards
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ mb: 4 }}
        >
          {stats.map((stat, index) => (
            <Box key={stat.title} sx={{ flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    borderRadius: 2,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "primary.light",
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    textAlign="center"
                  >
                    {stat.title}
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          ))}
        </Stack>

        <Card
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "primary.light",
                color: "primary.contrastText",
              }}
            >
              <Timeline sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Recent Activity
              </Typography>
            </Box>
            <List>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon>
                        {activity.type === "tree" ? (
                          <Avatar sx={{ bgcolor: "success.light" }}>
                            <Park />
                          </Avatar>
                        ) : (
                          <Avatar sx={{ bgcolor: "secondary.light" }}>
                            <LocalOffer />
                          </Avatar>
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            {activity.description}
                          </Typography>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mr: 1 }}
                            >
                              {new Date(activity.date).toLocaleDateString()}
                            </Typography>
                            <Chip
                              size="small"
                              icon={<CheckCircle fontSize="small" />}
                              label={activity.status}
                              color={
                                activity.status === "approved" ||
                                activity.status === "completed"
                                  ? "success"
                                  : "default"
                              }
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider />}
                  </>
                </motion.div>
              ))}
            </List>
          </CardContent>
        </Card>

        {activities.length === 0 && (
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
            <Nature
              sx={{ fontSize: 60, color: "primary.light", mb: 2, opacity: 0.7 }}
            />
            <Typography variant="h6" gutterBottom>
              No Activities Yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 400, mx: "auto" }}
            >
              Start planting trees or redeeming vouchers to see your activity
              here!
            </Typography>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default Dashboard;
