import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/inicio.css'; // Usaremos los estilos existentes
import '../styles/paquetes.css';

export default function Paquetes() {
  return (
    <main className="paquetes">
      <h2 className="paquetes__heading">Paquetes DevCommit</h2>
      <p className="paquetes__descripcion">Compara los paquetes de DevCommit</p>

      <div className="boletos__grid">
        <div className="boleto boleto--gratis">
          <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
          <p className="boleto__plan">Gratis</p>
          <ul className="paquete__lista">
            <li className="paquete__elemento">Acceso Virtual a DevCommit</li>
          </ul>
          <p className="boleto__precio">€0</p>
          <div className="boleto__enlace-contenedor">
            <Link to="/registro" className="boleto__enlace">
              Registro Gratuito
            </Link>
          </div>
        </div>

        <div className="boleto boleto--presencial">
          <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
          <p className="boleto__plan">Presencial</p>
          <ul className="paquete__lista">
            <li className="paquete__elemento">Acceso Presencial a DevCommit</li>
            <li className="paquete__elemento">Pase por 2 días</li>
            <li className="paquete__elemento">Acceso a talleres y conferencias</li>
            <li className="paquete__elemento">Acceso a las grabaciones</li>
            <li className="paquete__elemento">Camisa del Evento</li>
            <li className="paquete__elemento">Comida y Bebida</li>
          </ul>
          <p className="boleto__precio">€99</p>
          <div className="boleto__enlace-contenedor">
            <Link to="/registro" className="boleto__enlace">
              Comprar Pase
            </Link>
          </div>
        </div>

        <div className="boleto boleto--virtual">
          <h4 className="boleto__logo">&#60;DevCommit/&#62;</h4>
          <p className="boleto__plan">Virtual</p>
          <ul className="paquete__lista">
            <li className="paquete__elemento">Acceso Virtual a DevCommit</li>
            <li className="paquete__elemento">Pase por 2 días</li>
            <li className="paquete__elemento">Acceso a talleres y conferencias</li>
            <li className="paquete__elemento">Acceso a las grabaciones</li>
          </ul>
          <p className="boleto__precio">€49</p>
          <div className="boleto__enlace-contenedor">
            <Link to="/registro" className="boleto__enlace">
              Comprar Pase
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}