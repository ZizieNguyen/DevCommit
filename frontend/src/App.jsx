import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Layout from './layouts/Layout';


// Importación de la página de login
import Login from './auth/Login';
import Registro from './auth/Registro';
import OlvidePassword from './auth/OlvidePassword';
import Confirmar from './auth/Confirmar';
import  Reestablecer from './auth/Reestablecer';

// Páginas de administrador
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminPonentes from './pages/admin/AdminPonentes';
// import AdminEventos from './pages/admin/AdminEventos';
// import AdminRegistrados from './pages/admin/AdminRegistrados';
// import AdminRegalos from './pages/admin/AdminRegalos';
// import AdminPerfil from './pages/admin/AdminPerfil';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Área pública */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />
              <Route path="olvide-password" element={<OlvidePassword />} />
              <Route path="confirmar/:token" element={<Confirmar />} />
              <Route path="reestablecer-password/:token" element={<Reestablecer />} />
          </Route>

          {/* Área de administración */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* <Route path="ponentes" element={<AdminPonentes />} />
            <Route path="eventos" element={<AdminEventos />} />
            <Route path="registrados" element={<AdminRegistrados />} />
            <Route path="regalos" element={<AdminRegalos />} />
            <Route path="perfil" element={<AdminPerfil />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;