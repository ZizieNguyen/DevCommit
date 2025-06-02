import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas públicas
import HomePage from './pages/public/HomePage';
import EventosPage from './pages/public/EventosPage';
import EventoDetailPage from './pages/public/EventoDetailPage';
import PonentesPage from './pages/public/PonentesPage';
import PonenteDetailPage from './pages/public/PonenteDetailPage';

// Páginas de autenticación
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from './pages/auth/LoginPage';
import PasswordResetPage from './pages/auth/PasswordResetPage';
import ConfirmarRegistroPage from './pages/auth/ConfirmarRegistroPage';

// Páginas de administración - Corregidas según nombres actuales
import DashboardPage from './pages/admin/AdminDashboardPage';
import EventosAdminPage from './pages/admin/AdminEventsPage';
import PonentesAdminPage from './pages/admin/AdminSpeakersPage';
import RegistrosAdminPage from './pages/admin/AdminRegistrationsPage';

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
          </Route>
          
          {/* Rutas Protegidas de Admin */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="eventos" element={<EventosAdminPage />} />
            <Route path="ponentes" element={<PonentesAdminPage />} />
            <Route path="registros" element={<RegistrosAdminPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;