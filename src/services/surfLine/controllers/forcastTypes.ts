// Shared

interface Location {
  lon: number;
  lat: number;
}

interface AssociatedUnits {
  temperature: "F";
  tideHeight: "FT";
  swellHeight: "FT";
  waveHeight: "FT";
  windSpeed: "KTS";
  pressure: "MB";
}

interface Permissions {
  data: any[]; // You can replace "any[]" with a more specific type if you have more information about the data structure.
  violations: PermissionViolation[];
}

interface Permission {
  name: string;
  required: boolean;
}

interface PermissionViolation {
  code: number;
  message: string;
  permission: Permission;
}

// Rating

interface RatingData {
  key: string;
  value: number;
}

interface RatingEntry {
  timestamp: number;
  utcOffset: number;
  rating: RatingData;
}

export interface SurfLineForecastRating {
  associated: {
    location: Location;
    runInitializationTimestamp: number;
  };
  data: {
    rating: RatingEntry[];
  };
  permissions: Permissions;
}

// Wave

interface Surf {
  min: number;
  max: number;
  optimalScore: number;
  plus: boolean;
  humanRelation: string;
  raw: {
    min: number;
    max: number;
  };
}

interface Swell {
  height: number;
  period: number;
  impact: number;
  power: number;
  direction: number;
  directionMin: number;
  optimalScore: number;
}

interface WaveEntry {
  timestamp: number;
  probability: null; // Change this type if it's supposed to be a specific type.
  utcOffset: number;
  surf: Surf;
  power: number;
  swells: Swell[];
}

export interface SurfLineForecastWave {
  associated: {
    units: AssociatedUnits;
    utcOffset: number;
    location: Location;
    forecastLocation: Location;
    offshoreLocation: Location;
    runInitializationTimestamp: number;
  };
  data: {
    wave: WaveEntry[];
  };
  permissions: Permissions;
}

// Wind

interface WindEntry {
  timestamp: number;
  utcOffset: number;
  speed: number;
  direction: number;
  directionType: string; //"Onshore" | "Offshore"; // Replace with other possible values if available.
  gust: number;
  optimalScore: number;
}

export interface SurfLineForecastWind {
  associated: {
    units: AssociatedUnits;
    utcOffset: number;
    location: Location;
    runInitializationTimestamp: number;
  };
  data: {
    wind: WindEntry[];
  };
  permissions: Permissions;
}

// Tides

interface TideEntry {
  timestamp: number;
  utcOffset: number;
  type: string;  //"NORMAL" | "LOW" | "HIGH"; // Replace with other possible values if available.
  height: number;
}

export interface SurfLineForecastTides {
  associated: {
    units: AssociatedUnits;
    utcOffset: number;
    location: Location;
    tideLocation: {
      name: string;
      min: number;
      max: number;
      lon: number;
      lat: number;
      mean: number;
    };
  };
  data: {
    tides: TideEntry[];
  };
  permissions: Permissions;
}

// Weather

interface WeatherEntry {
  timestamp: number;
  utcOffset: number;
  temperature: number;
  condition: string;
  pressure: number;
}

interface SunlightEntry {
  midnight: number;
  midnightUTCOffset: number;
  dawn: number;
  dawnUTCOffset: number;
  sunrise: number;
  sunriseUTCOffset: number;
  sunset: number;
  sunsetUTCOffset: number;
  dusk: number;
  duskUTCOffset: number;
}

export interface SurfLineForecastWeather {
  associated: {
    units: {
      temperature: string;
      tideHeight: string;
      swellHeight: string;
      waveHeight: string;
      windSpeed: string;
      pressure: string;
    };
    utcOffset: number;
    weatherIconPath: string;
    runInitializationTimestamp: number;
  };
  data: {
    sunlightTimes: SunlightEntry[];
    weather: WeatherEntry[];
  };
  permissions: Permissions;
}

export interface AllForcasts {
  locationId: string;
  rating: SurfLineForecastRating,
  wave: SurfLineForecastWave,
  wind: SurfLineForecastWind,
  tides: SurfLineForecastTides,
  weather: SurfLineForecastWeather,
}