'use client'

import { IconButton, Skeleton, Box } from '@mui/material'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { useMediaQuery } from '@mui/material'

import * as React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

export function ColorModeProvider(props) {
  return (
    <NextThemesProvider attribute='class' disableTransitionOnChange {...props} />
  )
}

export function useColorMode() {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme || resolvedTheme
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }
  return {
    colorMode: colorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />
}

export const ColorModeButton = React.forwardRef(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode()
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    
    // ClientOnly equivalent using React's useEffect for hydration safety
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    
    if (!mounted) {
      return <Skeleton variant="circular" width={32} height={32} />
    }
    
    return (
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        aria-label="Toggle color mode"
        size="small"
        ref={ref}
        sx={{
          '& svg': {
            width: 20,
            height: 20,
          },
        }}
        {...props}
      >
        <ColorModeIcon />
      </IconButton>
    )
  },
)

export const LightMode = React.forwardRef(function LightMode(props, ref) {
  return (
    <Box
      component="span"
      sx={{ 
        display: 'contents',
        color: 'text.primary'
      }}
      className='mui-theme light'
      ref={ref}
      {...props}
    />
  )
})

export const DarkMode = React.forwardRef(function DarkMode(props, ref) {
  return (
    <Box
      component="span"
      sx={{ 
        display: 'contents',
        color: 'text.primary'
      }}
      className='mui-theme dark'
      ref={ref}
      {...props}
    />
  )
})
