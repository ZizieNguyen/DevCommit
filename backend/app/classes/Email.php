<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email {
    protected $email;
    protected $nombre;
    protected $token;

    public function __construct($email, $nombre, $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function enviarConfirmacion() {
        // Crear nuevo objeto
        $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = $_ENV['EMAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Port = $_ENV['EMAIL_PORT'];
    $mail->Username = $_ENV['EMAIL_USER'];
    $mail->Password = $_ENV['EMAIL_PASS'];
    $mail->SMTPSecure = 'tls';

    // Configuración adicional para depuración
    $mail->SMTPDebug = 0; // Cambiar a 2 para ver todos los mensajes de error
    $mail->Debugoutput = 'error_log';

    // MODIFICACIÓN: Usar SMTP_EMAIL como remitente si está definido
    $remitente = $_ENV['SMTP_EMAIL'] ?? $_ENV['EMAIL_USER'];
    $mail->setFrom($remitente, 'DevCommit');
    
    $mail->addAddress($this->email, $this->nombre);
    $mail->Subject = 'Confirma tu cuenta DevCommit';

    // Formato HTML
    $mail->isHTML(TRUE);
    $mail->CharSet = 'UTF-8';

    // Contenido del correo
    $contenido = '<html>';
    $contenido .= "<p><strong>Hola " . $this->nombre . "</strong></p>";
    $contenido .= "<p>Gracias por registrarte en DevCommit</p>";
    $contenido .= '<p>Para confirmar tu cuenta haz click en el siguiente enlace:</p>';
    $contenido .= "<p><a href='" . $_ENV['HOST'] . "/confirmar/" . $this->token . "'>Confirmar mi cuenta</a></p>";
    $contenido .= "<p>Si no has sido tú, ignora este mensaje</p>";
    $contenido .= '</html>';
    $mail->Body = $contenido;

        // Enviar el mail y capturar resultado
        try {
        error_log("Intentando enviar email de confirmación a: {$this->email} desde: {$remitente}");
        $resultado = $mail->send();
        if(!$resultado) {
            error_log("Error al enviar email: " . $mail->ErrorInfo);
        } else {
            error_log("Email de confirmación enviado exitosamente");
        }
        return $resultado;
    } catch (\Exception $e) {
        error_log("Excepción enviando email: " . $e->getMessage());
        return false;
    }
    }

    public function enviarInstrucciones() {
        // Configurar PHPMailer con más depuración
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];
        $mail->SMTPSecure = 'tls';
        
        // Debug para diagnóstico
        $mail->SMTPDebug = 0;
        $mail->Debugoutput = 'error_log';
    
        $remitente = $_ENV['SMTP_EMAIL'] ?? $_ENV['EMAIL_USER']; 
        $mail->setFrom($remitente, 'DevCommit');
        $mail->addAddress($this->email, $this->nombre);
        $mail->Subject = 'Reestablece tu password';

        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $urlRecuperar = $_ENV['HOST'] . "/reestablecer/" . $this->token;
        
        $contenido = '<html>';
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong></p>";
        $contenido .= "<p>Has solicitado reestablecer tu password</p>";
        $contenido .= '<p>Para reestablecer tu password haz click en el siguiente enlace:</p>';
        $contenido .= "<p><a href='" . $urlRecuperar . "'>Reestablecer Password</a></p>";
        $contenido .= "<p>Si no has sido tú, ignora este mensaje</p>";
        $contenido .= '</html>';
        $mail->Body = $contenido;

        try {
            $resultado = $mail->send();
            if(!$resultado) {
                error_log("Error al enviar email de reestablecimiento: " . $mail->ErrorInfo);
            }
            return $resultado;
        } catch (\Exception $e) {
            error_log("Excepción enviando email de reestablecimiento: " . $e->getMessage());
            return false;
        }
    }

    public function enviarConfirmacionCompra($asunto, $mensaje) {
    // Crear nuevo objeto
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = $_ENV['EMAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Port = $_ENV['EMAIL_PORT'];
    $mail->Username = $_ENV['EMAIL_USER'];
    $mail->Password = $_ENV['EMAIL_PASS'];
    $mail->SMTPSecure = 'tls';

    // Configuración igual a las otras funciones que sí funcionan
    $mail->SMTPDebug = 0; // Sin debug en producción
    $mail->Debugoutput = 'error_log'; // Salida estándar como las otras funciones

    // Remitente y destinatario
    $remitente = $_ENV['SMTP_EMAIL'] ?? $_ENV['EMAIL_USER'];
    $mail->setFrom($remitente, 'DevCommit');
    $mail->addAddress($this->email, $this->nombre);
    $mail->Subject = $asunto;

    // Formato HTML
    $mail->isHTML(TRUE);
    $mail->CharSet = 'UTF-8';
    
    // Contenido del correo
    $contenido = '<html>';
    $contenido .= "<p><strong>Hola " . $this->nombre . "</strong></p>";
    $contenido .= $mensaje;
    $contenido .= "<p>Te esperamos en DevCommit.</p>";
    $contenido .= "<p>Si tienes alguna duda, puedes contactarnos respondiendo a este correo.</p>";
    $contenido .= '</html>';
    $mail->Body = $contenido;

    // Enviar el mail - mismo patrón que las otras funciones
    try {
        error_log("Intentando enviar correo a: {$this->email}");
        $resultado = $mail->send();
        if(!$resultado) {
            error_log("Error al enviar email de confirmación de compra: " . $mail->ErrorInfo);
        } else {
            error_log("Correo enviado exitosamente a {$this->email}");
        }
        return $resultado;
    } catch (\Exception $e) {
        error_log("Excepción enviando email de confirmación de compra: " . $e->getMessage());
        return false;
    }
}
}