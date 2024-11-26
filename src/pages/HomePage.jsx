import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Spinner,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaCogs } from "react-icons/fa";
import { fetchWeather } from "../services/weatherService"; // Import the service

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("black", "white");

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C"); // State to manage the unit

  const getWeather = async (latitude, longitude) => {
    try {
      const data = await fetchWeather(latitude, longitude);
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather data.");
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeather(latitude, longitude);
        },
        () => {
          setError("Failed to get location.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  return (
    <Box minH="100vh" bg={bg} color={textColor} position="relative">
      {/* Main Content */}
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        {loading ? (
          <Spinner size="xl" />
        ) : error ? (
          <Text fontSize="xl" color="red.500">
            {error}
          </Text>
        ) : (
          <Box textAlign="center">
            <Text fontSize="4xl" fontFamily="monospace">
              {weatherData.location.name}
            </Text>
            <Text fontSize="lg">{weatherData.current.condition.text}</Text>
            <Text fontSize="2xl">
              {unit === "C"
                ? `${weatherData.current.temp_c}°C`
                : `${weatherData.current.temp_f}°F`}
            </Text>
          </Box>
        )}
      </Flex>

      {/* Floating Sidebar */}
      <Box
        position="fixed"
        top="50%"
        left="5"
        transform="translateY(-50%)"
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="lg"
        borderRadius="full"
        p={2}
      >
        <Flex direction="column" gap={2}>
          {/* Toggle Dark/Light Mode Button */}
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            isRound
            size="xs"
            colorScheme="teal"
          />

          <IconButton
            aria-label="Toggle Unit"
            icon={<FaCogs />}
            onClick={toggleUnit}
            isRound
            size="xs"
            colorScheme="teal"
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default HomePage;
