import { useState, useEffect } from 'react';
import { clienteAxios } from "../../config/axios";
import Campo from "../../components/formulario/Campo";

export default function FormularioEvento({ evento = {} }) {
  const [categorias, setCategorias] = useState([]);
  const [dias, setDias] = useState([]);
  const [horas, setHoras] = useState([]);
  const [ponentes, setPonentes] = useState([]);
  const [ponentesFiltrados, setPonenteFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [ponenteSeleccionado, setPonenteSeleccionado] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(evento?.hora_id || null);
  
  // Campos controlados para evitar warnings con Campo
  const [nombre, setNombre] = useState(evento.nombre || '');
  const [descripcion, setDescripcion] = useState(evento.descripcion || '');
  const [disponibles, setDisponibles] = useState(evento.disponibles || '');
  
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [categoriasRes, diasRes, horasRes, ponentesRes] = await Promise.all([
          clienteAxios('/admin/categorias'),
          clienteAxios('/admin/dias'),
          clienteAxios('/admin/horas'),
          clienteAxios('/admin/ponentes')
        ]);
        
        setCategorias(categoriasRes.data);
        setDias(diasRes.data);
        setHoras(horasRes.data);
        setPonentes(ponentesRes.data);
        
        // Si estamos editando, buscar el ponente seleccionado
        if (evento?.ponente_id) {
          const ponente = ponentesRes.data.find(p => p.id === evento.ponente_id);
          setPonenteSeleccionado(ponente);
        }
        
        // Si estamos editando, marcar la hora seleccionada
        if (evento?.hora_id) {
          setHoraSeleccionada(evento.hora_id);
        }
        
      } catch (error) {
        console.error('Error al cargar datos del formulario:', error);
      }
    };
    
    obtenerDatos();
  }, [evento?.ponente_id, evento?.hora_id]);
  
  // Filtrar ponentes según búsqueda
  useEffect(() => {
    if (busqueda.length > 2) {
      const filtrados = ponentes.filter(ponente => 
        `${ponente.nombre} ${ponente.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
      );
      setPonenteFiltrados(filtrados);
    } else {
      setPonenteFiltrados([]);
    }
  }, [busqueda, ponentes]);
  
  const handleSeleccionarPonente = (ponente) => {
    setPonenteSeleccionado(ponente);
    setBusqueda('');
    setPonenteFiltrados([]);
  };
  
  const handleSeleccionarHora = (horaId) => {
    setHoraSeleccionada(horaId);
  };
  
  return (
    <>
      <fieldset className="formulario__fieldset">
        <legend className="formulario__legend">Información Evento</legend>

        <Campo 
          label="Nombre Evento"
          id="nombre"
          type="text"
          placeholder="Nombre Evento"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />

        {/* Textarea sin componente personalizado */}
        <div className="formulario__campo">
          <label htmlFor="descripcion" className="formulario__label">Descripción</label>
          <textarea
            className="formulario__input"
            id="descripcion"
            name="descripcion"
            placeholder="Descripción Evento"
            rows="8"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          ></textarea>
        </div>

        <div className="formulario__campo">
          <label htmlFor="categoria" className="formulario__label">Categoría o Tipo de Evento</label>
          <select
            className="formulario__select"
            id="categoria"
            name="categoria_id"
            defaultValue={evento.categoria_id || ''}
          >
            <option value="">- Seleccionar -</option>
            {categorias.map(categoria => (
              <option 
                key={categoria.id} 
                value={categoria.id}
              >
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>    

        <div className="formulario__campo">
          <label htmlFor="categoria" className="formulario__label">Selecciona el día</label>

          <div className="formulario__radio">
            {dias.map(dia => (
              <div key={dia.id}>
                <label htmlFor={dia.nombre.toLowerCase()}>{dia.nombre}</label>
                <input
                  type="radio"
                  id={dia.nombre.toLowerCase()}
                  name="dia"
                  value={dia.id}
                  defaultChecked={evento.dia_id === dia.id}
                  onChange={() => {
                    // Actualizar el input oculto
                    document.querySelector('input[name="dia_id"]').value = dia.id;
                  }}
                />
              </div>
            ))}
          </div>

          <input 
            type="hidden" 
            name="dia_id" 
            defaultValue={evento.dia_id || ''}
          />
        </div>

        <div id="horas" className="formulario__campo">
          <label className="formulario__label">Seleccionar Hora</label>

          <ul id="horas" className="horas">
            {horas.map(hora => (
              <li 
                key={hora.id}
                data-hora-id={hora.id}
                className={`horas__hora ${horaSeleccionada === hora.id 
                  ? 'horas__hora--seleccionada' 
                  : 'horas__hora--deshabilitada'}`}
                onClick={() => {
                  handleSeleccionarHora(hora.id);
                  // Actualizar el input oculto
                  document.querySelector('input[name="hora_id"]').value = hora.id;
                }}
              >
                {hora.hora}
              </li>
            ))}
          </ul>

          <input 
            type="hidden" 
            name="hora_id" 
            defaultValue={evento.hora_id || ''}
          />
        </div>
      </fieldset>

      <fieldset className="formulario__fieldset">
        <legend className="formulario__legend">Información Extra</legend>

        <div className="formulario__campo">
          <label htmlFor="ponentes" className="formulario__label">Ponente</label>
          <input
            type="text"
            className="formulario__input"
            id="ponentes"
            placeholder="Buscar Ponente"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <ul id="listado-ponentes" className="listado-ponentes">
            {ponentesFiltrados.map(ponente => (
              <li 
                key={ponente.id} 
                className="listado-ponentes__ponente"
                onClick={() => handleSeleccionarPonente(ponente)}
              >
                {ponente.nombre} {ponente.apellido}
              </li>
            ))}
          </ul>

          {ponenteSeleccionado && (
            <div className="formulario__campo">
              <p>Ponente seleccionado: {ponenteSeleccionado.nombre} {ponenteSeleccionado.apellido}</p>
            </div>
          )}

          <input 
            type="hidden" 
            name="ponente_id" 
            value={ponenteSeleccionado?.id || evento.ponente_id || ''}
          />
        </div>

        <Campo
          type="number"
          label="Lugares Disponibles"
          id="disponibles"
          placeholder="Ej. 20"
          min="1"
          value={disponibles}
          onChange={e => setDisponibles(e.target.value)}
        />
      </fieldset>
    </>
  );
}