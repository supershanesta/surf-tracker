import { DateTime } from 'luxon';

import ForcastProvider from '@/prisma/providers/Forcast';
import { Prisma } from '@prisma/client';

import { baseController } from './base';
import {
  AllForcasts,
  SurfLineForecastRating,
  SurfLineForecastTides,
  SurfLineForecastWave,
  SurfLineForecastWeather,
  SurfLineForecastWind,
} from './forcastTypes';
import { ForcastTypes } from './types';

export class forcast extends baseController {
  constructor() {
    super();
  }
  async getForcast(id: string, type: ForcastTypes, days = 5) {
    const data = await super.get(`kbyg/spots/forecasts/${type}?spotId=${id}&days=${days}&intervalHours=1`);
    return data;
  }

  async getHistoricalForcast(id: string, type: ForcastTypes, startDate: string) {
    const data = await super.get(`kbyg/spots/forecasts/${type}?spotId=${id}&start=${startDate}&intervalHours=1&accesstoken=${process.env.SURFLINE_API_KEY}`);
    return data;
  }

  async getRating(id: string, days = 5, startDate?: string): Promise<SurfLineForecastRating> {
    const data: SurfLineForecastRating = startDate ? await this.getHistoricalForcast(id, ForcastTypes.rating, startDate) : await this.getForcast(id, ForcastTypes.rating, days);
    return data;
  }

  async getWave(id: string, days = 5, startDate?: string): Promise<SurfLineForecastWave> {
    const data: SurfLineForecastWave = startDate ? this.getHistoricalForcast(id, ForcastTypes.wave, startDate) : await this.getForcast(id, ForcastTypes.wave, days);
    return data;
  }

  async getWind(id: string, days = 5, startDate?: string): Promise<SurfLineForecastWind> {
    const data: SurfLineForecastWind = startDate ? this.getHistoricalForcast(id, ForcastTypes.wind, startDate) : await this.getForcast(id, ForcastTypes.wind, days);
    return data;
  }

  async getTides(id: string, days = 5, startDate?: string): Promise<SurfLineForecastTides> {
    const data: SurfLineForecastTides = startDate ? this.getHistoricalForcast(id, ForcastTypes.tides, startDate) : await this.getForcast(id, ForcastTypes.tides, days);
    return data;
  }

  async getWeather(id: string, days = 5, startDate?: string): Promise<SurfLineForecastWeather> {
    const data: SurfLineForecastWeather = startDate ? this.getHistoricalForcast(id, ForcastTypes.weather, startDate) : await this.getForcast(id, ForcastTypes.weather, days);
    return data;
  }

  timeStampToDate(timestamp: number, utcOffset: number): string {
    const date = DateTime.fromSeconds(timestamp, { zone: 'utc' });
    return date.toISO() || new Date().toISOString();
  }

  formatForcasts(forcasts: AllForcasts): Prisma.ForcastCreateInput[] {
     // return an array of objects with the timestamp and the data
  const data: any = [];
  forcasts.rating.data.rating.forEach((rating) => {
    const formattedData = this.findRelatedData(rating.timestamp, rating.utcOffset, forcasts);
    data.push(formattedData);
  }
  );
  return data;
};

formatRating(rating: SurfLineForecastRating, timestamp: number): Prisma.ForcastRatingCreateWithoutForcastInput | undefined {
  const data = rating.data.rating.find((rating) => rating.timestamp === timestamp);
  if (!data) {
    console.log('No Rating Record found');
    return undefined;
  }
  return {
    timestamp: this.timeStampToDate(timestamp, data.utcOffset),
    utcOffset: data.utcOffset,
    location: JSON.stringify(rating.associated.location),
    ratingKey: data.rating.key,
    ratingValue: data.rating.value,
  }
};

formatWave(wave: SurfLineForecastWave, timestamp: number): Prisma.ForcastWaveCreateWithoutForcastInput | undefined {
  const data = wave.data.wave.find((wave) => wave.timestamp === timestamp);
  if (!data) {
    console.log('No Wave Record found');
    return undefined;
  }

  const waveSwells: Prisma.ForcastWaveSwellsCreateWithoutForcastWaveInput[] = data.swells.map((swell): Prisma.ForcastWaveSwellsCreateWithoutForcastWaveInput => ({
    height: swell.height,
    period: swell.period,
    impact: swell.impact,
    power: swell.power,
    direction: swell.direction,
    directionMin: swell.directionMin,
    optimalScore: swell.optimalScore,
  }))

  return {
    timestamp: this.timeStampToDate(timestamp, data.utcOffset),
    utcOffset: data.utcOffset,
    units: JSON.stringify(wave.associated.units),
    location: JSON.stringify(wave.associated.location),
    forecastLocation: JSON.stringify(wave.associated.forecastLocation),
    offshoreLocation: JSON.stringify(wave.associated.offshoreLocation),
    waveHeightMin: data.surf.min,
    waveHeightMax: data.surf.max,
    optimalScore: data.surf.optimalScore,
    plus: data.surf.plus,
    humanRelation: data.surf.humanRelation,
    waveHeightRawMin: data.surf.raw.min,
    waveHeightRawMax: data.surf.raw.max,
    power: data.power,
    waveSwells: {
      createMany: {
        data: waveSwells,
      }
    },
  }
};

formatWind(wind: SurfLineForecastWind, timestamp: number): Prisma.ForcastWindCreateWithoutForcastInput | undefined {
  const data = wind.data.wind.find((wind) => wind.timestamp === timestamp);
  if (!data) {
    console.log('No Wind Record found');
    return undefined;
  }
  return {
    timestamp: this.timeStampToDate(timestamp, data.utcOffset),
    utcOffset: data.utcOffset,
    location: JSON.stringify(wind.associated.location),
    units: JSON.stringify(wind.associated.units),
    speed: data.speed,
    direction: data.direction,
    directionType: data.directionType,
    gust: data.gust,
    optimalScore: data.optimalScore,
  }
};

formatTides(tides: SurfLineForecastTides, timestamp: number): Prisma.ForcastTideCreateWithoutForcastInput | undefined {
  const data = tides.data.tides.find((tides) => tides.timestamp === timestamp);
  if (!data) {
    console.log('No Tides Record found');
    return undefined;
  }
  return {
    timestamp: this.timeStampToDate(timestamp, data.utcOffset),
    utcOffset: data.utcOffset,
    units: JSON.stringify(tides.associated.units),
    tideLocation: JSON.stringify(tides.associated.tideLocation),
    type: data.type,
    height: data.height,
  }
};

formatWeather(weather: SurfLineForecastWeather, timestamp: number): Prisma.ForcastWeatherCreateWithoutForcastInput | undefined {
  const data = weather.data.weather.find((weather) => weather.timestamp === timestamp);
  if (!data) {
    console.log('No Weather Record found');
    return undefined;
    
  }
  return {
    timestamp: this.timeStampToDate(timestamp, data.utcOffset),
    utcOffset: data.utcOffset,
    units: JSON.stringify(weather.associated.units),
    temperature: data.temperature,
    condition: data.condition,
    pressure: data.pressure,
  }
};

formatSunlight(weather: SurfLineForecastWeather, timestamp: number): Prisma.ForcastSunLightCreateWithoutForcastInput | undefined {
  const data = weather.data.sunlightTimes;
  // if weather.data.sunlightTimes.dawn is the same day as timestamp, then return the data
  const match = data.find((sunlight) => {
    const date = new Date(sunlight.dawn);
    // convert timestamp to date
    const timestampDate = new Date(timestamp);
    // compare the day, month, and year
    return date.getDate() === timestampDate.getDate() && date.getMonth() === timestampDate.getMonth() && date.getFullYear() === timestampDate.getFullYear();
  });

  if (!match) {
    console.log('No Sunlight Record found');
    return undefined;
  }
  return {
    timestamp: this.timeStampToDate(timestamp, match.midnightUTCOffset),
    utcOffset: match.midnightUTCOffset,
    midnight: new Date(match.midnight * 1000),
    dusk: new Date(match.dusk  * 1000),
    dawn: new Date(match.dawn  * 1000),
    sunrise: new Date(match.sunrise  * 1000),
    sunset: new Date(match.sunset  * 1000),
  }
};

findRelatedData (timestamp: number, utcOffset: number, forcasts: AllForcasts): Prisma.ForcastCreateInput {
  return {
    timestamp: this.timeStampToDate(timestamp, utcOffset),
    utcOffset,
    location: {
      connect: {
        external_spot_id: forcasts.locationId,
      },
    },
    rating: {
      create: this.formatRating(forcasts.rating, timestamp),
    },
    waves: {
      create: this.formatWave(forcasts.wave, timestamp),
    },
    wind: {
      create: this.formatWind(forcasts.wind, timestamp),
    },
    tides: {
      create: this.formatTides(forcasts.tides, timestamp),
    },
    weather: {
      create: this.formatWeather(forcasts.weather, timestamp),
    },
    sunlight: {
      create: this.formatSunlight(forcasts.weather, timestamp),
    },
  };
};


  async getAllForcasts(id: string, days = 5, startDate?: string) {
    const rating = await this.getRating(id, days, startDate);
    const wave = await this.getWave(id, days, startDate);
    const wind = await this.getWind(id, days, startDate);
    const tides = await this.getTides(id, days, startDate);
    const weather = await this.getWeather(id, days, startDate);

    const forcasts = this.formatForcasts({ locationId: id, rating, wave, wind, tides, weather });
    const forcastProvider = new ForcastProvider()
    // get date of last forcast
    
    for (const forcast of forcasts) {
      console.log('DATE:', forcast.timestamp);
      const data = await forcastProvider.create(
        forcast,
      );
      console.log(data);
    }
    
  }

  async getForcastByDate(id: string, date: string) {
    const forcast = await this.getAllForcasts(id, 16, date);
  }


}