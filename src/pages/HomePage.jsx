import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Spinner,
  VStack,
  HStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaCogs } from "react-icons/fa";
import { fetchHourlyForecast } from "../services/weatherService";

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C"); // State to manage the unit

  const getWeather = async (latitude, longitude) => {
    try {
      const data = await fetchHourlyForecast(latitude, longitude);
      setWeatherData(data);
      setHourlyData(data.forecast.forecastday[0].hour); // Set hourly forecast
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
    <Box minH="100vh" bg={bg} color={textColor} p={4}>
      {/* Main Weather Section */}
      <Flex justifyContent="center" alignItems="center" minH="40vh">
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

      {/* Hourly Forecast Card */}
      {!loading && hourlyData.length > 0 && (
        <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="lg" mt={8}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Hourly Forecast
          </Text>
          <HStack
            spacing={4}
            overflowX="auto"
            py={2}
            css={{
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {hourlyData.map((hour, index) => (
              <VStack
                key={index}
                bg={useColorModeValue("gray.200", "gray.600")}
                p={4}
                borderRadius="md"
                boxShadow="md"
                minW="100px"
                textAlign="center"
              >
                <Text fontSize="sm">{hour.time.split(" ")[1]}</Text>
                <Box
                  as="img"
                  src={`https:${hour.condition.icon}`}
                  alt={hour.condition.text}
                  boxSize="40px"
                />
                <Text fontSize="md" fontWeight="bold">
                  {unit === "C" ? `${hour.temp_c}°C` : `${hour.temp_f}°F`}
                </Text>
              </VStack>
            ))}
          </HStack>
        </Box>
      )}

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
