import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '../pages/LoginPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { DashboardPage } from '../pages/DashboardPage'
import { UsersPage } from '../pages/UsersPage'
import { UserDetailsPage } from '../pages/UserDetailsPage'
import { TriviaPage } from '../pages/TriviaPage'
import { TriviaFormPage } from '../pages/TriviaFormPage'
import { CategoriesPage } from '../pages/CategoriesPage'
import { GamesPage } from '../pages/GamesPage'
import { GameDetailsPage } from '../pages/GameDetailsPage'
import { ReportsPage } from '../pages/ReportsPage'
import { NotificationsPage } from '../pages/NotificationsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailsPage />} />
        <Route path="/trivia" element={<TriviaPage />} />
        <Route path="/trivia/create" element={<TriviaFormPage />} />
        <Route path="/trivia/:id/edit" element={<TriviaFormPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:id" element={<GameDetailsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
