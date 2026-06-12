import axios from "axios";
import {
  PanchangaData,
  CalculationParams,
  TithiDatesResponse,
} from "../types/panchanga";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3002/panchanga";
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchPanchanga = async (
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number,
  hour?: number,
  minute?: number,
  calendar: string = "gregorian"
): Promise<PanchangaData> => {
  try {
    const params: CalculationParams = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hour,
      minute,
      latitude,
      longitude,
      timezone,
      calendar,
    };

    const response = await api.get("", { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `API Error: ${error.response.data?.message || error.message}`
        );
      } else if (error.request) {
        throw new Error("Network Error: Unable to connect to the server");
      }
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchTithiDates = async (
  tithi: number,
  latitude: number,
  longitude: number,
  timezone: number,
  calendar: string = "gregorian",
  startYear?: number,
  endYear?: number
): Promise<TithiDatesResponse> => {
  try {
    const params: any = {
      tithi,
      latitude,
      longitude,
      timezone,
      calendar,
    };
    if (startYear !== undefined) params.startYear = startYear;
    if (endYear !== undefined) params.endYear = endYear;
    const response = await api.get("tithi-dates", { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `API Error: ${error.response.data?.message || error.message}`
        );
      } else if (error.request) {
        throw new Error("Network Error: Unable to connect to the server");
      }
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchMatchingDates = async (
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number,
  range: number,
  calendar: string = "gregorian"
): Promise<PanchangaData[]> => {
  try {
    const payload = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      latitude,
      longitude,
      timezone,
      range,
      calendar,
    };
    const response = await axios.post(
      `${API_BASE_URL}/matching-dates`,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `API Error: ${error.response.data?.message || error.message}`
        );
      } else if (error.request) {
        throw new Error("Network Error: Unable to connect to the server");
      }
    }
    throw new Error("An unexpected error occurred");
  }
};
