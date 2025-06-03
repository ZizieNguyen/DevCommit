import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Spinner } from '../ui/Spinner';

const EventoForm = ({ evento, onSubmit, cargando }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: '',
    dia_id: '',
    hora_id: '',
    ponente_id: '',
    disponible: true
  });
  
  const [categorias, setCategorias] = useState([]);
  const [dias, setDias] = useState([]);
  const [horas, setHoras] = useState([]);
  const [ponentes, setPonentes] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  // Cargar datos necesarios para el formulario (categorías, días, horas, ponentes)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [categoriasResp, diasResp, horasResp, ponentesResp] = await Promise.all([
          api.get('/admin/categorias'),
          api.get('/admin/dias'),
          api.get('/admin/horas'),
          api.get('/admin/ponentes')
        ]);
        
        setCategorias(categoriasResp.categorias || categoriasResp);
        setDias(diasResp.dias || diasResp);
        setHoras(horasResp.horas || horasResp);
        setPonentes(ponentesResp.ponentes || ponentesResp);
      } catch (error) {
        console.error('Error al cargar datos para el formulario:', error);
      } finally {
        setCargandoDatos(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Cargar datos para edición si existe un evento
  useEffect(() => {
    if (evento) {
      setFormData({
        nombre: evento.nombre || '',
        descripcion: evento.descripcion || '',
        categoria_id: evento.categoria_id || '',
        dia_id: evento.dia_id || '',
        hora_id: evento.hora_id || '',
        ponente_id: evento.ponente_id || '',
        disponible: evento.disponible !== undefined ? evento.disponible : true
      });
    }
  }, [evento]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (cargandoDatos) {
    return (
      <div className="centrar-spinner">
        <Spinner />
        <p>Cargando datos del formulario...</p>
      </div>
    );
  }

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <div className="formulario__campo">
        <label htmlFor="nombre" className="formulario__label">Nombre Evento</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          className="formulario__input"
          placeholder="Nombre del Evento"
          value={formData.nombre}
          onChange={handleChange}
          disabled={cargando}
          required
        />
      </div>

      <div className="formulario__campo">
        <label htmlFor="descripcion" className="formulario__label">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          className="formulario__input"
          placeholder="Descripción del Evento"
          value={formData.descripcion}
          onChange={handleChange}
          disabled={cargando}
          required
          rows="5"
        ></textarea>
      </div>

      <div className="formulario__campo">
        <label htmlFor="categoria_id" className="formulario__label">Categoría</label>
        <select
          id="categoria_id"
          name="categoria_id"
          className="formulario__select"
          value={formData.categoria_id}
          onChange={handleChange}
          disabled={cargando}
          required
        >
          <option value="">- Seleccionar -</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="formulario__campo">
        <label htmlFor="dia_id" className="formulario__label">Día</label>
        <select
          id="dia_id"
          name="dia_id"
          className="formulario__select"
          value={formData.dia_id}
          onChange={handleChange}
          disabled={cargando}
          required
        >
          <option value="">- Seleccionar -</option>
          {dias.map(dia => (
            <option key={dia.id} value={dia.id}>
              {dia.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="formulario__campo">
        <label htmlFor="hora_id" className="formulario__label">Hora</label>
        <select
          id="hora_id"
          name="hora_id"
          className="formulario__select"
          value={formData.hora_id}
          onChange={handleChange}
          disabled={cargando}
          required
        >
          <option value="">- Seleccionar -</option>
          {horas.map(hora => (
            <option key={hora.id} value={hora.id}>
              {hora.hora}
            </option>
          ))}
        </select>
      </div>

      <div className="formulario__campo">
        <label htmlFor="ponente_id" className="formulario__label">Ponente</label>
        <select
          id="ponente_id"
          name="ponente_id"
          className="formulario__select"
          value={formData.ponente_id}
          onChange={handleChange}
          disabled={cargando}
          required
        >
          <option value="">- Seleccionar -</option>
          {ponentes.map(ponente => (
            <option key={ponente.id} value={ponente.id}>
              {ponente.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="formulario__campo formulario__campo--checkbox">
        <label htmlFor="disponible" className="formulario__label--checkbox">
          <input
            type="checkbox"
            id="disponible"
            name="disponible"
            className="formulario__checkbox"
            checked={formData.disponible}
            onChange={handleChange}
            disabled={cargando}
          />
          Evento disponible para registro
        </label>
      </div>

      <div className="formulario__campo">
        <button 
          type="submit" 
          disabled={cargando}
          className={`formulario__submit ${cargando ? 'formulario__submit--deshabilitado' : ''}`}
        >
          {cargando ? (
            <div className="formulario__spinner">
              <Spinner /> {evento ? "Actualizando..." : "Creando..."}
            </div>
          ) : (
            evento ? "Actualizar Evento" : "Crear Evento"
          )}
        </button>
      </div>

      <div className="acciones">
        <Link to="/admin/eventos" className="acciones__enlace">
          Volver
        </Link>
      </div>
    </form>
  );
};

export default EventoForm;