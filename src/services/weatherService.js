import axios from "axios";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // Ensure key is set in .env
const baseUrl = "https://api.weatherapi.com/v1";

const fetchWeatherData = async (endpoint, latitude, longitude, params = "") => {
    const url = `${baseUrl}/${endpoint}.json?key=${apiKey}&q=${latitude},${longitude}${params}`;
    const response = await axios.get(url);
    return response.data;
};

export const fetchWeather = (latitude, longitude) => {
    return fetchWeatherData("current", latitude, longitude, "&aqi=no");
};

export const fetchHourlyForecast = (latitude, longitude) => {
    return fetchWeatherData("forecast", latitude, longitude, "&hours=24");
};