export interface WeatherEvaluationDTO {

  activity: string;

  temperature: number;

  humidity: number;

  windSpeed: number;

  heatIndex: number;

  windChill: number;

  comfortScore: number;

  verdict:
    | "EXCELLENT"
    | "GOOD"
    | "MODERATE"
    | "POOR";
}