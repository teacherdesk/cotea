// app/dashboard/layout.js
'use client';

import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar'; // default export로 내보냈기 때문에 기본 임포트 사용
import Header from '../components/Header';   // default export로 내보냈기 때문에 기본 임포트 사용
import theme from '../theme';

export default function DashboardLayout({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <Flex height="100vh">
        {/* 사이드바 */}
        <Sidebar />

        {/* 메인 콘텐츠 */}
        <Box flex="1" marginLeft="250px" bg="gray.50">
          <Header /> {/* 헤더 */}
          <Box as="main" p={6}>
            {children}
          </Box>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}
