import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Park,
  CalendarToday,
  LocationOn,
  EmojiEvents,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import api from "../../utils/api";
import { format } from "date-fns";

interface TreePlanting {
  id: string;
  imageUrl: string;
  status: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

const TreeHistory = () => {
  const [treePlantings, setTreePlantings] = useState<TreePlanting[]>([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchTreePlantings = async () => {
      try {
        setLoading(true);
        const response = await api.get("/trees/my");
        setTreePlantings(response.data);
      } catch (error) {
        console.error("Error fetching tree plantings:", error);
        enqueueSnackbar("Failed to load tree planting history", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTreePlantings();
  }, [enqueueSnackbar]);

  if (loading) {
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
            Your Tree Planting History
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Track your contribution to the environment and points earned
          </Typography>
        </Box>

        {treePlantings.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            You haven't planted any trees yet. Go to the "Plant a Tree" page to
            get started!
          </Alert>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {treePlantings.map((tree, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:3000${tree.imageUrl}`}
                    alt={`Tree planted on ${format(
                      new Date(tree.createdAt),
                      "MMM d, yyyy"
                    )}`}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Chip
                        icon={<CalendarToday fontSize="small" />}
                        label={format(new Date(tree.createdAt), "MMM d, yyyy")}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<EmojiEvents fontSize="small" />}
                        label="+100 points"
                        color="success"
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <LocationOn fontSize="small" color="primary" />
                      Location: {tree.latitude.toFixed(6)},{" "}
                      {tree.longitude.toFixed(6)}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", color: "text.secondary" }}
                    >
                      Thank you for contributing to a greener planet!
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default TreeHistory;
