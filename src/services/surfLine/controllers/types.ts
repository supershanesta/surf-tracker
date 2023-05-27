export enum TaxonomyType {
  GEONAME="geoname",
  SPOT="spot",
}

export interface Taxonomy {
  _id: string;
  name: string;
  type: TaxonomyType
  hasSpots: boolean;
  spot?: boolean
  contains: Taxonomy[];
}