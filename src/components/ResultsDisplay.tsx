import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  WbSunny,
  NightsStay,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';
import { PanchangaData, PanchangaDate } from '../types/panchanga';
import MatchingDatesPanel from './MatchingDatesPanel';

interface ResultsDisplayProps {
  data: PanchangaData;
  matchingDates?: any[]; // Add this prop
}

const vaaraNames = [
  'Sunday (Ravivaar)',
  'Monday (Somvaar)',
  'Tuesday (Mangalvaar)',
  'Wednesday (Budhvaar)',
  'Thursday (Guruvaar)',
  'Friday (Shukravaar)',
  'Saturday (Shanivaar)',
];

const formatTime = (timeArray: number[]): string => {
  if (!Array.isArray(timeArray) || timeArray.length < 3) {
    return 'Not available';
  }

  const [hours, minutes, seconds] = timeArray;
  const h = Math.floor(Math.abs(hours));
  const m = Math.floor(Math.abs(minutes));
  const s = Math.floor(Math.abs(seconds));
  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Format an end time: if hour >=24 treat as next day, optionally show (+1 day)
const formatEndTime = (
  timeArray: number[],
  baseDate: { day: number; month: number; year: number },
): string => {
  if (!Array.isArray(timeArray) || timeArray.length < 3) return 'Not available';
  let [h, m, s] = timeArray.map((v) => Math.floor(Math.abs(v)));
  let dayOffset = 0;
  while (h >= 24) {
    h -= 24;
    dayOffset += 1;
  }
  const timeStr = `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  if (dayOffset === 0) return timeStr;
  // Simple next-day date calc (not handling month/year rollover precisely beyond +1 day which is enough here)
  const date = new Date(baseDate.year, baseDate.month - 1, baseDate.day);
  date.setDate(date.getDate() + dayOffset);
  const d = date.getDate();
  const mo = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${timeStr} (+${dayOffset} day${dayOffset > 1 ? 's' : ''} - ${d}/${mo}/${y})`;
};

const formatMatchDate = (date: PanchangaDate): string => {
  return `${date.day.toString().padStart(2, '0')}/${date.month.toString().padStart(2, '0')}/${date.year}`;
};

const ResultCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <Card
    sx={{
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-2px)' },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

const ResultItem: React.FC<{
  label: string;
  value: string | React.ReactNode;
  badge?: boolean;
}> = ({ label, value, badge = false }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      py: 1,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    {badge ? (
      <Chip label={value} size="small" color="primary" />
    ) : (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    )}
  </Box>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  data,
  matchingDates,
}) => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Date & Location */}
        <Grid item xs={12} md={6}>
          <ResultCard
            title="Date & Location"
            icon={<CalendarToday color="primary" />}
          >
            <Stack spacing={1}>
              <ResultItem
                label="Date"
                value={`${data.date.day}/${data.date.month}/${data.date.year}`}
              />
              <ResultItem
                label="Location"
                value={`${data.location.latitude}°N, ${data.location.longitude}°E`}
              />
              <ResultItem
                label="Timezone"
                value={`UTC ${data.location.timezone >= 0 ? '+' : ''}${data.location.timezone}`}
              />
              <ResultItem
                label="Day of Week"
                value={vaaraNames[data.vaara] || 'Unknown'}
                badge
              />
            </Stack>
          </ResultCard>
        </Grid>

        {/* Tithi */}
        <Grid item xs={12} md={6}>
          <ResultCard
            title="Tithi (Lunar Day)"
            icon={<NightsStay color="primary" />}
          >
            <Stack spacing={1}>
              {data.tithi?.map((t, index) => (
                <Box key={index}>
                  <ResultItem
                    label={index === 0 ? 'Current' : 'Next'}
                    value={t.name || `Tithi ${t.number}`}
                  />
                  {t.endTime && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ pl: 2 }}
                    >
                      Ends: {formatEndTime(t.endTime, data.date)}
                    </Typography>
                  )}
                  {index < data.tithi.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              )) || (
                <Typography color="text.secondary">
                  No data available
                </Typography>
              )}
            </Stack>
          </ResultCard>
        </Grid>

        {/* Nakshatra */}
        <Grid item xs={12} md={6}>
          <ResultCard
            title="Nakshatra (Lunar Mansion)"
            icon={<LocationOn color="primary" />}
          >
            <Stack spacing={1}>
              {data.nakshatra?.map((n, index) => (
                <Box key={index}>
                  <ResultItem
                    label={index === 0 ? 'Current' : 'Next'}
                    value={n.name || `Nakshatra ${n.number}`}
                  />
                  {n.endTime && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ pl: 2 }}
                    >
                      Ends: {formatEndTime(n.endTime, data.date)}
                    </Typography>
                  )}
                  {index < data.nakshatra.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </Box>
              )) || (
                <Typography color="text.secondary">
                  No data available
                </Typography>
              )}
            </Stack>
          </ResultCard>
        </Grid>

        {/* Yoga */}
        <Grid item xs={12} md={6}>
          <ResultCard title="Yoga" icon={<Schedule color="primary" />}>
            <Stack spacing={1}>
              {data.yoga?.map((y, index) => (
                <Box key={index}>
                  <ResultItem
                    label={index === 0 ? 'Current' : 'Next'}
                    value={y.name || `Yoga ${y.number}`}
                  />
                  {y.endTime && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ pl: 2 }}
                    >
                      Ends: {formatEndTime(y.endTime, data.date)}
                    </Typography>
                  )}
                  {index < data.yoga.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              )) || (
                <Typography color="text.secondary">
                  No data available
                </Typography>
              )}
            </Stack>
          </ResultCard>
        </Grid>

        {/* Karana & Masa */}
        <Grid item xs={12} md={6}>
          <ResultCard
            title="Karana & Masa"
            icon={<AccessTime color="primary" />}
          >
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Karana (Half Lunar Day)
                </Typography>
                <ResultItem
                  label="Current"
                  value={
                    data.karana?.name ||
                    data.karana?.number ||
                    'No data available'
                  }
                />
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Masa (Lunar Month)
                </Typography>
                <ResultItem
                  label="Current Month"
                  value={
                    data.masa?.name ||
                    `Masa ${data.masa?.number}` ||
                    'No data available'
                  }
                />
                {data.masa?.isAdhika && (
                  <Chip
                    label="Adhika Masa"
                    size="small"
                    color="secondary"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Stack>
          </ResultCard>
        </Grid>

        {/* Sun & Moon Timings */}
        <Grid item xs={12} md={6}>
          <ResultCard
            title="Solar & Lunar Events"
            icon={<WbSunny color="primary" />}
          >
            <Stack spacing={1}>
              <ResultItem label="Sunrise" value={formatTime(data.sunrise)} />
              <ResultItem label="Sunset" value={formatTime(data.sunset)} />
              <ResultItem label="Moonrise" value={formatTime(data.moonrise)} />
              <ResultItem label="Moonset" value={formatTime(data.moonset)} />
              <ResultItem
                label="Day Duration"
                value={formatTime(data.dayDuration)}
              />
            </Stack>
          </ResultCard>
        </Grid>
      </Grid>

      {data.matchingDates && data.matchingDates.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Matching Dates ({data.matchingDates.length} found)
          </Typography>
          <Grid container spacing={2}>
            {data.matchingDates.map((match, idx) => (
              <Grid item key={idx}>
                <Chip
                  label={formatMatchDate(match.date)}
                  onClick={() => {
                    /* existing onClick handler */
                  }}
                  sx={{ cursor: 'pointer' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ResultsDisplay;
