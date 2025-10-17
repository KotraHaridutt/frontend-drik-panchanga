import React from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 3,
        p: 3,
      }}
    >
      <ErrorOutline color="error" sx={{ fontSize: 48 }} />
      <Typography variant="h6" color="error" textAlign="center">
        Something went wrong
      </Typography>
      <Alert severity="error" sx={{ maxWidth: 500 }}>
        {error}
      </Alert>
      {onRetry && (
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRetry}
          color="primary"
        >
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
