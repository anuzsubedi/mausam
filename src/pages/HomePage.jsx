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
  Input,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import {
  FaMoon,
  FaSun,
  FaSearchLocation,
  FaSearch,
  FaMapPin,
} from "react-icons/fa";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi"; // Import weather icons
import { fetchHourlyForecast } from "../services/weatherService";
import { FaLocationCrosshairs, FaLocationPin } from "react-icons/fa6";

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");
  const [searchQuery, setSearchQuery] = useState("");

  const getWeatherIcon = (condition, size) => {
    // Map weather conditions to icons with customizable size
    if (condition.includes("Sunny")) return <WiDaySunny size={size} />;
    if (condition.includes("Cloud")) return <WiCloud size={size} />;
    if (condition.includes("Rain")) return <WiRain size={size} />;
    if (condition.includes("Snow")) return <WiSnow size={size} />;
    if (condition.includes("Thunder")) return <WiThunderstorm size={size} />;
    if (condition.includes("Fog")) return <WiFog size={size} />;
    return <WiCloud size={size} />;
  };

  const getWeather = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHourlyForecast(query);
      setWeatherData(data);
      setHourlyData(data.forecast.forecastday[0].hour); // Set hourly forecast
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch weather data.");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      getWeather(searchQuery);
    } else {
      setError("Please enter a valid city name.");
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeather(`${latitude},${longitude}`);
        },
        () => {
          setError("Failed to get location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  return (
    <Box minH="100vh" bg={bg} color={textColor} p={4} fontFamily="monospace">
      <Flex justifyContent="center" alignItems="center" mb={4}>
        <InputGroup width={["80%", "80%", "50%"]}>
          <Input
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={cardBg}
            borderRadius="lg"
          />
          <InputRightElement>
            <IconButton
              aria-label="Search"
              icon={<FaSearch />}
              onClick={handleSearch}
              isRound
              size="sm"
              bg="transparent"
            />
          </InputRightElement>
        </InputGroup>
        <IconButton
          ml={2}
          aria-label="Use GPS"
          icon={<FaLocationCrosshairs />}
          onClick={getLocation}
          isRound
          size="sm"
          bg="transparent"
        />
      </Flex>
      {/* Error Notification */}
      {error && (
        <Flex justifyContent="center" mb={4}>
          <Alert status="error" w={["80%", "80%", "50%"]} borderRadius="lg">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Flex>
      )}
      {/* Main Weather Section */}
      <Flex justifyContent="center" alignItems="center" mb={8}>
        {loading ? (
          <Spinner size="xl" />
        ) : weatherData ? (
          <Box bg={bg} p={4} w={["80%", "80%", "50%"]}>
            <Flex alignItems="center" justifyContent="space-between">
              <Box textAlign="left">
                <Text fontSize="4xl" mb={2}>
                  {weatherData.location.name}
                </Text>
                <Text fontSize="lg" mb={4}>
                  {weatherData.current.condition.text}
                </Text>
                <Text fontSize="5xl">
                  {unit === "C"
                    ? `${weatherData.current.temp_c}°C`
                    : `${weatherData.current.temp_f}°F`}
                </Text>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center">
                {getWeatherIcon(weatherData.current.condition.text, 128)}
              </Box>
            </Flex>
          </Box>
        ) : null}
      </Flex>
      {/* Hourly Forecast Card */}
      {!loading && hourlyData.length > 0 && (
        <Flex justifyContent="center">
          <Box
            bg={cardBg}
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            w={["80%", "80%", "50%"]}
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Hourly Forecast
            </Text>
            <HStack spacing={4} overflowX="auto" py={2}>
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
                  {getWeatherIcon(hour.condition.text, 48)}
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
        bg={cardBg}
        p={2}
      >
        <Flex direction="column" gap={2}>
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            isRound
            size="sm"
            bg="transparent"
          />
          <IconButton
            aria-label="Toggle Unit"
            icon={<Text fontSize="sm">{unit}</Text>}
            onClick={toggleUnit}
            isRound
            size="sm"
            bg="transparent"
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default HomePage;
