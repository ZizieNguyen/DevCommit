import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Alerta } from '../ui/Alerta';

export default function PonentesForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    ciudad: '',
    pais: '',
    imagen: null,
    tags: '',
    biografia: '',
    redes: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      github: ''
    }
  });

  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenActual, setImagenActual] = useState('');
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState({});

  useEffect(() => {
    if (esEdicion) {
      const cargarPonente = async () => {
        try {
          setCargando(true);
          const ponente = await api.get(`/ponentes/${id}`);
          
          // Extraer los datos del ponente
          const { nombre, apellido, ciudad, pais, imagen, tags, biografia, redes } = ponente;
          
          setFormData({
            nombre,
            apellido,
            ciudad,
            pais,
            imagen: null, // No cargamos la imagen como File
            tags: tags || '',
            biografia: biografia || '',
            redes: {
              facebook: redes?.facebook || '',
              twitter: redes?.twitter || '',
              instagram: redes?.instagram || '',
              youtube: redes?.youtube || '',
              tiktok: redes?.tiktok || '',
              github: redes?.github || ''
            }
          });
          
          if (imagen) {
            setImagenActual(imagen);
          }
        } catch (error) {
          console.error(error);
          setAlerta({
            tipo: 'error',
            mensaje: 'Error al cargar los datos del ponente'
          });
        } finally {
          setCargando(false);
        }
      };
      
      cargarPonente();
    }
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Manejar campos anidados (redes sociales)
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
    
    setFormData({
      ...formData,
      imagen: file
    });
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagenPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setCargando(true);
      
      // Crear FormData para enviar la imagen
      const formDataObj = new FormData();
      
      // Agregar campos básicos
      formDataObj.append('nombre', formData.nombre);
      formDataObj.append('apellido', formData.apellido);
      formDataObj.append('ciudad', formData.ciudad);
      formDataObj.append('pais', formData.pais);
      formDataObj.append('tags', formData.tags);
      formDataObj.append('biografia', formData.biografia);
      
      // Agregar redes sociales
      Object.entries(formData.redes).forEach(([key, value]) => {
        if (value) formDataObj.append(`redes[${key}]`, value);
      });
      
      // Agregar imagen solo si se ha seleccionado una nueva
      if (formData.imagen) {
        formDataObj.append('imagen', formData.imagen);
      }
      
      if (esEdicion) {
        await api.put(`/ponentes/${id}`, formDataObj);
        setAlerta({
          tipo: 'success',
          mensaje: 'Ponente actualizado correctamente'
        });
      } else {
        await api.post('/ponentes', formDataObj);
        setAlerta({
          tipo: 'success',
          mensaje: 'Ponente creado correctamente'
        });
      }
      
      // Redireccionar después de un tiempo
      setTimeout(() => {
        navigate('/admin/ponentes');
      }, 3000);
    } catch (error) {
      console.error(error);
      setAlerta({
        tipo: 'error',
        mensaje: error.message || 'Hubo un error al guardar el ponente'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {esEdicion ? 'Editar Ponente' : 'Nuevo Ponente'}
      </h2>
      
      {alerta.mensaje && (
        <Alerta 
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Información Personal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.ciudad}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <input
                type="text"
                id="pais"
                name="pais"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.pais}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>
            
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                {imagenPreview ? (
                  <img 
                    src={imagenPreview} 
                    alt="Preview" 
                    className="h-32 w-32 object-cover rounded-full"
                  />
                ) : imagenActual ? (
                  <img 
                    src={`/img/speakers/${imagenActual}`} 
                    alt="Imagen actual" 
                    className="h-32 w-32 object-cover rounded-full"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="imagen"
                  name="imagen"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary-dark"
                />
                <p className="mt-2 text-xs text-gray-500">
                  {esEdicion ? "Deja vacío para mantener la imagen actual" : "PNG, JPG, GIF hasta 2MB"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Áreas de experiencia (separadas por coma)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Ej: JavaScript, React, Node.js"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separa cada área de experiencia con comas
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <textarea
              id="biografia"
              name="biografia"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.biografia}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Redes Sociales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="red_facebook" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                id="red_facebook"
                name="red_facebook"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.redes.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/tu-usuario"
              />
            </div>
            
            <div>
              <label htmlFor="red_twitter" className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="url"
                id="red_twitter"
                name="red_twitter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.redes.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/tu-usuario"
              />
            </div>
            
            <div>
              <label htmlFor="red_instagram" className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                id="red_instagram"
                name="red_instagram"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.redes.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/tu-usuario"
              />
            </div>
            
            <div>
              <label htmlFor="red_github" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub
              </label>
              <input
                type="url"
                id="red_github"
                name="red_github"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.redes.github}
                onChange={handleChange}
                placeholder="https://github.com/tu-usuario"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/ponentes')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={cargando}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            disabled={cargando}
          >
            {cargando ? 'Guardando...' : esEdicion ? 'Actualizar Ponente' : 'Crear Ponente'}
          </button>
        </div>
      </form>
    </div>
  );
}