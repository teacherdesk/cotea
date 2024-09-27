// Header.js
'use client';

import { Flex, Box, Text, Avatar, Spacer } from '@chakra-ui/react';

const Header = () => {
  return (
    <Flex
      as="header"
      width="full"
      height="60px"
      align="center"
      px={6}
      bg="white"
      borderBottomWidth="1px"
      shadow="sm"
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          Dashboard
        </Text>
      </Box>
      <Spacer />
      <Box>
        <Flex align="center">
          <Avatar size="sm" name="John Doe" />
          <Text ml={3} fontWeight="medium">
            John Doe
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Header;
