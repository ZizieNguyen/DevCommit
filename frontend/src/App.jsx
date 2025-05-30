import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Páginas públicas
import { HomePage } from './pages/HomePage';
import { EventosPage } from './pages/EventosPage';
import { EventoDetailPage } from './pages/EventoDetailPage';
import { PonentesPage } from './pages/PonentesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Páginas protegidas
import { PerfilPage } from './pages/PerfilPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Rutas públicas */}
          <Route index element={<HomePage />} />
          <Route path="eventos" element={<EventosPage />} />
          <Route path="eventos/:id" element={<EventoDetailPage />} />
          <Route path="ponentes" element={<PonentesPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="registro" element={<RegisterPage />} />
          
          {/* Rutas protegidas (requieren autenticación) */}
          <Route path="perfil" element={
            <ProtectedRoute>
              <PerfilPage />
            </ProtectedRoute>
          } />
          
          {/* Ruta 404 - debe ir al final */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;