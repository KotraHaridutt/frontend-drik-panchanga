import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
  Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { TithiDatesResponse } from '../types/panchanga';

interface Props {
  result: TithiDatesResponse;
  calendarLabel?: string;
}

const TithiResultsPanel: React.FC<Props> = ({ result, calendarLabel }) => {
  const groupedByYear = useMemo(() => {
    const map = new Map<number, string[]>();
    for (const d of result.dates) {
      const label = `${d.day}/${d.month}/${d.year}`;
      map.set(d.year, [...(map.get(d.year) || []), label]);
    }
    return Array.from(map.entries())
      .map(([year, labels]) => ({ year, labels }))
      .sort((a, b) => a.year - b.year);
  }, [result]);

  const toCSV = () => {
    const header = 'day,month,year\n';
    const rows = result.dates
      .map((d) => `${d.day},${d.month},${d.year}`)
      .join('\n');
    return header + rows + '\n';
  };

  const handleDownloadCSV = () => {
    const csv = toCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tithi-${result.tithiNumber}-dates-${result.range.start.year}-${result.range.end.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const text = result.dates
      .map((d) => `${d.day}/${d.month}/${d.year}`)
      .join(', ');
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Tithi Dates — {result.tithiName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {result.count} dates • {result.range.start.day}/
          {result.range.start.month}/{result.range.start.year} to{' '}
          {result.range.end.day}/{result.range.end.month}/
          {result.range.end.year}
          {calendarLabel ? ` • Calendar: ${calendarLabel}` : ''}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDownloadCSV}
            startIcon={<DownloadIcon />}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            onClick={handleCopy}
            startIcon={<ContentCopyIcon />}
          >
            Copy
          </Button>
        </Box>

        <Box
          sx={{
            mt: 2,
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 1,
            p: 2,
            maxHeight: 360,
            overflowY: 'auto',
            backgroundColor: 'background.paper',
          }}
        >
          {groupedByYear.map((bucket, idx) => (
            <Box
              key={bucket.year}
              sx={{ mb: idx < groupedByYear.length - 1 ? 2 : 0 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {bucket.year} — {bucket.labels.length} dates
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {bucket.labels.map((label, i) => (
                  <Chip
                    key={`${bucket.year}-${label}-${i}`}
                    label={label}
                    size="small"
                  />
                ))}
              </Box>
              {idx < groupedByYear.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TithiResultsPanel;
