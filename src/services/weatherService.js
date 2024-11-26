import axios from "axios";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // Ensure key is set in .env
const baseUrl = "https://api.weatherapi.com/v1";

const fetchWeatherData = async (endpoint, query, params = "") => {
    try {
        const url = `${baseUrl}/${endpoint}.json?key=${apiKey}&q=${query}${params}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.error?.message || "Failed to fetch weather data.";
        throw new Error(errorMessage);
    }
};

export const fetchHourlyForecast = (query) => {
    // `query` can be a city name or "latitude,longitude"
    return fetchWeatherData("forecast", query, "&days=1&hourly=1");
};
