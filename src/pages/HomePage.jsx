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
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import { fetchHourlyForecast } from "../services/weatherService";

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
  const [locationError, setLocationError] = useState(false);

  const getWeatherIcon = (condition, size) => {
    if (condition.includes("Sunny")) return <WiDaySunny size={size} />;
    if (condition.includes("Cloud")) return <WiCloud size={size} />;
    if (condition.includes("Rain")) return <WiRain size={size} />;
    if (condition.includes("Snow")) return <WiSnow size={size} />;
    if (condition.includes("Thunder")) return <WiThunderstorm size={size} />;
    if (condition.includes("Fog")) return <WiFog size={size} />;
    return <WiCloud size={size} />;
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const getWeather = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHourlyForecast(query);
      setWeatherData(data);
      setHourlyData(data.forecast.forecastday[0].hour);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch weather data.");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      getWeather(searchQuery);
      setLocationError(false);
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
          setLocationError(false);
        },
        () => {
          setLocationError(true);
        }
      );
    } else {
      setLocationError(true);
    }
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  useEffect(() => {
    getLocation(); // Fetch location on app load
  }, []);

  return (
    <Box minH="100vh" bg={bg} color={textColor} p={4} fontFamily="monospace">
      <Flex
        minH="100vh"
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={6}
      >
        {/* Search Bar */}
        <Flex
          justifyContent="center"
          alignItems="center"
          width={["80%", "80%", "50%"]}
        >
          <InputGroup>
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
        {(error || locationError) && (
          <Flex justifyContent="center" width={["80%", "80%", "50%"]}>
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>
                {error ||
                  "Failed to access location. Please allow permission or search for a city.."}
              </AlertDescription>
            </Alert>
          </Flex>
        )}

        {/* Main Weather Section */}
        {loading ? (
          <Spinner size="xl" />
        ) : weatherData ? (
          <Box bg={bg} p={4} width={["80%", "80%", "50%"]}>
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

        {/* Hourly Forecast Card */}
        {!loading && hourlyData.length > 0 && (
          <Box
            bg={cardBg}
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            width={["80%", "80%", "50%"]}
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
                  <Text fontSize="sm">
                    {formatTime(hour.time.split(" ")[1])}
                  </Text>
                  {getWeatherIcon(hour.condition.text, 48)}
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
              icon={<Text fontSize="sm">°{unit}</Text>}
              onClick={toggleUnit}
              isRound
              size="sm"
              bg="transparent"
            />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default HomePage;
