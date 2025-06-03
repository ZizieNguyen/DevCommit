
import { Link } from 'react-router-dom';
import SpeakerForm from '../../components/admin/SpeakerForm';

export default function AdminNewSpeakerPage() {
  return (
    <>
      <h2 className="dashboard__heading">Registrar Ponente</h2>

      <div className="dashboard__contenedor-boton">
        <Link to="/admin/ponentes" className="dashboard__boton dashboard__boton--negro">
          <i className="fa-solid fa-arrow-left"></i>
          Volver
        </Link>
      </div>

      <div className="dashboard__formulario">
        <SpeakerForm />
      </div>
    </>
  );
}