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
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi"; // Import weather icons
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
  const [unit, setUnit] = useState("C");

  const getWeatherIcon = (condition) => {
    // Map weather conditions to icons with colors
    if (condition.includes("Sunny"))
      return <WiDaySunny size="48" color="yellow" />;
    if (condition.includes("Cloud")) return <WiCloud size="48" color="gray" />;
    if (condition.includes("Rain")) return <WiRain size="48" color="blue" />;
    if (condition.includes("Snow")) return <WiSnow size="48" color="white" />;
    if (condition.includes("Thunder"))
      return <WiThunderstorm size="48" color="purple" />;
    if (condition.includes("Fog")) return <WiFog size="48" color="gray" />;
    return <WiCloud size="48" color="gray" />; // Default icon
  };

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
      <Flex justifyContent="center" alignItems="center" minH="40vh" mb={8}>
        {loading ? (
          <Spinner size="xl" />
        ) : error ? (
          <Text fontSize="xl" color="red.500">
            {error}
          </Text>
        ) : (
          <Box textAlign="center">
            <Box display="flex" justifyContent="center" mb={4}>
              {getWeatherIcon(weatherData.current.condition.text)}
            </Box>
            <Text fontSize="4xl" fontFamily="monospace">
              {weatherData.location.name}
            </Text>
            <Text fontSize="lg">{weatherData.current.condition.text}</Text>
            <Text fontSize="2xl" mt={2}>
              {unit === "C"
                ? `${weatherData.current.temp_c}°C`
                : `${weatherData.current.temp_f}°F`}
            </Text>
          </Box>
        )}
      </Flex>

      {/* Hourly Forecast Card */}
      {!loading && hourlyData.length > 0 && (
        <Flex justifyContent="center">
          <Box
            bg={cardBg}
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            w={["80%", "80%", "50%"]} // Responsive widths: 80% for small screens, 50% for large screens
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Hourly Forecast
            </Text>
            <HStack
              spacing={4}
              overflowX="auto"
              py={2}
              scrollbarWidth="thin"
              css={{
                scrollbarColor: `${useColorModeValue(
                  "#A0AEC0",
                  "#4A5568"
                )} ${useColorModeValue("#EDF2F7", "#2D3748")}`,
                "::-webkit-scrollbar": {
                  height: "6px",
                },
                "::-webkit-scrollbar-track": {
                  backgroundColor: useColorModeValue("#EDF2F7", "#2D3748"),
                },
                "::-webkit-scrollbar-thumb": {
                  backgroundColor: useColorModeValue("#A0AEC0", "#4A5568"),
                  borderRadius: "8px",
                },
                "::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: useColorModeValue("#718096", "#2D3748"),
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
                  {getWeatherIcon(hour.condition.text)}
                  <Text fontSize="md" fontWeight="bold">
                    {unit === "C" ? `${hour.temp_c}°C` : `${hour.temp_f}°F`}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Box>
        </Flex>
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
