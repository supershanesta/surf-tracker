export enum TaxonomyType {
  GEONAME="geoname",
  SPOT="spot",
}


export interface Geonames {
  population: number;
  fcode: string;
  fcl: string;  
  lat: string;
  adminName1: string;
  fcodeName: string;
  toponymName: string;
  fclName: string;
  name: string;
  geonameId: number;
  lng: string;
  countryCode: string,
  adminCode1: string
}
export interface Taxonomy {
  _id: string;
  name: string;
  type: TaxonomyType
  hasSpots: boolean;
  spot?: boolean
  depth?: number;
  parent?: Geonames
  geonames?: Geonames
  contains: Taxonomy[];
  in: Taxonomy[];
}