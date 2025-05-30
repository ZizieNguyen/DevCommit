// src/utils/validations.js
import * as yup from 'yup';

// Validaciones para autenticación
export const auth = {
    registro: yup.object({
        nombre: yup.string().required('El nombre es obligatorio'),
        apellido: yup.string().required('El apellido es obligatorio'),
        email: yup.string().email('Email no válido').required('El email es obligatorio'),
        password: yup.string()
            .min(6, 'El password debe tener al menos 6 caracteres')
            .required('El password es obligatorio')
    }),
    
    login: yup.object({
        email: yup.string().email('Email no válido').required('El email es obligatorio'),
        password: yup.string().required('El password es obligatorio')
    }),
    
    olvidePassword: yup.object({
        email: yup.string().email('Email no válido').required('El email es obligatorio')
    }),
    
    nuevaPassword: yup.object({
        password: yup.string()
            .min(6, 'El password debe tener al menos 6 caracteres')
            .required('El password es obligatorio')
    })
};

// Validaciones para ponentes
export const ponentes = {
    crear: yup.object({
        nombre: yup.string().required('El nombre es obligatorio'),
        apellido: yup.string().required('El apellido es obligatorio'),
        ciudad: yup.string(),
        pais: yup.string(),
        tags: yup.string(),
        imagen: yup.mixed() // La validación de la imagen se hace en el middleware de upload
    }),
    
    actualizar: yup.object({
        nombre: yup.string(),
        apellido: yup.string(),
        ciudad: yup.string(),
        pais: yup.string(),
        tags: yup.string(),
        imagen: yup.mixed()
    })
};

// Validaciones para eventos (actualizado para el nuevo esquema)
export const eventos = {
    crear: yup.object({
        nombre: yup.string().required('El nombre es obligatorio'),
        descripcion: yup.string().nullable(),
        disponibles: yup.number()
            .integer('Los lugares disponibles deben ser un número entero')
            .min(1, 'Debe haber al menos 1 lugar disponible')
            .required('Los lugares disponibles son obligatorios'),
        categoria_id: yup.string().required('La categoría es obligatoria'),
        horario_id: yup.string().required('El horario es obligatorio'),
        ponente_id: yup.string().required('El ponente es obligatorio')
    }),
    
    actualizar: yup.object({
        nombre: yup.string(),
        descripcion: yup.string().nullable(),
        disponibles: yup.number()
            .integer('Los lugares disponibles deben ser un número entero')
            .min(1, 'Debe haber al menos 1 lugar disponible'),
        categoria_id: yup.string(),
        horario_id: yup.string(),
        ponente_id: yup.string()
    })
};

// Validaciones para catálogos (nuevo)
export const catalogos = {
    crear: yup.object({
        tipo: yup.string()
            .oneOf(['categoria', 'paquete', 'regalo'], 'Tipo no válido')
            .required('El tipo es obligatorio'),
        nombre: yup.string().required('El nombre es obligatorio'),
        descripcion: yup.string().nullable()
    }),
    
    actualizar: yup.object({
        nombre: yup.string(),
        descripcion: yup.string().nullable()
    })
};

// Validaciones para horarios (nuevo)
export const horarios = {
    crear: yup.object({
        dia: yup.string()
            .oneOf(['Viernes', 'Sábado', 'Domingo'], 'Día no válido')
            .required('El día es obligatorio'),
        hora: yup.string()
            .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)')
            .required('La hora es obligatoria'),
        disponible: yup.boolean().default(true)
    }),
    
    actualizar: yup.object({
        dia: yup.string()
            .oneOf(['Viernes', 'Sábado', 'Domingo'], 'Día no válido'),
        hora: yup.string()
            .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
        disponible: yup.boolean()
    })
};

// Validaciones para registros (nuevo)
export const registros = {
    crear: yup.object({
        paquete_id: yup.string().required('El paquete es obligatorio'),
        usuario_id: yup.string().required('El usuario es obligatorio'),
        regalo_id: yup.string().nullable(),
        eventos_ids: yup.array().of(yup.string()).min(1, 'Debe seleccionar al menos un evento')
    }),
    
    actualizarPago: yup.object({
        pago_id: yup.string().required('El ID de pago es obligatorio')
    })
};


export const pagos = {
  paypal: yup.object({
    paquete_id: yup.string().required('El paquete es obligatorio'),
    pago_id: yup.string().required('El ID de pago es obligatorio'),
    regalo_id: yup.string().nullable()
  }),
  
  tarjeta: yup.object({
    paquete_id: yup.string().required('El paquete es obligatorio'),
    token: yup.string().required('El token de la tarjeta es obligatorio'),
    regalo_id: yup.string().nullable()
  })
};