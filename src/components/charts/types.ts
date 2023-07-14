export interface filters {
	startDate: string;
	endDate: string;
	rating?: number;
}

export interface data {
	name: string;
	value: number;
}

export interface ChartProps {
  data: data[];
  filters: filters
}

export interface rawData {
  [key: string]: number 
}