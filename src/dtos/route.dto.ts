export interface RouteSegment {
  index: number;
  lat: number;
  lon: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  heatIndex: number;
  windChill: number;
  comfortScore: number;
  verdict: "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";
}

export interface CriticalSegment {
  fromIndex: number;
  toIndex: number;
  reason: string;
  avgScore: number;
}

export interface RouteEvaluationDTO {
  activity: string;
  totalDistance?: number;
  overallScore: number;
  overallVerdict: "EXCELLENT" | "GOOD" | "MODERATE" | "POOR";
  segments: RouteSegment[];
  criticalSegments: CriticalSegment[];
}
