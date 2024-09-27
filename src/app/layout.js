// app/layout.js
'use client';

import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import theme from './theme';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function RootLayout({ children }) {
  const pathname = usePathname(); // 현재 경로를 가져옴

  // 홈 화면인 경우 여백을 추가, 나머지 페이지는 기본 레이아웃 사용
  const isHomePage = pathname === '/';

  return (
    <html lang="en">
      <head>
        {/* YouTube Iframe API 추가 */}
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="beforeInteractive" // 스크립트를 페이지가 인터랙티브하기 전에 로드
        />
      </head>
      <body>
        <ChakraProvider theme={theme}>
          <Flex height="100vh">
            {/* 사이드바는 항상 표시 */}
            <Sidebar />

            {/* 메인 콘텐츠 영역 */}
            <Box
              flex="1"
              bg="gray.50"
              p={6}
              ml={isHomePage ? '250px' : '0'} // 홈 화면에서만 여백 추가
              overflowY="auto"
            >
              {children}
            </Box>
          </Flex>
        </ChakraProvider>
      </body>
    </html>
  );
}
