import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/index.js'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'




const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={createTheme({
        breakpoints: {
          values: {
            laptop: 1024,
            tablet: 640,
            mobile: 0,
            desktop: 1280,
            lg: 1280,
          }
        }
      })}>
        <RouterProvider router={router} >


          <CssBaseline />
          <App />



        </RouterProvider>
      </ThemeProvider>


    </QueryClientProvider>
  </StrictMode>,
)
