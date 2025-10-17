export interface PanchangaDate {
  year: number;
  month: number;
  day: number;
  hour?: number; // optional hour (0-23)
  minute?: number; // optional minute (0-59)
  calendar?: string; // gregorian | julian
}

export interface Location {
  latitude: number;
  longitude: number;
  timezone: number;
}

export interface TithiResult {
  number: number;
  name: string;
  endTime: number[];
  paksha: string; // Add this property
}

export interface NakshatraResult {
  number: number;
  name: string;
  endTime: number[];
}

export interface YogaResult {
  number: number;
  name: string;
  endTime: number[];
}

export interface KaranaResult {
  number: number;
  name: string;
}

export interface MasaResult {
  number: number;
  name: string;
  isAdhika: boolean;
}

export interface PanchangaData {
  date: PanchangaDate;
  location: Location;
  tithi: TithiResult[];
  nakshatra: NakshatraResult[];
  yoga: YogaResult[];
  karana: KaranaResult;
  masa: MasaResult;
  vaara: number;
  sunrise: number[];
  sunset: number[];
  moonrise: number[];
  moonset: number[];
  dayDuration: number[];
  aiMeta?: { applied: boolean; notes?: string };
  matchingDates?: PanchangaData[];
}

export interface CalculationParams {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  latitude: number;
  longitude: number;
  timezone: number;
  calendar?: string;
}

export interface LocationPreset {
  name: string;
  latitude: number;
  longitude: number;
  timezone: number;
  emoji: string;
}

export interface DateOnly {
  year: number;
  month: number;
  day: number;
}

export interface TithiDatesResponse {
  tithiNumber: number;
  tithiName: string;
  location: Location;
  range: { start: DateOnly; end: DateOnly };
  dates: DateOnly[];
  count: number;
}
