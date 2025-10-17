import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { PanchangaData } from "../types/panchanga";

interface Props {
  matches: PanchangaData[];
  loading?: boolean;
}

const MatchingDatesPanel: React.FC<Props> = ({ matches, loading }) => {
  const groupedByYear = React.useMemo(() => {
    const groups = new Map<number, PanchangaData[]>();
    matches.forEach((match) => {
      const year = match.date.year;
      if (!groups.has(year)) {
        groups.set(year, []);
      }
      groups.get(year)?.push(match);
    });
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  }, [matches]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography sx={{ mb: 2 }}>Finding annual occurrences...</Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Annual Festival Dates
          <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
            ({matches.length} occurrences found)
          </Typography>
        </Typography>

        <Box sx={{ mt: 2 }}>
          {groupedByYear.map(([year, dates]) => (
            <Box key={year} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {year}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {dates.map((match, idx) => (
                  <Chip
                    key={idx}
                    label={`${match.date.day}/${
                      match.masa?.name || match.date.month
                    }/${match.date.year}`}
                    onClick={() =>
                      (window.location.href = `?date=${match.date.year}-${match.date.month}-${match.date.day}`)
                    }
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MatchingDatesPanel;
