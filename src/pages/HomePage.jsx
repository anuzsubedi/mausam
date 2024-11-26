import React from "react";
import { Box, Text, Center } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <Center height="100vh" bg="gray.100">
      <Box textAlign="center" flex="column">
        <Text fontSize="4xl" fontFamily="monospace" mt={4}>
          mausam
        </Text>
      </Box>
    </Center>
  );
};

export default HomePage;
