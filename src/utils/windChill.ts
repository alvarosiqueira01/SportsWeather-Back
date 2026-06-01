export function calculateWindChill(
  temp: number,
  windSpeed: number
) {
  return (
    13.12 +
    0.6215 * temp -
    11.37 * Math.pow(windSpeed, 0.16) +
    0.3965 *
      temp *
      Math.pow(windSpeed, 0.16)
  );
}