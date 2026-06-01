export function calculateHeatIndex(
  temp: number,
  humidity: number
) {
  return (
    temp +
    (0.33 * humidity) -
    (0.7 * 5)
  );
}