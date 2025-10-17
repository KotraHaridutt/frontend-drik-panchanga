import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';

const EmptyState: React.FC = () => {
  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        gap: 2,
        p: 4,
        textAlign: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <CalendarToday sx={{ fontSize: 64, color: 'grey.400' }} />
      <Typography variant="h6" color="text.secondary">
        Select a date to calculate Panchanga
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Choose a date, location, and timezone to see detailed Panchanga
        information including Tithi, Nakshatra, Yoga, Karana, and celestial
        timings.
      </Typography>
    </Paper>
  );
};

export default EmptyState;
