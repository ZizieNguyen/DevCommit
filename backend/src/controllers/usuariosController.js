/**
 * Controlador para la autenticación de usuarios
 */
import usuarioService from '../services/usuarioService.js';
import { generarId, generarJWT, generarError } from '../utils/helpers.js';
import { enviarEmail } from '../utils/email.js';

/**
 * Registra un nuevo usuario
 */
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
      resultado: true,
      msg: 'Usuario creado correctamente, revisa tu email para confirmar tu cuenta'
    });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ 
      resultado: false,
      msg: error.message || 'Hubo un error al registrar el usuario' 
    });
  }
};

/**
 * Confirma la cuenta de un usuario mediante token
 */
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
    
    res.json({ 
      resultado: true,
      msg: 'Usuario confirmado correctamente, ya puedes iniciar sesión' 
    });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ 
      resultado: false,
      msg: error.message || 'Hubo un error al confirmar la cuenta' 
    });
  }
};

/**
 * Autentica a un usuario y devuelve un JWT
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Autenticar usuario mediante el servicio
    const usuario = await usuarioService.autenticar(email, password);
    
    // Generar JWT incluyendo admin
    const token = generarJWT(usuario.id, Boolean(usuario.admin));
    
    // Devolver respuesta
    res.json({
      resultado: true,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        admin: Boolean(usuario.admin)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ 
      resultado: false,
      msg: error.message || 'Hubo un error al iniciar sesión' 
    });
  }
};

/**
 * Solicitud para restablecer contraseña
 */
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
    res.json({ 
      resultado: true,
      msg: 'Hemos enviado un email con las instrucciones' 
    });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ 
      resultado: false,
      msg: error.message || 'Hubo un error al solicitar el restablecimiento de password' 
    });
  }
};

/**
 * Verifica si un token de restablecimiento es válido
 */
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  
  try {
    // Verificar que el token exista
    const usuario = await usuarioService.buscarPorToken(token);
    
    if (!usuario) {
      throw generarError(404, 'NotFoundError', 'Token no válido');
    }
    
    // Token válido
    res.json({ 
      resultado: true,
      msg: 'Token válido' 
    });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ 
      resultado: false,
      msg: error.message || 'Hubo un error al comprobar el token' 
    });
  }
};

/**
 * Establece nueva contraseña usando token de restablecimiento
 */
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
    res.json({ 
      resultado: true,
      msg: 'Password actualizado correctamente' 
    });
    
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ 
      resultado: false,
      msg: error.message || 'Hubo un error al actualizar el password' 
    });
  }
};

/**
 * Devuelve la información del perfil del usuario autenticado
 */
const perfil = (req, res) => {
  try {
    const { usuario } = req;
    
    if (!usuario) {
      throw generarError(401, 'AuthError', 'No hay usuario autenticado');
    }
    
    res.json({
      resultado: true,
      usuario
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ 
      resultado: false,
      msg: error.message || 'Error al obtener el perfil' 
    });
  }
};

const cambiarRolAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin } = req.body;
    
    // Validar que el valor sea booleano
    if (typeof admin !== 'boolean') {
      throw generarError(400, 'ValidationError', 'El valor de admin debe ser true o false');
    }
    
    // Verificar que no se quite permisos a sí mismo
    if (req.usuario.id === id && admin === false) {
      throw generarError(400, 'ValidationError', 'No puedes quitarte permisos de administrador a ti mismo');
    }
    
    // Actualizar mediante el servicio
    await usuarioService.actualizar(id, { admin });
    
    res.json({
      resultado: true,
      msg: `Usuario ${admin ? 'promovido a' : 'removido de'} administrador`
    });
  } catch (error) {
    console.error('Error al cambiar rol de administrador:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al cambiar rol de administrador'
    });
  }
};


/**
 * Listar todos los usuarios (solo admin)
 */
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    
    res.json({
      resultado: true,
      usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener usuarios'
    });
  }
};

/**
 * Obtener un usuario por su ID
 */
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await usuarioService.buscarPorId(id);
    
    res.json({
      resultado: true,
      usuario
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(error.status || 500).json({
      resultado: false,
      msg: error.message || 'Error al obtener usuario'
    });
  }
};


export {
  registro,
  confirmar,
  login,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  listarUsuarios,
  obtenerUsuario,
  cambiarRolAdmin
};