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
} from '@mui/material';
import {
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { auditLogsService, type AuditLog } from '../api/audit-logs.service';
import { format } from 'date-fns';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Audit Logs</h1>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Filters Card */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>Filters</h3>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
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
                fullWidth
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {logsError && (
        <Alert severity="error">
          Error loading audit logs: {(logsError as { message?: string })?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Loading State */}
      {logsLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Audit Logs Table */}
      {!logsLoading && auditLogsData && (
        <>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                <Table stickyHeader>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Timestamp</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 130 }}>Action</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Entity Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Entity ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 80, textAlign: 'center' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogsData.items && auditLogsData.items.length > 0 ? (
                      auditLogsData.items.map((log) => (
                        <TableRow key={log.id} hover>
                          <TableCell>
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
