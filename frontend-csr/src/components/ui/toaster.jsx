'use client'

import { Snackbar, Alert, CircularProgress, Box, Button, Typography, Portal } from '@mui/material'
import * as React from 'react'

// Create a simple toast management system using React context
const ToasterContext = React.createContext(null)

export const createToaster = (options = {}) => {
  return {
    ...options,
    toasts: [],
    addToast: () => {}, // Will be implemented in the provider
    removeToast: () => {}, // Will be implemented in the provider
    updateToast: () => {}, // Will be implemented in the provider
  }
}

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
})

// Provider component
export const ToasterProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([])
  
  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }
  
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }
  
  const updateToast = (id, toast) => {
    setToasts((prev) => 
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    )
  }
  
  const value = React.useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    updateToast,
  }), [toasts])
  
  return (
    <ToasterContext.Provider value={value}>
      {children}
      <Toaster />
    </ToasterContext.Provider>
  )
}

// Hook to use the toaster
export const useToaster = () => {
  const context = React.useContext(ToasterContext)
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider')
  }
  return context
}

// Toaster component that displays the toasts
export const Toaster = () => {
  const { toasts, removeToast } = useToaster() || { toasts: [], removeToast: () => {} }
  
  return (
    <Portal>
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 2000 }}>
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open={true}
            autoHideDuration={toast.duration || 6000}
            onClose={() => removeToast(toast.id)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ mb: 2 }}
          >
            <Alert
              severity={toast.type || 'info'}
              variant="filled"
              onClose={() => removeToast(toast.id)}
              icon={toast.type === 'loading' ? <CircularProgress size={20} color="inherit" /> : undefined}
              action={toast.action && (
                <Button color="inherit" size="small" onClick={toast.action.onClick}>
                  {toast.action.label}
                </Button>
              )}
            >
              <Box>
                {toast.title && (
                  <Typography variant="subtitle2">{toast.title}</Typography>
                )}
                {toast.description && (
                  <Typography variant="body2">{toast.description}</Typography>
                )}
              </Box>
            </Alert>
          </Snackbar>
        ))}
      </Box>
    </Portal>
  )
}
