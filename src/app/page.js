// app/page.js
'use client';

import { Box, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function HomePage() {
  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Welcome to My Website!
      </Text>
      <Text>
        Go to the <Link as={NextLink} href="/dashboard" color="teal.500">Dashboard</Link>.
      </Text>
    </Box>
  );
}
