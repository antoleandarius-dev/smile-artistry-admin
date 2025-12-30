/**
 * RecordUploadDialog
 * Dialog to upload migrated/old records for a patient
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Typography,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import type { RecordSource } from '../types';
import { useUploadMigratedRecord } from '../hooks';

interface RecordUploadDialogProps {
  open: boolean;
  patientId: number | null;
  onClose: () => void;
}

const RecordUploadDialog = ({ open, patientId, onClose }: RecordUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<RecordSource>('scan');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const uploadRecord = useUploadMigratedRecord();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setValidationError('File size must be less than 10MB');
        setFile(null);
        return;
      }
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        setValidationError('File must be an image (JPEG, PNG, GIF) or PDF');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setValidationError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!file) {
      setValidationError('Please select a file');
      return false;
    }
    if (!source) {
      setValidationError('Please select a record source');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !patientId) return;

    try {
      await uploadRecord.mutateAsync({
        patientId,
        file: file!,
        source,
        notes: notes.trim() || undefined,
      });
      handleReset();
      onClose();
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : 'Failed to upload record'
      );
    }
  };

  const handleReset = () => {
    setFile(null);
    setSource('scan');
    setNotes('');
    setValidationError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Old Record</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {validationError && (
            <Alert severity="error" onClose={() => setValidationError(null)}>
              {validationError}
            </Alert>
          )}

          {uploadRecord.error && (
            <Alert severity="error">
              {uploadRecord.error instanceof Error
                ? uploadRecord.error.message
                : 'An error occurred while uploading the record'}
            </Alert>
          )}

          {/* File Upload Area */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: 'divider',
              bgcolor: 'action.hover',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.selected',
              },
            }}
            component="label"
          >
            <input
              hidden
              accept="image/*,.pdf"
              type="file"
              onChange={handleFileSelect}
            />
            <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {file ? file.name : 'Click to upload or drag and drop'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PNG, JPG, GIF, PDF up to 10MB
            </Typography>
          </Paper>

          {file && (
            <Box sx={{ p: 1.5, bgcolor: 'success.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="success.dark">
                ✓ File selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Typography>
            </Box>
          )}

          {/* Record Source Select */}
          <FormControl fullWidth>
            <InputLabel>Record Source</InputLabel>
            <Select
              value={source}
              onChange={(e) => setSource(e.target.value as RecordSource)}
              label="Record Source"
            >
              <MenuItem value="scan">Scanned Document</MenuItem>
              <MenuItem value="photo">Photo</MenuItem>
            </Select>
          </FormControl>

          {/* Notes Field */}
          <TextField
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Add any notes about this record (e.g., date, doctor name, reason)"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploadRecord.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploadRecord.isPending || !file}
        >
          {uploadRecord.isPending ? 'Uploading...' : 'Upload Record'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordUploadDialog;
