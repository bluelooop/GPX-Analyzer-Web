export interface RouteProvider {
  name: string;
  consentUrl?: string;
}

export interface ApiError {
  message: string;
}

export interface GPXSegment {
  number: number;
  startElevation: number;
  endElevation: number;
  minElevation: number;
  maxElevation: number;
  distance: number;
  startDistance: number;
  endDistance: number;
  elevationGain: number;
  elevationLoss: number;
  avgGrade: number;
  minGrade: number;
  maxGrade: number;
}

export interface GPXRoute {
  name: string;
  description: string;
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  segments: GPXSegment[];
}
