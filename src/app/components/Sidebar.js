// Sidebar.js
'use client';

import { Box, Flex, VStack, Text, Link, Icon } from '@chakra-ui/react';
import { FaHome, FaChartBar, FaCog, FaInfoCircle } from 'react-icons/fa';
import NextLink from 'next/link';

const Sidebar = () => {
  return (
    <Box position="fixed" left="0" w="250px" h="100vh" bg="teal.500" color="white" p={5}>
      <Text fontSize="xl" fontWeight="bold" mb={5}>
        My Dashboard
      </Text>
      <VStack spacing={4} align="flex-start">
        <Link as={NextLink} href="/" w="full">
          <Flex align="center">
            <Icon as={FaHome} mr={3} />
            Home
          </Flex>
        </Link>
        <Link as={NextLink} href="/dashboard" w="full">
          <Flex align="center">
            <Icon as={FaChartBar} mr={3} />
            Dashboard
          </Flex>
        </Link>
        <Link as={NextLink} href="/dashboard/stats" w="full">
          <Flex align="center">
            <Icon as={FaInfoCircle} mr={3} />
            Stats
          </Flex>
        </Link>
        <Link as={NextLink} href="/settings" w="full">
          <Flex align="center">
            <Icon as={FaCog} mr={3} />
            Settings
          </Flex>
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
