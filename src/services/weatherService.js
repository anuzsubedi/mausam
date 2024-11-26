import axios from "axios";

export const fetchWeather = async (latitude, longitude) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY; // Ensure key is set in .env
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

    const response = await axios.get(url);
    return response.data;
};
