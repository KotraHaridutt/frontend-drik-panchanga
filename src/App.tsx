import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Fade,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
// import TithiFinder from './components/TithiFinder';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import { PanchangaData, TithiDatesResponse } from './types/panchanga';
import TithiResultsPanel from './components/TithiResultsPanel';
import { fetchPanchanga } from './services/api';

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(ellipse at top, rgba(255,255,255,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius * 2,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

interface AppState {
  data: PanchangaData | null;
  loading: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const theme = useTheme();
  const [state, setState] = useState<AppState>({
    data: null,
    loading: false,
    error: null,
  });
  const [tithiDates, setTithiDates] = useState<TithiDatesResponse | null>(null);
  const [tithiCalendar, setTithiCalendar] = useState<string>('gregorian');

  const handleCalculate = async (
    date: Date,
    latitude: number,
    longitude: number,
    timezone: number,
    hour: number,
    minute: number,
    calendar: string,
    matchingDates?: PanchangaData[],
  ) => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await fetchPanchanga(
        date,
        latitude,
        longitude,
        timezone,
        hour,
        minute,
        calendar,
      );

      const updatedData: PanchangaData = {
        ...data,
        matchingDates: matchingDates || [],
      };

      setState({
        data: updatedData,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  };

  const renderContent = () => {
    if (state.loading) {
      return <LoadingState />;
    }

    if (state.error) {
      return (
        <ErrorState
          error={state.error}
          onRetry={() => setState((prev) => ({ ...prev, error: null }))}
        />
      );
    }

    if (state.data) {
      return (
        <Fade in={true} timeout={600}>
          <Box>
            <ResultsDisplay data={state.data} />
          </Box>
        </Fade>
      );
    }

    return <EmptyState />;
  };

  return (
    <GradientBackground>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Header />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Input Panel */}
          <Grid item xs={12} lg={4}>
            <GlassCard
              sx={{ p: 3, height: 'fit-content', position: 'sticky', top: 24 }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                📅 Calculate Panchanga
              </Typography>
              <InputForm onSubmit={handleCalculate} loading={state.loading} />
              {/* <TithiFinder
                onResults={(res, calendar) => {
                  setTithiDates(res);
                  setTithiCalendar(calendar);
                }}
              /> */}
            </GlassCard>
          </Grid>

          {/* Results Panel */}
          <Grid item xs={12} lg={8}>
            <GlassCard sx={{ p: 3, minHeight: 600 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                📊 Panchanga Results
              </Typography>
              {renderContent()}
              {tithiDates && (
                <TithiResultsPanel
                  result={tithiDates}
                  calendarLabel={tithiCalendar}
                />
              )}
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </GradientBackground>
  );
};

export default App;
