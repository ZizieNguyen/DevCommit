import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Páginas públicas
import HomePage from './pages/public/HomePage';
import EventosPage from './pages/public/EventosPage';
import EventoDetailPage from './pages/public/EventoDetailPage';
import PonentesPage from './pages/public/PonentesPage';
import PonenteDetailPage from './pages/public/PonenteDetailPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Páginas de autenticación
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from './pages/auth/LoginPage';
import PasswordResetPage from './pages/auth/PasswordResetPage';
import ConfirmarRegistroPage from './pages/auth/ConfirmarRegistroPage';

// Páginas de administración - Corregidas según nombres actuales
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminNewEventPage from './pages/admin/AdminNewEventPage';
import AdminEditEventPage from './pages/admin/AdminEditEventPage';
import AdminSpeakersPage from './pages/admin/AdminSpeakersPage';
import AdminNewSpeakerPage from './pages/admin/AdminNewSpeakerPage';
import AdminEditSpeakerPage from './pages/admin/AdminEditSpeakerPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';



// Provider de autenticación
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="eventos" element={<EventosPage />} />
            <Route path="eventos/:id" element={<EventoDetailPage />} />
            <Route path="ponentes" element={<PonentesPage />} />
            <Route path="ponentes/:id" element={<PonenteDetailPage />} />
            <Route path="workshops" element={<EventosPage tipo="workshop" />} />
            <Route path="registro" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="olvide-password" element={<PasswordResetPage />} />
            <Route path="confirmar-registro/:token" element={<ConfirmarRegistroPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Rutas Protegidas de Admin */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="eventos" element={<AdminEventsPage />} />
            <Route path="eventos/nuevo" element={<AdminNewEventPage />} />
            <Route path="eventos/editar/:id" element={<AdminEditEventPage />} />
            <Route path="ponentes" element={<AdminSpeakersPage />} />
            <Route path="ponentes/nuevo" element={<AdminNewSpeakerPage />} />
            <Route path="ponentes/editar/:id" element={<AdminEditSpeakerPage />} />
            <Route path="registros" element={<AdminRegistrationsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;