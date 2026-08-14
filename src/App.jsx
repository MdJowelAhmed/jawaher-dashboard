import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { SidebarProvider } from './context/SidebarContext'
import { ToastViewport } from './components/ui/Toast'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <SidebarProvider>
            <AppRoutes />
            <ToastViewport />
          </SidebarProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
