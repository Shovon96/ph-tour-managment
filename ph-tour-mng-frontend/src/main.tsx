import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { routes } from './routes/index.ts'
import { ThemeProvider } from './providers/Theme.Provider.tsx'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './redux/store.ts'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider>
        <RouterProvider router={routes} />
        <Toaster />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
)
