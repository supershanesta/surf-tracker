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
  notes: string | null;
	rating: number;
	size: number;
	shape: number;
}