import { extendTheme } from '@chakra-ui/react'
import "@fontsource/roboto"

export const mynewtheme = extendTheme({
 // theme.js
  colors: {
    transparent: 'transparent',
    black: '#000',
    white: '#fff',
    gray: {
      50: '#f7fafc',
      // ...
      900: '#171923',
    },
    // ...
  },  
})
