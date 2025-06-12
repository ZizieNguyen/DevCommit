import { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaTiktok, FaGithub } from 'react-icons/fa6';

export default function FormularioPonente({ponente = {}, setAlerta}) {
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: ponente?.nombre || '',
    apellido: ponente?.apellido || '',
    ciudad: ponente?.ciudad || '',
    pais: ponente?.pais || '',
    imagen: '',
    tags: '',
    redes: {
      facebook: ponente?.redes?.facebook || '',
      twitter: ponente?.redes?.twitter || '',
      youtube: ponente?.redes?.youtube || '',
      instagram: ponente?.redes?.instagram || '',
      tiktok: ponente?.redes?.tiktok || '',
      github: ponente?.redes?.github || ''
    }
  });
  
  // Cargar tags al inicio si existen
  useEffect(() => {
    if(ponente.tags) {
      const tagsArray = ponente.tags.split(',');
      setTags(tagsArray);
    }
  }, [ponente.tags]);
  
  // Actualizar el campo oculto de tags cuando cambia el array
  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      tags: tags.join(',')
    }));
  }, [tags]);
  
  const handleChange = e => {
    if(e.target.name.includes('redes')) {
      const redSocial = e.target.name.split('[')[1].split(']')[0];
      setFormData({
        ...formData,
        redes: {
          ...formData.redes,
          [redSocial]: e.target.value
        }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };
  
  const handleAgregarTag = () => {
    if(inputTag.trim() === '') return;
    
    // Evitar duplicados
    if(tags.includes(inputTag.trim())) {
      setAlerta({
        msg: 'El tag ya existe',
        tipo: 'error'
      });
      setTimeout(() => {
        setAlerta({});
      }, 3000);
      return;
    }
    
    setTags([...tags, inputTag.trim()]);
    setInputTag('');
  };
  
  const eliminarTag = tagAEliminar => {
    setTags(tags.filter(tag => tag !== tagAEliminar));
  };
  
  const handleImagenChange = e => {
    setFormData({
      ...formData,
      imagen: e.target.files[0]
    });
  };
  
  
  return (
    <>
      {/* Eliminamos el form y la alerta */}
      
      <fieldset className="formulario__fieldset">
        <legend className="formulario__legend">Información Personal</legend>

        <div className="formulario__campo">
          <label htmlFor="nombre" className="formulario__label">Nombre</label>
          <input
            type="text"
            className="formulario__input"
            id="nombre"
            name="nombre"
            placeholder="Nombre Ponente"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="formulario__campo">
          <label htmlFor="apellido" className="formulario__label">Apellido</label>
          <input
            type="text"
            className="formulario__input"
            id="apellido"
            name="apellido"
            placeholder="Apellido Ponente"
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>

        <div className="formulario__campo">
          <label htmlFor="ciudad" className="formulario__label">Ciudad</label>
          <input
            type="text"
            className="formulario__input"
            id="ciudad"
            name="ciudad"
            placeholder="Ciudad Ponente"
            value={formData.ciudad}
            onChange={handleChange}
          />
        </div>

        <div className="formulario__campo">
          <label htmlFor="pais" className="formulario__label">País</label>
          <input
            type="text"
            className="formulario__input"
            id="pais"
            name="pais"
            placeholder="País Ponente"
            value={formData.pais}
            onChange={handleChange}
          />
        </div>
        
        <div className="formulario__campo">
          <label htmlFor="imagen" className="formulario__label">Imagen</label>
          <input
            type="file"
            className="formulario__input formulario__input--file"
            id="imagen"
            name="imagen"
            onChange={handleImagenChange}
          />
        </div>

        {ponente.imagen && (
          <>
            <p className="formulario__texto">Imagen Actual:</p>
            <div className="formulario__imagen">
              <picture>
                <source srcSet={`/img/speakers/${ponente.imagen}.webp`} type="image/webp" />
                <source srcSet={`/img/speakers/${ponente.imagen}.png`} type="image/png" />
                <img src={`/img/speakers/${ponente.imagen}.png`} alt="Imagen Ponente" />
              </picture>
            </div>
          </>
        )}
      </fieldset>

      <fieldset className="formulario__fieldset">
        <legend className="formulario__legend">Información Extra</legend>

        <div className="formulario__campo">
          <label htmlFor="tags_input" className="formulario__label">Áreas de Experiencia (separadas por coma)</label>
          <div className="formulario__tag-container">
            <input
              type="text"
              className="formulario__input"
              id="tags_input"
              placeholder="Ej. Node.js, PHP, CSS, Laravel, UX / UI"
              value={inputTag}
              onChange={e => setInputTag(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAgregarTag())}
            />
            <button
              type="button"
              className="formulario__btn-tag"
              onClick={handleAgregarTag}
            >
              Agregar
            </button>
          </div>

          <div id="tags" className="formulario__listado">
            {tags.map((tag, index) => (
              <div key={index} className="formulario__tag">
                {tag}
                <button
                  type="button"
                  className="formulario__btn-eliminar"
                  onClick={() => eliminarTag(tag)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <input 
            type="hidden" 
            name="tags" 
            value={formData.tags}
          />
        </div>
      </fieldset>

      <fieldset className="formulario__fieldset">
        <legend className="formulario__legend">Redes Sociales</legend>

        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <FaFacebookF />
            </div>
            <input
              type="text"
              className="formulario__input--sociales"
              name="redes[facebook]"
              placeholder="Facebook"
              value={formData.redes.facebook}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <FaTwitter />
            </div>
            <input
              type="text"
              className="formulario__input--sociales"
              name="redes[twitter]"
              placeholder="Twitter"
              value={formData.redes.twitter}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <FaYoutube />
            </div>
            <input
              type="text"
              className="formulario__input--sociales"
              name="redes[youtube]"
              placeholder="YouTube"
              value={formData.redes.youtube}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <FaInstagram />
            </div>
            <input
              type="text"
              className="formulario__input--sociales"
              name="redes[instagram]"
              placeholder="Instagram"
              value={formData.redes.instagram}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <FaTiktok />
            </div>
            <input
              type="text"
              className="formulario__input--sociales"
              name="redes[tiktok]"
              placeholder="Tiktok"
              value={formData.redes.tiktok}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="formulario__campo">
          <div className="formulario__contenedor-icono">
            <div className="formulario__icono">
              <FaGithub />
            </div>
            <input
              type="text"
              className="formulario__input--sociales"
              name="redes[github]"
              placeholder="GitHub"
              value={formData.redes.github}
              onChange={handleChange}
            />
          </div>
        </div>
      </fieldset>
      
      
    </>
  );
}