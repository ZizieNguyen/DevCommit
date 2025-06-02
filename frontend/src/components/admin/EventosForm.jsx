import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { formatISO } from 'date-fns';
import { Alerta } from '../ui/Alerta';

export default function EventosForm({ evento = {}, editando = false }) {
  const navigate = useNavigate();
  
  // Reemplazamos los contextos por datos locales
  const [categorias] = useState([
    { id: '1', nombre: 'Frontend' },
    { id: '2', nombre: 'Backend' },
    { id: '3', nombre: 'UX/UI' },
    { id: '4', nombre: 'DevOps' },
    { id: '5', nombre: 'Mobile' }
  ]);
  
  const [ponentes] = useState([
    { id: '1', nombre: 'Juan', apellido: 'Pérez' },
    { id: '2', nombre: 'Ana', apellido: 'García' },
    { id: '3', nombre: 'Carlos', apellido: 'Rodríguez' },
    { id: '4', nombre: 'Sofía', apellido: 'Martínez' }
  ]);
  
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [ponenteId, setPonenteId] = useState('');
  const [lugar, setLugar] = useState('');
  const [disponibles, setDisponibles] = useState(50);
  const [precio, setPrecio] = useState(0);
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [online, setOnline] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (editando && Object.keys(evento).length > 0) {
      setId(evento.id);
      setNombre(evento.nombre || '');
      setDescripcion(evento.descripcion || '');
      setFecha(evento.fecha ? evento.fecha.split('T')[0] : '');
      setHora(evento.hora || '');
      setCategoriaId(evento.categoriaId || '');
      setPonenteId(evento.ponenteId || '');
      setLugar(evento.lugar || '');
      setDisponibles(evento.disponibles || 50);
      setPrecio(evento.precio || 0);
      setOnline(evento.online || false);
      if (evento.imagen) {
        setImagenPreview(`/img/eventos/${evento.imagen}`);
      }
    }
  }, [evento, editando]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación
    if ([nombre, descripcion, fecha, hora, categoriaId].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      window.scrollTo(0, 0);
      return;
    }
    
    // Validar que si es presencial tenga lugar y si es online no tenga lugar
    if (!online && lugar === '') {
      setAlerta({
        msg: 'Si el evento es presencial debe tener un lugar',
        error: true
      });
      window.scrollTo(0, 0);
      return;
    }
    
    if (online && lugar !== '') {
      setLugar('');
    }
    
    try {
      setCargando(true);
      setAlerta({});
      
      // Crear FormData para envío con imagen
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('fecha', fecha);
      formData.append('hora', hora);
      formData.append('categoriaId', categoriaId);
      if (ponenteId) formData.append('ponenteId', ponenteId);
      if (!online && lugar) formData.append('lugar', lugar);
      formData.append('disponibles', disponibles);
      formData.append('precio', precio);
      formData.append('online', online);
      
      if (imagen) {
        formData.append('imagen', imagen);
      }

      // Usando fetch en lugar de clienteAxios
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      const endpoint = editando ? `/eventos/${id}` : '/eventos';
      const method = editando ? 'PUT' : 'POST';
      
      const token = localStorage.getItem('AUTH_TOKEN') || '';
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al guardar el evento');
      }
      
      
      setAlerta({
        msg: editando ? 'Evento actualizado correctamente' : 'Evento creado correctamente',
        error: false
      });
      
      // Esperar un momento y redireccionar
      setTimeout(() => {
        navigate('/admin/eventos');
      }, 3000);
      
    } catch (error) {
      console.error(error);
      setAlerta({
        msg: error.message || 'Hubo un error al procesar la solicitud',
        error: true
      });
    } finally {
      setCargando(false);
      window.scrollTo(0, 0);
    }
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const { msg } = alerta;

  return (
    <form 
      className="bg-white shadow-lg rounded-xl p-8 md:p-10 max-w-4xl mx-auto"
      onSubmit={handleSubmit}
      noValidate
    >
      {msg && <Alerta alerta={alerta} />}
      
      <div className="mb-10 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-black text-gray-800">
          {editando ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </h2>
        <p className="text-gray-600 mt-2">
          Completa el formulario para {editando ? 'actualizar el' : 'crear un nuevo'} evento
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Información básica */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Información Básica</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label 
                htmlFor="nombre"
                className="block text-gray-700 font-bold mb-2"
              >
                Nombre del Evento <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                id="nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Ej. Workshop de React"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            
            {/* Categoría */}
            <div>
              <label 
                htmlFor="categoria"
                className="block text-gray-700 font-bold mb-2"
              >
                Categoría <span className="text-red-500">*</span>
              </label>
              <select 
                id="categoria"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-all"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
              >
                <option value="">-- Selecciona Categoría --</option>
                {categorias?.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Descripción */}
            <div className="md:col-span-2">
              <label 
                htmlFor="descripcion"
                className="block text-gray-700 font-bold mb-2"
              >
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="descripcion"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Describe el evento, temática, aprendizajes, etc."
                rows="5"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Fecha y Hora */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Fecha y Hora</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha */}
            <div>
              <label 
                htmlFor="fecha"
                className="block text-gray-700 font-bold mb-2"
              >
                Fecha <span className="text-red-500">*</span>
              </label>
              <input 
                type="date"
                id="fecha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                min={formatISO(new Date(), { representation: 'date' })}
              />
            </div>
            
            {/* Hora */}
            <div>
              <label 
                htmlFor="hora"
                className="block text-gray-700 font-bold mb-2"
              >
                Hora <span className="text-red-500">*</span>
              </label>
              <input 
                type="time"
                id="hora"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Modalidad y Ubicación */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Modalidad</h3>
          
          {/* Modalidad */}
          <div className="mb-6">
            <p className="block text-gray-700 font-bold mb-3">Tipo de Evento:</p>
            
            <div className="flex items-center space-x-6">
              <label className="flex items-center cursor-pointer">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${!online ? 'border-primary bg-primary' : 'border-gray-400'}`}>
                  {!online && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                <input 
                  type="radio" 
                  name="modalidad" 
                  checked={!online}
                  onChange={() => setOnline(false)}
                  className="sr-only"
                />
                <span className="ml-2 text-gray-700">Presencial</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${online ? 'border-primary bg-primary' : 'border-gray-400'}`}>
                  {online && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                <input 
                  type="radio" 
                  name="modalidad" 
                  checked={online}
                  onChange={() => setOnline(true)}
                  className="sr-only"
                />
                <span className="ml-2 text-gray-700">En línea</span>
              </label>
            </div>
          </div>
          
          {/* Lugar (solo si es presencial) */}
          {!online && (
            <div>
              <label 
                htmlFor="lugar"
                className="block text-gray-700 font-bold mb-2"
              >
                Lugar <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                id="lugar"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Ej. Centro de Convenciones"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
              />
            </div>
          )}
        </div>
        
        {/* Ponente y Disponibilidad */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Detalles Adicionales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ponente */}
            <div>
              <label 
                htmlFor="ponente"
                className="block text-gray-700 font-bold mb-2"
              >
                Ponente
              </label>
              <select 
                id="ponente"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-all"
                value={ponenteId}
                onChange={(e) => setPonenteId(e.target.value)}
              >
                <option value="">-- Selecciona Ponente --</option>
                {ponentes?.map(ponente => (
                  <option key={ponente.id} value={ponente.id}>
                    {ponente.nombre} {ponente.apellido}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Disponibles */}
            <div>
              <label 
                htmlFor="disponibles"
                className="block text-gray-700 font-bold mb-2"
              >
                Cupos Disponibles
              </label>
              <input 
                type="number"
                id="disponibles"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                min="0"
                value={disponibles}
                onChange={(e) => setDisponibles(e.target.value)}
              />
            </div>
            
            {/* Precio */}
            <div>
              <label 
                htmlFor="precio"
                className="block text-gray-700 font-bold mb-2"
              >
                Precio (€)
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input 
                  type="number"
                  id="precio"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  min="0"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Imagen */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Imagen del Evento</h3>
          
          <div className="flex flex-col items-center space-y-4">
            {imagenPreview ? (
              <div className="relative">
                <img 
                  src={imagenPreview} 
                  alt="Preview" 
                  className="max-w-xs max-h-64 object-cover rounded-lg shadow-md border border-gray-200"
                />
                <button 
                  type="button"
                  onClick={() => {
                    setImagen(null);
                    setImagenPreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                   onClick={() => document.getElementById('imagen').click()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Haz clic para seleccionar una imagen</p>
                <p className="text-xs text-gray-500 mt-1">Formatos permitidos: JPG, PNG. Máximo 2MB</p>
              </div>
            )}
            
            <input
              type="file"
              id="imagen"
              accept="image/*"
              onChange={handleImagen}
              className="hidden"
            />
            
            {!imagenPreview && (
              <button 
                type="button"
                onClick={() => document.getElementById('imagen').click()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
              >
                Seleccionar Imagen
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/admin/eventos')}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          disabled={cargando}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center min-w-[140px]"
          disabled={cargando}
        >
          {cargando ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            `${editando ? 'Actualizar' : 'Crear'} Evento`
          )}
        </button>
      </div>
    </form>
  );
}