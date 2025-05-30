import pagoService from '../services/pagoService.js';
import registroService from '../services/registroService.js';
import { generarError } from '../utils/helpers.js';
import { STRIPE_PUBLISHABLE_KEY } from '../constants.js';

/**
 * Controlador para pagos
 */
const pagoController = {
  /**
   * Procesa un pago directo con tarjeta
   */
  async procesarPagoTarjeta(req, res) {
    try {
      console.log('=== INICIO PROCESAMIENTO DE PAGO ===');
      console.log('Datos recibidos:', req.body);
      
      // Recibir eventos_ids del frontend
      const { token, paquete_id, regalo_id, eventos_ids = [] } = req.body;
      const usuario_id = req.usuario.id;
      
      // Validar datos
      if (!token || !paquete_id) {
        throw generarError(400, 'ValidationError', 'Datos de pago incompletos');
      }
      
      // Obtener información del paquete
      const paquete = await registroService.obtenerPaquete(paquete_id);
      
      if (!paquete) {
        throw generarError(404, 'NotFoundError', 'Paquete no encontrado');
      }
      
      // Procesar el pago con tarjeta
      const resultado = await pagoService.procesarPagoTarjeta({
        token,
        monto: paquete.precio,
        descripcion: `DevCommit - Paquete ${paquete.nombre}`,
        metadata: {
          usuario_id,
          paquete_id,
          regalo_id: regalo_id || '',
          eventos_ids: JSON.stringify(eventos_ids)
        }
      });
      
      // Mejorar la validación del pago
      if (!resultado.status) {
        throw generarError(400, 'PaymentError', `El pago no fue exitoso: ${resultado.id}`);
      }
      
      // Crear registro del usuario en el evento con todos los campos necesarios
      const registro = await registroService.crear({
        paquete_id,
        usuario_id,
        regalo_id,
        pago_id: resultado.id,
        metodo_pago: 'stripe',
        pagado: true, // Actualizar estado a pagado
        monto: paquete.precio, // Guardar el monto
        moneda: 'eur',
        eventos_ids: eventos_ids,
        datos_tarjeta: { // Guardar información no sensible de la tarjeta
          last4: resultado.last4,
          brand: resultado.brand
        }
      });
      
      console.log('Respuesta enviada:', { success: true, registro });
      console.log('=== FIN PROCESAMIENTO DE PAGO ===');
      
      // Respuesta mejorada con más información
      res.status(201).json({
        resultado: true,
        registro: {
          id: registro.id,
          pago_id: resultado.id,
          paquete: paquete.nombre,
          monto: paquete.precio,
          moneda: 'eur',
          metodo_pago: 'stripe',
          tarjeta: `**** **** **** ${resultado.last4}`
        },
        msg: 'Pago procesado correctamente'
      });
    } catch (error) {
      console.error('Error al procesar pago con tarjeta:', error);
      res.status(error.status || 500).json({
        resultado: false,
        msg: error.message || 'Error al procesar el pago'
      });
    }
  },
  
  /**
   * Crea un reembolso
   */
  async crearReembolso(req, res) {
    try {
      const { registro_id } = req.params;
      const { motivo, monto_reembolso } = req.body;
      
      // Validar datos
      if (!registro_id) {
        throw generarError(400, 'ValidationError', 'ID de registro no proporcionado');
      }
      
      // Obtener información del registro
      const registro = await registroService.obtenerPorId(registro_id);
      
      if (!registro) {
        throw generarError(404, 'NotFoundError', 'Registro no encontrado');
      }
      
      // Validar que el registro esté pagado y no reembolsado
      if (!registro.pagado) {
        throw generarError(400, 'ValidationError', 'El registro no ha sido pagado');
      }
      
      if (registro.reembolsado) {
        throw generarError(400, 'ValidationError', 'Este registro ya fue reembolsado');
      }
      
      // Procesar reembolso
      const reembolso = await pagoService.crearReembolso({
        chargeId: registro.pago_id,
        motivo,
        montoReembolso: monto_reembolso || registro.monto // Usar el monto completo si no se especifica
      });
      
      // Actualizar el registro
      await registroService.actualizar(registro_id, {
        reembolsado: true,
        reembolso_id: reembolso.id,
        pagado: monto_reembolso && monto_reembolso < registro.monto ? true : false // Mantener pagado si es reembolso parcial
      });
      
      res.json({
        resultado: true,
        reembolso: {
          id: reembolso.id,
          registro_id,
          estado: reembolso.status,
          monto: reembolso.amount,
          moneda: reembolso.currency,
          fecha: reembolso.fecha
        },
        msg: 'Reembolso procesado correctamente'
      });
    } catch (error) {
      console.error('Error al crear reembolso:', error);
      res.status(error.status || 500).json({
        resultado: false,
        msg: error.message || 'Error al procesar el reembolso'
      });
    }
  },
  
  /**
   * Obtiene la configuración de pagos para el frontend
   */
  async obtenerConfiguracion(req, res) {
    try {
      res.json({
        resultado: true,
        configuracion: {
          stripe_key: STRIPE_PUBLISHABLE_KEY,
          moneda: 'eur',
          moneda_simbolo: '€'
        }
      });
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      res.status(500).json({
        resultado: false, 
        msg: 'Error al obtener configuración de pagos'
      });
    }
  }
};

export default pagoController;