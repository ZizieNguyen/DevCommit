// src/utils/email.js
import nodemailer from 'nodemailer';
import { 
  EMAIL_HOST, 
  EMAIL_PORT, 
  EMAIL_USER, 
  EMAIL_PASS,
  SMTP_EMAIL,
  FRONTEND_URL 
} from '../constants.js';

// Configurar el transporte de nodemailer
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Función para enviar email
const enviarEmail = async (datos) => {
  const { email, nombre, token, tipo } = datos;

  console.log('=============================================');
  console.log(`TOKEN PARA ${tipo.toUpperCase()}:`, token);
  console.log(`URL: ${FRONTEND_URL}/${tipo === 'confirmar' ? 'confirmar' : 'olvide-password'}/${token}`);
  console.log('Correo destino:', email);
  console.log('=============================================');


   try {
    // Configurar contenido según tipo
    let subject, text, html;

    if (tipo === 'confirmar') {
      subject = "DevCommit - Confirma tu cuenta";
      text = "Confirma tu cuenta en DevCommit";
      html = `
        <p>Hola ${nombre}, confirma tu cuenta en DevCommit.</p>
        <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>
        <a href="${FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
      `;
    } else if (tipo === 'olvide-password') {
      subject = "DevCommit - Restablece tu Password";
      text = "Restablece tu Password en DevCommit";
      html = `
        <p>Hola ${nombre}, has solicitado restablecer tu password en DevCommit.</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:</p>
        <a href="${FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>
        <p>Si tú no solicitaste este cambio, puedes ignorar este mensaje.</p>
      `;
    }

    // Enviar email
    const info = await transporter.sendMail({
      from: `"DevCommit" ${SMTP_EMAIL}`,
      to: email,
      subject,
      text,
      html
    });

    console.log("Mensaje enviado: %s", info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
};

export { enviarEmail };