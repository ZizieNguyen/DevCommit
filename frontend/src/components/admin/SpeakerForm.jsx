import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Alerta } from '../ui/Alerta';
import { validarURL, validarCamposObligatorios } from '../../utils/validaciones';
import { mostrarNotificacion } from '../../utils/dom';

export default function PonentesForm({ ponente = {}, edicion = false }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: ponente.nombre || '',
    apellido: ponente.apellido || '',
    ciudad: ponente.ciudad || '',
    pais: ponente.pais || '',
    imagen: null,
    tags: ponente.tags || '',
    redes: {
      facebook: ponente.redes?.facebook || '',
      twitter: ponente.redes?.twitter || '',
      youtube: ponente.redes?.youtube || '',
      instagram: ponente.redes?.instagram || '',
      tiktok: ponente.redes?.tiktok || '',
      github: ponente.redes?.github || '',
    }
  });

  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(ponente.imagen ? `/img/speakers/${ponente.imagen}` : '');
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('red_')) {
      const redNombre = name.replace('red_', '');
      setFormData({
        ...formData,
        redes: {
          ...formData.redes,
          [redNombre]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    setImagen(file);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImagenPreview(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos obligatorios usando nuestra utilidad
    if (!validarCamposObligatorios([
      formData.nombre.trim(), 
      formData.apellido.trim(), 
      formData.ciudad.trim(), 
      formData.pais.trim()
    ])) {
      setAlerta({
        tipo: 'error',
        mensaje: 'Nombre, apellido, ciudad y país son obligatorios'
      });
      return;
    }
    
    // Validar URLs de redes sociales usando nuestra utilidad
    const redesInvalidas = Object.entries(formData.redes)
      .filter(([, valor]) => valor && !validarURL(valor))
      .map(([red]) => red);
    
    if (redesInvalidas.length > 0) {
      setAlerta({
        tipo: 'error',
        mensaje: `Las siguientes redes sociales tienen URLs inválidas: ${redesInvalidas.join(', ')}`
      });
      return;
    }
    
    try {
      setCargando(true);
      
      // Crear FormData para enviar la imagen
      const datos = new FormData();
      datos.append('nombre', formData.nombre.trim());
      datos.append('apellido', formData.apellido.trim());
      datos.append('ciudad', formData.ciudad.trim());
      datos.append('pais', formData.pais.trim());
      datos.append('tags', formData.tags);
      
      // Añadir redes sociales
      for (const [red, valor] of Object.entries(formData.redes)) {
        if (valor) datos.append(`redes[${red}]`, valor);
      }
      
      // Añadir imagen solo si existe una nueva
      if (imagen) {
        datos.append('imagen', imagen);
      }
      
      // Realizar petición según sea edición o creación
      if (edicion) {
        await api.put(`/ponentes/${ponente.id}`, datos);
        setAlerta({
          tipo: 'exito',
          mensaje: 'Ponente actualizado correctamente'
        });
        // Mostrar notificación usando nuestra utilidad
        mostrarNotificacion('Ponente actualizado correctamente', 'success');
      } else {
        await api.post('/ponentes', datos);
        setAlerta({
          tipo: 'exito',
          mensaje: 'Ponente registrado correctamente'
        });
        // Mostrar notificación usando nuestra utilidad
        mostrarNotificacion('Ponente registrado correctamente', 'success');
      }
      
      // Esperar antes de redirigir
      setTimeout(() => {
        navigate('/admin/ponentes');
      }, 3000);
      
    } catch (error) {
      console.error(error);
      const mensajeError = error.response?.data?.mensaje || 'Hubo un error, intenta de nuevo';
      
      setAlerta({
        tipo: 'error',
        mensaje: mensajeError
      });
      
      // Mostrar notificación de error usando nuestra utilidad
      mostrarNotificacion(mensajeError, 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form 
      className="formulario"
      onSubmit={handleSubmit}
    >
      {alerta.mensaje && (
        <Alerta
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
        />
      )}
      
      <fieldset className="formulario__fieldset">
        <legend className="formulario__legend">Información Personal</legend>
        
        <div className="formulario__grid">
          <div className="formulario__campo">
            <label htmlFor="nombre" className="formulario__label">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="formulario__input"
              placeholder="Nombre del Ponente"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          
          <div className="formulario__campo">
            <label htmlFor="apellido" className="formulario__label">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              className="formulario__input"
              placeholder="Apellido del Ponente"
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>
          
          <div className="formulario__campo">
            <label htmlFor="ciudad" className="formulario__label">Ciudad</label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              className="formulario__input"
              placeholder="Ciudad del Ponente"
              value={formData.ciudad}
              onChange={handleChange}
            />
          </div>
          
          <div className="formulario__campo">
            <label htmlFor="pais" className="formulario__label">País</label>
            <input
              type="text"
              id="pais"
              name="pais"
              className="formulario__input"
              placeholder="País del Ponente"
              value={formData.pais}
              onChange={handleChange}
            />
          </div>
          
          <div className="formulario__campo">
            <label htmlFor="imagen" className="formulario__label">Imagen</label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              className="formulario__input formulario__input--file"
              accept="image/*"
              onChange={handleImagenChange}
            />
            {formData.imagen && (
              <p className="formulario__texto">{formData.imagen}</p>
            )}
          </div>
          
          <div className="formulario__campo">
            <label htmlFor="tags" className="formulario__label">Áreas de Especialidad (separadas por coma)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="formulario__input"
              placeholder="Ej: Node.js, JavaScript, React, PHP"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {imagenPreview && (
          <div className="formulario__contenedor-imagen">
            <img 
              src={imagenPreview} 
              alt="Preview" 
              className="formulario__imagen"
            />
          </div>
        )}
      </fieldset>
      
      <fieldset className="formulario__fieldset">
        <legend className="formulario__legend">Redes Sociales</legend>
        
        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <i className="fa-brands fa-facebook"></i>
            </div>
            <input
              type="url"
              name="red_facebook"
              className="formulario__input--sociales"
              placeholder="URL de Facebook"
              value={formData.redes.facebook}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <i className="fa-brands fa-twitter"></i>
            </div>
            <input
              type="url"
              name="red_twitter"
              className="formulario__input--sociales"
              placeholder="URL de Twitter"
              value={formData.redes.twitter}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <i className="fa-brands fa-youtube"></i>
            </div>
            <input
              type="url"
              name="red_youtube"
              className="formulario__input--sociales"
              placeholder="URL de YouTube"
              value={formData.redes.youtube}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <i className="fa-brands fa-instagram"></i>
            </div>
            <input
              type="url"
              name="red_instagram"
              className="formulario__input--sociales"
              placeholder="URL de Instagram"
              value={formData.redes.instagram}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <i className="fa-brands fa-tiktok"></i>
            </div>
            <input
              type="url"
              name="red_tiktok"
              className="formulario__input--sociales"
              placeholder="URL de TikTok"
              value={formData.redes.tiktok}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <i className="fa-brands fa-github"></i>
            </div>
            <input
              type="url"
              name="red_github"
              className="formulario__input--sociales"
              placeholder="URL de GitHub"
              value={formData.redes.github}
              onChange={handleChange}
            />
          </div>
        </div>
      </fieldset>
      
      <input
        type="submit"
        value={edicion ? "Actualizar Ponente" : "Registrar Ponente"}
        className="formulario__submit"
        disabled={cargando}
      />
    </form>
  );
}