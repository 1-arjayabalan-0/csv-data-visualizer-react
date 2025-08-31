import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './styles/tailwind.css';
import { TabProvider } from "./context/TabContext";
import { AuthProvider } from "./context/AuthContext";
import { ToasterProvider } from "./components/ui/toaster";
import { Box, CircularProgress } from "@mui/material";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import GoogleCallback from "./components/auth/GoogleCallback";

// Use dynamic import with SSR option to avoid hydration issues
const DataVisualizer = lazy(() => import("./pages/data-visualizer/DataVisualizer"));

// Custom error boundary for Suspense fallbacks as a functional component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const fallbackRender = ({ error }: { error: Error }) => {
    console.error("React Error Boundary caught an error:", error);
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <h2>Something went wrong loading the application.</h2>
        <p>Please refresh the page to try again.</p>
      </Box>
    );
  };

  return (
    <ReactErrorBoundary
      fallbackRender={fallbackRender}
      onError={(error: Error, info: { componentStack: string }) => {
        console.error("React Error Boundary caught an error:", error, info);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

function App() {
  return (
    <ToasterProvider>
      <AuthProvider>
        <Router>
          <TabProvider>
          <Box
            component="main"
            sx={{
              height: '100vh',
              width: '100%',
              bgcolor: 'grey.50'
            }}
          >
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<GoogleCallback />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Suspense 
                        fallback={
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                          </Box>
                        }
                      >
                        <DataVisualizer />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </ErrorBoundary>
          </Box>
          </TabProvider>
        </Router>
      </AuthProvider>
    </ToasterProvider>
  );
}

export default App;
