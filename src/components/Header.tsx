import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeaderPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius * 2,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  textAlign: 'center',
  marginBottom: theme.spacing(3),
}));

const Header: React.FC = () => {
  return (
    <HeaderPaper>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        Karishye My-Dharma Calculator
      </Typography>
    </HeaderPaper>
  );
};

export default Header;
