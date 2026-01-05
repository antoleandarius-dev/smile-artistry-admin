import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  TablePagination,
  Typography,
} from '@mui/material';
import {
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { auditLogsService, type AuditLog } from '../api/audit-logs.service';
import { format } from 'date-fns';
import { RESPONSIVE_PATTERNS } from '../styles/responsive';

const AdminAuditLogsPage: React.FC = () => {
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // State for filters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [entityType, setEntityType] = useState<string>('');

  // State for detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Calculate skip based on pagination
  const skip = page * rowsPerPage;

  // Build filter params
  const filterParams = {
    skip,
    limit: rowsPerPage,
    ...(startDate && { start_date: new Date(startDate).toISOString() }),
    ...(endDate && { end_date: new Date(endDate).toISOString() }),
    ...(userId && { user_id: parseInt(userId) }),
    ...(action && { action }),
    ...(entityType && { entity_type: entityType }),
  };

  // Fetch audit logs
  const {
    data: auditLogsData,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ['auditLogs', filterParams],
    queryFn: () => auditLogsService.getAuditLogs(filterParams),
  });

  // Fetch available actions for dropdown
  const {
    data: availableActions,
    isLoading: actionsLoading,
  } = useQuery({
    queryKey: ['availableActions'],
    queryFn: () => auditLogsService.getAvailableActions(),
  });

  // Fetch available entity types for dropdown
  const {
    data: availableEntityTypes,
    isLoading: entityTypesLoading,
  } = useQuery({
    queryKey: ['availableEntityTypes'],
    queryFn: () => auditLogsService.getAvailableEntityTypes(),
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setUserId('');
    setAction('');
    setEntityType('');
    setPage(0);
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedLog(null);
  };

  const handleRefresh = () => {
    refetchLogs();
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={RESPONSIVE_PATTERNS.headerLayout}>
        <Typography 
          variant="h4"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Audit Logs
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          variant="outlined"
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minHeight: { xs: 44, md: 40 },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters Card */}
      <Card sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
        <CardContent sx={{ ...RESPONSIVE_PATTERNS.responsivePadding }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
            <Typography 
              variant="h6"
              sx={{
                margin: 0,
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              Filters
            </Typography>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
              gap: { xs: 1, sm: 1.5 }
            }}>
              {/* Date Range */}
              <TextField
                  label="Start Date"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(0);
                  }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{
                    '& input': { fontSize: { xs: '0.8rem', sm: '0.875rem' } },
                  }}
                />
              <TextField
                label="End Date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(0);
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{
                  '& input': { fontSize: { xs: '0.8rem', sm: '0.875rem' } },
                }}
              />

              {/* User ID */}
              <TextField
                label="User ID"
                type="number"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setPage(0);
                }}
                fullWidth
                size="small"
                placeholder="Filter by user ID"
                sx={{
                  '& input': { fontSize: { xs: '0.8rem', sm: '0.875rem' } },
                }}
              />

              {/* Action */}
              <TextField
                label="Action"
                select
                value={action}
                onChange={(e) => {
                  setAction(e.target.value);
                  setPage(0);
                }}
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-input': { fontSize: { xs: '0.8rem', sm: '0.875rem' } },
                }}
              >
                <MenuItem value="">All Actions</MenuItem>
                {!actionsLoading && availableActions && availableActions.map((act) => (
                  <MenuItem key={act} value={act}>
                    {act}
                  </MenuItem>
                ))}
              </TextField>

              {/* Entity Type */}
              <TextField
                label="Entity Type"
                select
                value={entityType}
                onChange={(e) => {
                  setEntityType(e.target.value);
                  setPage(0);
                }}
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-input': { fontSize: { xs: '0.8rem', sm: '0.875rem' } },
                }}
              >
                <MenuItem value="">All Entity Types</MenuItem>
                {!entityTypesLoading && availableEntityTypes && availableEntityTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Clear Filters Button */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  minHeight: { xs: 40, md: 36 },
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {logsError && (
        <Alert 
          severity="error"
          sx={{
            mb: { xs: 2, sm: 2.5, md: 3 },
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }}
        >
          Error loading audit logs: {(logsError as { message?: string })?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Loading State */}
      {logsLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, sm: 3, md: 4 } }}>
          <CircularProgress />
        </Box>
      )}

      {/* Audit Logs Table */}
      {!logsLoading && auditLogsData && (
        <>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  maxHeight: { xs: 'calc(100vh - 500px)', md: 'calc(100vh - 400px)' },
                  ...RESPONSIVE_PATTERNS.tableWrapper,
                }}
              >
                <Table stickyHeader>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 120, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Timestamp</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 100, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 100, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 130, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Action</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 100, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Entity Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 80, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Entity ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 80, textAlign: 'center', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogsData.items && auditLogsData.items.length > 0 ? (
                      auditLogsData.items.map((log) => (
                        <TableRow key={log.id} hover>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                          </TableCell>
                          <TableCell>
                            {log.user_name || `User #${log.user_id || 'N/A'}`}
                          </TableCell>
                          <TableCell>
                            {log.user_role ? (
                              <Chip
                                label={log.user_role}
                                size="small"
                                variant="outlined"
                              />
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.action}
                              size="small"
                              variant="filled"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.entity_type}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{log.entity_id || '—'}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Button
                              startIcon={<InfoIcon />}
                              onClick={() => handleViewDetails(log)}
                              size="small"
                              variant="text"
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                          No audit logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {auditLogsData.items && auditLogsData.items.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={auditLogsData.total}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Audit Log Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {selectedLog && (
            <>
              <Box>
                <strong>Log ID:</strong> {selectedLog.id}
              </Box>
              <Box>
                <strong>Timestamp:</strong>{' '}
                {format(new Date(selectedLog.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </Box>
              <Box>
                <strong>User ID:</strong> {selectedLog.user_id || 'N/A'}
              </Box>
              <Box>
                <strong>User Name:</strong> {selectedLog.user_name || 'N/A'}
              </Box>
              <Box>
                <strong>User Role:</strong>{' '}
                {selectedLog.user_role ? (
                  <Chip label={selectedLog.user_role} size="small" />
                ) : (
                  'N/A'
                )}
              </Box>
              <Box>
                <strong>Action:</strong>{' '}
                <Chip label={selectedLog.action} size="small" color="primary" />
              </Box>
              <Box>
                <strong>Entity Type:</strong>{' '}
                <Chip label={selectedLog.entity_type} size="small" />
              </Box>
              <Box>
                <strong>Entity ID:</strong> {selectedLog.entity_id || 'N/A'}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminAuditLogsPage;
