import React from "react";
import { Box, Image } from "@chakra-ui/react";

const LayoutWrapper = ({ children }) => {
  return (
    <Box minH="100vh" position="relative" zIndex="1" >
      <Box position="relative" zIndex="99">
        {children}
      </Box>
    </Box>
  );
};

export default LayoutWrapper;