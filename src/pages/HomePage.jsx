import React from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaCogs } from "react-icons/fa";

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("black", "white");

  return (
    <Box minH="100vh" bg={bg} color={textColor} position="relative">
      {/* Main Content */}
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Text fontSize="4xl" fontFamily="monospace">
          chakra
        </Text>
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
            onClick={() => alert("Change Unit Functionality!")}
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
