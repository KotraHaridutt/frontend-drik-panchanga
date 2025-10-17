import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocationPreset } from "../types/panchanga";
import { locationPresets } from "../constants/locations";
import { MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchMatchingDates } from "../services/api";
import { PanchangaData } from "../types/panchanga";

interface InputFormProps {
  onSubmit: (
    date: Date,
    latitude: number,
    longitude: number,
    timezone: number,
    hour: number,
    minute: number,
    calendar: string,
    matchingDates?: PanchangaData[]
  ) => Promise<void>;
  loading: boolean;
}

// Presets imported from constants

const InputForm: React.FC<InputFormProps> = ({ onSubmit, loading }) => {
  // Range state for matching dates
  const [range, setRange] = useState<number>(3);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [latitude, setLatitude] = useState<string>("28.6139");
  const [longitude, setLongitude] = useState<string>("77.2090");
  const [timezone, setTimezone] = useState<string>("5.5");
  const [time, setTime] = useState<Dayjs | null>(dayjs());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [calendar, setCalendar] = useState<string>("gregorian");
  const [matchingLoading, setMatchingLoading] = useState<boolean>(false);

  const validateInputs = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";

    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }

    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }

    const tz = parseFloat(timezone);
    if (isNaN(tz) || tz < -12 || tz > 14) {
      newErrors.timezone = "Timezone must be between -12 and 14";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs() || !date || !time) {
      return;
    }

    onSubmit(
      date.toDate(),
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(timezone),
      time.hour(),
      time.minute(),
      calendar
    );
  };

  const handleLocationSelect = (location: LocationPreset) => {
    setLatitude(location.latitude.toString());
    setLongitude(location.longitude.toString());
    setTimezone(location.timezone.toString());
    setErrors({});
  };

  const handleFindMatching = async () => {
    if (!date || !validateInputs()) {
      return;
    }
    setMatchingLoading(true);
    try {
      const baseDate = date.toDate();
      const matches = await fetchMatchingDates(
        baseDate,
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(timezone),
        range,
        calendar
      );

      await onSubmit(
        baseDate,
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(timezone),
        time?.hour() || 0,
        time?.minute() || 0,
        calendar,
        matches
      );
    } catch (error) {
      console.error("Error fetching matching dates:", error);
      setErrors((prev) => ({
        ...prev,
        matching:
          error instanceof Error
            ? error.message
            : "Failed to fetch matching dates",
      }));
    } finally {
      setMatchingLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.date,
                helperText: errors.date,
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TimePicker
            label="Time"
            value={time}
            onChange={(newValue) => setTime(newValue)}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.time,
                helperText: errors.time || "24h format",
              },
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            error={!!errors.latitude}
            helperText={errors.latitude || "Decimal degrees (-90 to 90)"}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            error={!!errors.longitude}
            helperText={errors.longitude || "Decimal degrees (-180 to 180)"}
            type="number"
            inputProps={{ step: "any" }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            error={!!errors.timezone}
            helperText={errors.timezone || "Hours from UTC (e.g., 5.5 for IST)"}
            type="number"
            inputProps={{ step: 0.5 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1 }}>
            Quick Locations:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {locationPresets.map((location) => (
              <Chip
                key={location.name}
                label={`${location.emoji} ${location.name}`}
                onClick={() => handleLocationSelect(location)}
                variant="outlined"
                sx={{
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Calendar"
            value={calendar}
            onChange={(e) => setCalendar(e.target.value)}
            helperText="Choose civil calendar system"
          >
            <MenuItem value="gregorian">Gregorian</MenuItem>
            <MenuItem value="julian">Julian</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Calculating...
                  </>
                ) : (
                  "Calculate Panchanga"
                )}
              </Button>
            </Grid>
            {/* Range Input for Matching Dates */}
            <Grid item xs={12} sx={{ mb: 2 }}>
              <TextField
                label="Range (years)"
                type="number"
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleFindMatching}
                disabled={loading || matchingLoading}
                startIcon={
                  matchingLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <SearchIcon />
                  )
                }
              >
                {matchingLoading ? "Finding Matches..." : "Find Matching Dates"}
              </Button>
              {errors.matching && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.matching}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InputForm;
