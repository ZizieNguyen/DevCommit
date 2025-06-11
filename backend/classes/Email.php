<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email {

    public $email;
    public $nombre;
    public $token;
    
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
     
        // Remitente y destinatario
        $mail->setFrom($_ENV['SMTP_EMAIL'], 'DevCommit'); // Usar tu email como remitente
        $mail->addAddress($this->email, $this->nombre);
        $mail->Subject = 'Confirma tu Cuenta';

        // Formato HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        // URL de confirmación
        $urlConfirmacion = $_ENV['HOST'] . "/confirmar/" . $this->token;
        
        $contenido = '<html>';
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has Registrado Correctamente tu cuenta en DevCommit; pero es necesario confirmarla</p>";
        $contenido .= "<p>Presiona aquí: <a href='" . $urlConfirmacion . "'>Confirmar Cuenta</a>";       
        $contenido .= "<p>Si tu no creaste esta cuenta; puedes ignorar el mensaje</p>";
        $contenido .= '</html>';
        $mail->Body = $contenido;

        // Enviar el mail y capturar resultado
        try {
            $resultado = $mail->send();
            if(!$resultado) {
                error_log("Error al enviar email: " . $mail->ErrorInfo);
            }
            return $resultado;
        } catch (\Exception $e) {
            error_log("Excepción enviando email: " . $e->getMessage());
            return false;
        }
    }

    public function enviarInstrucciones() {
        // Misma estructura simplificada que el método anterior
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];
        $mail->SMTPSecure = 'tls';
    
        $mail->setFrom($_ENV['SMTP_EMAIL'], 'DevCommit');
        $mail->addAddress($this->email, $this->nombre);
        $mail->Subject = 'Reestablece tu password';

        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        $urlRecuperar = $_ENV['HOST'] . "/reestablecer-password/" . $this->token;
        
        $contenido = '<html>';
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has solicitado reestablecer tu password, sigue el siguiente enlace para hacerlo.</p>";
        $contenido .= "<p>Presiona aquí: <a href='" . $urlRecuperar . "'>Reestablecer Password</a>";        
        $contenido .= "<p>Si tu no solicitaste este cambio, puedes ignorar el mensaje</p>";
        $contenido .= '</html>';
        $mail->Body = $contenido;

        try {
            $resultado = $mail->send();
            if(!$resultado) {
                error_log("Error al enviar email: " . $mail->ErrorInfo);
            }
            return $resultado;
        } catch (\Exception $e) {
            error_log("Excepción enviando email: " . $e->getMessage());
            return false;
        }
    }
}