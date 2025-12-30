/**
 * PatientTimeline
 * Displays a read-only chronological timeline of patient events
 * Including appointments, consultations, prescriptions, and migrated records
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  EventNote as EventIcon,
  Notes as NotesIcon,
  LocalPharmacy as PharmacyIcon,
  FilePresent as FileIcon,
} from '@mui/icons-material';
import { usePatientTimeline } from '../hooks';
import type { TimelineEvent, PatientAppointment, Consultation, Prescription, MigratedRecord } from '../types';

interface PatientTimelineProps {
  patientId: number | null;
}

const PatientTimeline = ({ patientId }: PatientTimelineProps) => {
  const { data: timelineData, isLoading, error } = usePatientTimeline(patientId);

  if (!patientId) return null;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load timeline: {error.message}
      </Alert>
    );
  }

  const events = timelineData?.events || [];

  if (events.length === 0) {
    return (
      <Alert severity="info">
        No timeline events recorded yet
      </Alert>
    );
  }

  const getEventIcon = (type: TimelineEvent['type']) => {
    const icons: Record<string, React.ReactElement> = {
      appointment: <EventIcon />,
      consultation: <NotesIcon />,
      prescription: <PharmacyIcon />,
      migrated_record: <FileIcon />,
    };
    return icons[type] || <EventIcon />;
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    const colors: Record<string, 'primary' | 'secondary' | 'error' | 'success' | 'info'> = {
      appointment: 'primary',
      consultation: 'secondary',
      prescription: 'success',
      migrated_record: 'info',
    };
    return colors[type] || 'primary';
  };

  const getEventTitle = (event: TimelineEvent) => {
    switch (event.type) {
      case 'appointment': {
        const apt = event.data as PatientAppointment;
        return apt.appointment_type === 'in_person' ? 'In-Person Appointment' : 'Telehealth Appointment';
      }
      case 'consultation':
        return 'Consultation';
      case 'prescription':
        return 'Prescription';
      case 'migrated_record':
        return 'Migrated Record';
      default:
        return 'Event';
    }
  };

  const getEventDateTime = (event: TimelineEvent): string => {
    const data = event.data;
    if (event.type === 'appointment') {
      const apt = data as PatientAppointment;
      return new Date(apt.scheduled_at).toLocaleString();
    } else if (event.type === 'consultation') {
      const con = data as Consultation;
      return new Date(con.created_at).toLocaleString();
    } else if (event.type === 'prescription') {
      const presc = data as Prescription;
      return new Date(presc.created_at).toLocaleString();
    } else if (event.type === 'migrated_record') {
      const rec = data as MigratedRecord;
      return new Date(rec.uploaded_at).toLocaleString();
    }
    return '';
  };

  const getEventDescription = (event: TimelineEvent) => {
    switch (event.type) {
      case 'appointment': {
        const apt = event.data as PatientAppointment;
        return (
          <Box>
            <Box sx={{ mb: 1 }}>
              <Chip
                label={apt.status.replace('_', ' ').toUpperCase()}
                size="small"
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Type: {apt.appointment_type === 'in_person' ? 'In-Person' : 'Telehealth'}
            </Typography>
          </Box>
        );
      }
      case 'consultation': {
        const con = event.data as Consultation;
        return (
          <Box>
            {con.chief_complaint && (
              <Typography variant="body2">
                <strong>Chief Complaint:</strong> {con.chief_complaint}
              </Typography>
            )}
            {con.diagnosis && (
              <Typography variant="body2">
                <strong>Diagnosis:</strong> {con.diagnosis}
              </Typography>
            )}
            {con.notes && (
              <Typography variant="body2" color="text.secondary">
                {con.notes}
              </Typography>
            )}
          </Box>
        );
      }
      case 'prescription': {
        const presc = event.data as Prescription;
        return (
          <Box>
            <Typography variant="body2">
              <strong>Medication:</strong> {presc.medication}
            </Typography>
            {presc.dosage && (
              <Typography variant="body2">
                <strong>Dosage:</strong> {presc.dosage}
              </Typography>
            )}
            {presc.duration && (
              <Typography variant="body2">
                <strong>Duration:</strong> {presc.duration}
              </Typography>
            )}
            {presc.instructions && (
              <Typography variant="body2" color="text.secondary">
                {presc.instructions}
              </Typography>
            )}
          </Box>
        );
      }
      case 'migrated_record': {
        const rec = event.data as MigratedRecord;
        return (
          <Box>
            <Typography variant="body2">
              <strong>File:</strong> {rec.file_name}
            </Typography>
            <Typography variant="body2">
              <strong>Source:</strong> {rec.source === 'scan' ? 'Scanned' : 'Photo'}
            </Typography>
            {rec.notes && (
              <Typography variant="body2" color="text.secondary">
                {rec.notes}
              </Typography>
            )}
          </Box>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Timeline visualization */}
      <Box sx={{ position: 'relative' }}>
        {/* Vertical line */}
        <Box
          sx={{
            position: 'absolute',
            left: 24,
            top: 0,
            bottom: 0,
            width: 2,
            bgcolor: 'divider',
          }}
        />

        {/* Timeline items */}
        {events.map((event, index) => (
          <Box key={index} sx={{ display: 'flex', mb: 3, position: 'relative' }}>
            {/* Timeline dot */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 48,
                height: 48,
                minWidth: 48,
                backgroundColor: getEventColor(event.type),
                borderRadius: '50%',
                color: 'white',
                zIndex: 1,
              }}
            >
              {getEventIcon(event.type)}
            </Box>

            {/* Content */}
            <Box sx={{ ml: 2, flex: 1 }}>
              <Card variant="outlined">
                <CardContent sx={{ pb: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="subtitle2" component="div">
                      {getEventTitle(event)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    {getEventDateTime(event)}
                  </Typography>
                  {getEventDescription(event)}
                </CardContent>
              </Card>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PatientTimeline;
