import axios from "axios";

export async function getWeather(
  lat: number,
  lon: number
) {
  const url =
    "https://api.open-meteo.com/v1/forecast";

  const response = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lon,
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "wind_speed_10m"
      ].join(",")
    }
  });

  return response.data.current;
}