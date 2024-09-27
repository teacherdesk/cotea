// app/components/DashboardContent.js
'use client';

import { SimpleGrid, Box } from '@chakra-ui/react';
import StatsCard from './StatsCard';

const DashboardContent = () => {
  return (
    <Box>
      <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={10}>
        <StatsCard title="Total Users" stat="1,245" />
        <StatsCard title="Sales" stat="$45,000" />
        <StatsCard title="Performance" stat="95%" />
      </SimpleGrid>
    </Box>
  );
};

export default DashboardContent;
