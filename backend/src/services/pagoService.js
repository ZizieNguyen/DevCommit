import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../constants.js';
import { generarError } from '../utils/helpers.js';

// Cliente Stripe (con manejo para desarrollo sin API key)
const stripeClient = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const pagoService = {
  /**
   * Procesa un pago directo con tarjeta
   */
  async procesarPagoTarjeta(datos) {
    try {
      const { token, monto, descripcion, moneda = 'eur', metadata = {} } = datos;
      
      if (!token) {
        throw generarError(400, 'ValidationError', 'Token de pago no proporcionado');
      }
      
      if (!monto || isNaN(parseFloat(monto))) {
        throw generarError(400, 'ValidationError', 'Monto inválido');
      }
      
      // Modo simulación si no hay API key
      if (!stripeClient) {
        console.log('Modo simulación: Procesando pago con tarjeta simulado');
        return {
          id: `sim_${Date.now()}`,
          status: true,
          last4: '4242'
        };
      }
      
      // Procesar pago real con Stripe
      const charge = await stripeClient.charges.create({
        amount: Math.round(monto * 100), // Stripe usa céntimos
        currency: moneda,
        source: token,
        description: descripcion,
        metadata
      });
      
      // Respuesta mejorada incluyendo más datos para facilitar seguimiento
      return {
        id: charge.id,
        status: charge.status === 'succeeded',
        last4: charge.payment_method_details?.card?.last4 || '0000',
        brand: charge.payment_method_details?.card?.brand || 'unknown',
        monto: charge.amount / 100,
        moneda: charge.currency,
        fecha: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al procesar pago con tarjeta:', error);
      
      // Manejar errores específicos de Stripe
      if (error.type === 'StripeCardError') {
        throw generarError(400, 'PaymentError', error.message);
      }
      
      if (error.code) throw error;
      throw generarError(500, 'PaymentError', 'Error al procesar el pago con tarjeta');
    }
  },
  
  /**
   * Crea un reembolso para un pago existente
   */
  async crearReembolso(datos) {
    try {
      const { chargeId, motivo = 'requested_by_customer', montoReembolso = null } = datos;
      
      if (!chargeId) {
        throw generarError(400, 'ValidationError', 'ID de cargo no proporcionado');
      }
      
      // Modo simulación si no hay API key
      if (!stripeClient) {
        console.log('Modo simulación: Creando reembolso simulado');
        return {
          id: `re_${Date.now()}`,
          charge: chargeId,
          status: 'succeeded',
          amount: montoReembolso ? montoReembolso * 100 : 0,
          currency: 'eur',
          fecha: new Date().toISOString()
        };
      }
      
      // Configurar parámetros de reembolso
      const refundParams = {
        charge: chargeId,
        reason: motivo
      };
      
      // Si se especifica un monto parcial
      if (montoReembolso !== null) {
        refundParams.amount = Math.round(montoReembolso * 100); // Convertir a céntimos
      }
      
      // Crear reembolso real con Stripe
      const refund = await stripeClient.refunds.create(refundParams);
      
      return {
        id: refund.id,
        charge: refund.charge,
        status: refund.status,
        amount: refund.amount / 100,
        currency: refund.currency,
        fecha: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al crear reembolso:', error);
      
      // Manejar errores específicos de Stripe
      if (error.type === 'StripeCardError') {
        throw generarError(400, 'PaymentError', error.message);
      }
      
      if (error.code) throw error;
      throw generarError(500, 'PaymentError', 'Error al procesar el reembolso');
    }
  }
};

export default pagoService;