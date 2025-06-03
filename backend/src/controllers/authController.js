import usuarioService from '../services/usuarioService.js';
import { generarId, generarJWT, generarError } from '../utils/helpers.js';
import { enviarEmail } from '../utils/email.js';

const registro = async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar que el usuario no exista
    const existeUsuario = await usuarioService.buscarPorEmail(email);
    
    if (existeUsuario) {
      throw generarError(400, 'ConflictError', 'El usuario ya está registrado');
    }
    
    // Crear un nuevo usuario
    const token = generarId();
    const usuario = await usuarioService.crear({
      ...req.body,
      token
    });
    
    // Enviar email de confirmación
    await enviarEmail({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
      tipo: 'confirmar'
    });
    
    // Responder al cliente
    res.json({
      msg: 'Usuario creado correctamente, revisa tu email para confirmar tu cuenta'
    });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error.message || 'Hubo un error al registrar el usuario' });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  
  try {
    // Verificar si el token es válido
    const usuario = await usuarioService.buscarPorToken(token);
    
    if (!usuario) {
      throw generarError(404, 'NotFoundError', 'Token no válido');
    }
    
    // Confirmar usuario
    await usuarioService.actualizar(usuario.id, {
      confirmado: true,
      token: null
    });
    
    res.json({ msg: 'Usuario confirmado correctamente, ya puedes iniciar sesión' });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error.message || 'Hubo un error al confirmar la cuenta' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verificar el usuario
    const usuario = await usuarioService.verificarCredenciales(email, password);
    
    // Generar JWT
    const token = generarJWT(usuario);
    
    // Importante: no incluir información sensible
    res.json({
      resultado: true,
      msg: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        admin: !!usuario.admin // Asegura que sea booleano
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(error.status || 403).json({
      resultado: false,
      msg: error.message || 'Credenciales incorrectas'
    });
  }
};


const olvidePassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    // Verificar que el usuario exista
    const usuario = await usuarioService.buscarPorEmail(email);
    
    if (!usuario) {
      throw generarError(404, 'NotFoundError', 'El usuario no existe');
    }
    
    // Generar un token
    const token = generarId();
    
    // Actualizar el usuario con el nuevo token
    await usuarioService.actualizar(usuario.id, { token });
    
    // Enviar email
    await enviarEmail({
      email: usuario.email,
      nombre: usuario.nombre,
      token,
      tipo: 'olvide-password'
    });
    
    // Responder al cliente
    res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error.message || 'Hubo un error al solicitar el restablecimiento de password' });
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  
  try {
    // Verificar que el token exista
    const usuario = await usuarioService.buscarPorToken(token);
    
    if (!usuario) {
      throw generarError(404, 'NotFoundError', 'Token no válido');
    }
    
    // Token válido
    res.json({ msg: 'Token válido' });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error.message || 'Hubo un error al comprobar el token' });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  try {
    // Verificar que el token exista
    const usuario = await usuarioService.buscarPorToken(token);
    
    if (!usuario) {
      throw generarError(404, 'NotFoundError', 'Token no válido');
    }
    
    // Cambiar password y eliminar token
    await usuarioService.cambiarPassword(usuario.id, password);
    await usuarioService.actualizar(usuario.id, { token: null });
    
    // Responder al cliente
    res.json({ msg: 'Password actualizado correctamente' });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error.message || 'Hubo un error al actualizar el password' });
  }
};

const perfil = (req, res) => {
  try {
    const { usuario } = req;
    
    if (!usuario) {
      throw generarError(401, 'AuthError', 'No hay usuario autenticado');
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ msg: error.message || 'Error al obtener el perfil' });
  }
};

export {
  registro,
  confirmar,
  login,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil
};