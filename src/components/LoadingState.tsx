import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingState: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body1" color="text.secondary">
        Calculating Panchanga...
      </Typography>
    </Box>
  );
};

export default LoadingState;
