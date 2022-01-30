import { Flex, Box } from '@chakra-ui/react'
import * as React from 'react'

import Footer from '~/components/Footer'
import Header from '~/components/Header'

interface Props {
  children: React.ReactNode
  pageBgColor?: 'primaryBg' | 'secondaryBg'
}

const Layout = ({ children, pageBgColor = 'primaryBg' }: Props) => (
  <Flex height="100%" direction="column">
    <Header />
    <Box pt={{ base: 4, md: 8 }} flex="1 0 auto" bgColor={pageBgColor}>
      {children}
    </Box>
    <Footer />
  </Flex>
)

export default Layout
