import {
  LocationType,
  UserType,
} from './types';

export interface SurfActivityFormType {
  id?: string;
  date: string;
  users: UserType[];
  beach: LocationType | null;
  surfRating: SurfRatingFormType;
}

export interface SurfRatingFormType {
	id?: string;
	rating: number;
	size: number;
	shape: number;
}