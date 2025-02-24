export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
}

export interface SurfRatingType {
  id: string;
  user: UserType;
  notes: string | null;
  rating: number;
  size: number;
  shape: number;
}

export interface LocationType {
  id: string;
  name: string;
  type: string;
  city: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
}

export interface SurfActivityType {
  id: string;
  date: string;
  beach: LocationType;
  users: UserType[];
  surfRatings: SurfRatingType[];
  mySurfRating?: SurfRatingType;
  createdBy: UserType;
}

export interface FriendRequestType {
  id: string;
  fromUser: UserType;
  toUser: UserType;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
