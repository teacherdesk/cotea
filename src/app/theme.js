// app/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e5f6ff',
      100: '#b3e1ff',
      200: '#80ccff',
      300: '#4db8ff',
      400: '#1aa3ff',
      500: '#008ae6',
      600: '#006bb4',
      700: '#004d81',
      800: '#002f4f',
      900: '#00121f',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#f4f4f7',
      },
    },
  },
});

export default theme;
