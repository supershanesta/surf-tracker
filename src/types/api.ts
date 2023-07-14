export interface CreateSurfActivityInputType {
  date: string;
  users: string[] | [];
  beach: string;
  surfRating: CreateSurfActivitySurfRatingInputType;
}

export interface CreateSurfRatingInputType {
  surfActivityId: string;
  notes: string | null;
  rating: number;
  size: number;
  shape: number;
}

export interface CreateSurfActivitySurfRatingInputType {
  notes: string | null;
  rating: number;
  size: number;
  shape: number;
}

export interface UpdateSurfRatingInputType {
  id: string;
  notes: string | null;
  rating: number;
  size: number;
  shape: number;
}

export interface UpdateSurfActivitySurfRatingInputType {
  id?: string;
  notes: string | null;
  rating: number;
  size: number;
  shape: number;
}

export interface UpdateSurfActivityInputType {
    id: string;
    date: string;
    users: string[];
    beach: string;
    surfRating?: UpdateSurfActivitySurfRatingInputType;
}

export interface DeleteSurfActivityInputType {
    id: string;
}

export interface DeleteSurfRatingInputType {
    id: string;
}