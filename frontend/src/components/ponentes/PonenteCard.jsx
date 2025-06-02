import React from 'react';
import { Link } from 'react-router-dom';

export const PonenteCard = ({ ponente }) => {
  const { id, nombre, apellido, imagen, tags } = ponente;

  return (
    <div className="ponente bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
      <img 
        src={imagen || '/img/speaker_default.jpg'} 
        alt={`Imagen ponente ${nombre} ${apellido}`}
        className="w-full object-cover h-64" 
      />
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1">
          {nombre} {apellido}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags?.map((tag, index) => (
            <span 
              key={index} 
              className="bg-primary bg-opacity-10 text-primary text-xs py-1 px-2 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link 
          to={`/ponentes/${id}`} 
          className="block w-full text-center bg-primary text-white py-2 font-bold uppercase rounded hover:bg-primary-dark transition-colors"
        >
          Conocer Más
        </Link>
      </div>
    </div>
  );
};

export default PonenteCard;