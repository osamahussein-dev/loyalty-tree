import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Chip,
  Paper,
} from '@mui/material';
import {
  AdminPanelSettings,
  Park,
  Check,
  Close,
  Visibility,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useAppDispatch } from '../../hooks/redux';

interface TreeSubmission {
  id: string;
  userId: string;
  userName: string;
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [submissions, setSubmissions] = useState<TreeSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<TreeSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // TODO: Fetch submissions from backend
    // For now, using mock data
    setSubmissions([
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        location: { lat: 51.505, lng: -0.09 },
        imageUrl: '/images/tree1.jpg',
        status: 'pending',
        submittedAt: '2024-03-15T10:00:00Z',
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        location: { lat: 51.51, lng: -0.1 },
        imageUrl: '/images/tree2.jpg',
        status: 'pending',
        submittedAt: '2024-03-15T11:00:00Z',
      },
    ]);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewSubmission = (submission: TreeSubmission) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;

    setLoading(true);
    try {
      // TODO: Implement submission approval
      // await dispatch(approveTreeSubmission(selectedSubmission.id));
      enqueueSnackbar('Tree planting approved successfully!', { variant: 'success' });
      setDialogOpen(false);
      // Update local state
      setSubmissions(submissions.map(s => 
        s.id === selectedSubmission.id ? { ...s, status: 'approved' } : s
      ));
    } catch (error) {
      enqueueSnackbar('Failed to approve submission', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    setLoading(true);
    try {
      // TODO: Implement submission rejection
      // await dispatch(rejectTreeSubmission(selectedSubmission.id));
      enqueueSnackbar('Tree planting rejected', { variant: 'info' });
      setDialogOpen(false);
      // Update local state
      setSubmissions(submissions.map(s => 
        s.id === selectedSubmission.id ? { ...s, status: 'rejected' } : s
      ));
    } catch (error) {
      enqueueSnackbar('Failed to reject submission', { variant: 'error' });
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
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminPanelSettings color="primary" />
          Admin Dashboard
        </Typography>

        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Tree Submissions" icon={<Park />} />
            <Tab label="User Management" icon={<AdminPanelSettings />} />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <List>
            {submissions.map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ListItemText
                        primary={`Submission by ${submission.userName}`}
                        secondary={new Date(submission.submittedAt).toLocaleString()}
                      />
                      <Box>
                        <Chip
                          label={submission.status}
                          color={
                            submission.status === 'approved'
                              ? 'success'
                              : submission.status === 'rejected'
                              ? 'error'
                              : 'warning'
                          }
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <IconButton
                          onClick={() => handleViewSubmission(submission)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            User Management Coming Soon
          </Typography>
        </TabPanel>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedSubmission && (
            <>
              <DialogTitle>Tree Planting Submission Details</DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <img
                    src={selectedSubmission.imageUrl}
                    alt="Tree planting"
                    style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="subtitle1" gutterBottom>
                  Submitted by: {selectedSubmission.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {selectedSubmission.location.lat}, {selectedSubmission.location.lng}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submitted at: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDialogOpen(false)}
                  color="inherit"
                  disabled={loading}
                >
                  Close
                </Button>
                <Button
                  onClick={handleReject}
                  color="error"
                  disabled={loading || selectedSubmission.status !== 'pending'}
                  startIcon={<Close />}
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  color="success"
                  variant="contained"
                  disabled={loading || selectedSubmission.status !== 'pending'}
                  startIcon={loading ? <CircularProgress size={20} /> : <Check />}
                >
                  Approve
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default AdminDashboard; 