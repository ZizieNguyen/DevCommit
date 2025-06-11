import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-blanco font-black text-6xl">
            DevCommit <span className="text-secondary">2025</span>
          </h2>
          <p className="text-blanco text-3xl mt-2">
            Barcelona, España - 5 y 6 de Octubre
          </p>
          <div className="mt-8">
            <Link 
              to="/registro" 
              className="bg-secondary text-blanco py-3 px-8 rounded-lg hover:bg-secondary-dark transition-colors font-bold uppercase"
            >
              Comprar Pase
            </Link>
          </div>
        </div>
      </section>

      {/* Acerca De */}
      <section className="container mx-auto mt-20 px-5 md:px-0">
        <h2 className="text-4xl font-black text-center">
          DevCommit es una conferencia para desarrolladores de todos los niveles
        </h2>
        <p className="text-xl text-center mt-5 max-w-3xl mx-auto">
          En DevCommit, nos reunimos para compartir conocimiento, experiencias y conectar con otros desarrolladores. Una oportunidad única para crecer profesionalmente.
        </p>
      </section>

      {/* Estadísticas */}
      <section className="container mx-auto mt-20 px-5 md:px-0">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center">
            <p className="text-6xl font-black text-primary">+18</p>
            <p className="text-2xl font-bold text-gray-500">Ponentes</p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-black text-primary">+30</p>
            <p className="text-2xl font-bold text-gray-500">Conferencias</p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-black text-primary">+500</p>
            <p className="text-2xl font-bold text-gray-500">Asistentes</p>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className="py-20 mt-20 bg-gray-100">
        <div className="container mx-auto px-5 md:px-0">
          <h2 className="text-4xl font-black text-center">Ponentes de Primer Nivel</h2>
          <p className="text-xl text-center mt-5 max-w-3xl mx-auto">
            Conoce a nuestros expertos que compartirán conocimiento y experiencia
          </p>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Estas tarjetas serían dinámicas, pero aquí pongo un ejemplo */}
            {[1, 2, 3, 4].map(index => (
              <div key={index} className="bg-blanco rounded-lg shadow-md overflow-hidden">
                <img 
                  className="w-full h-64 object-cover object-center" 
                  src={`/img/speaker_${index}.jpg`} 
                  alt="Ponente DevCommit" 
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold">Ponente Destacado</h3>
                  <p className="text-gray-600">Especialista en React, Node.js</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link 
              to="/ponentes" 
              className="inline-block bg-primary text-blanco py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors font-bold uppercase"
            >
              Ver Todos
            </Link>
          </div>
        </div>
      </section>

      {/* Schedule/Agenda */}
      <section className="container mx-auto mt-20 px-5 md:px-0">
        <h2 className="text-4xl font-black text-center">Agenda de Eventos</h2>
        <p className="text-xl text-center mt-5 max-w-3xl mx-auto">
          Explora nuestras conferencias y talleres
        </p>

        <div className="mt-10 space-y-8">
          <div className="bg-blanco shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-primary p-4">
              <h3 className="text-xl font-bold text-blanco">5 de Octubre - Día 1</h3>
            </div>
            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="border-b pb-5">
                  <p className="font-bold">10:00 - Apertura del Evento</p>
                  <p className="text-gray-600">Bienvenida y presentación inicial</p>
                </div>
                <div className="border-b pb-5">
                  <p className="font-bold">11:00 - React en 2025</p>
                  <p className="text-gray-600">Lo nuevo del framework más popular</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blanco shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-primary p-4">
              <h3 className="text-xl font-bold text-blanco">6 de Octubre - Día 2</h3>
            </div>
            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="border-b pb-5">
                  <p className="font-bold">10:00 - Node.js avanzado</p>
                  <p className="text-gray-600">Optimizando backend con Node</p>
                </div>
                <div className="border-b pb-5">
                  <p className="font-bold">12:00 - El futuro de la IA</p>
                  <p className="text-gray-600">Cómo la IA está transformando el desarrollo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link 
            to="/conferencias" 
            className="inline-block bg-primary text-blanco py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors font-bold uppercase"
          >
            Ver Completo
          </Link>
        </div>
      </section>

      {/* Paquetes */}
      <section className="py-20 mt-20 bg-gray-100">
        <div className="container mx-auto px-5 md:px-0">
          <h2 className="text-4xl font-black text-center">Paquetes DevCommit</h2>
          <p className="text-xl text-center mt-5 max-w-3xl mx-auto">
            Elige el pase que mejor se adapte a tus necesidades
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <div className="bg-blanco rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-center">Pase Día</h3>
                <p className="text-center text-4xl font-black my-5">199€</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Acceso 1 día</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Comida y café</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Acceso conferencias</li>
                </ul>
              </div>
            </div>

            <div className="bg-blanco rounded-lg shadow-md overflow-hidden border-4 border-primary transform md:-translate-y-4">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-center">Pase DevCommit</h3>
                <p className="text-center text-4xl font-black my-5">349€</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Acceso 2 días</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Comida y café</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Acceso a todas las conferencias</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Acceso a talleres</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Kit de DevCommit</li>
                </ul>
              </div>
            </div>

            <div className="bg-blanco rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-center">Pase Virtual</h3>
                <p className="text-center text-4xl font-black my-5">99€</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Acceso virtual</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Acceso conferencias</li>
                  <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Chat en vivo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary py-16 mt-20">
        <div className="container mx-auto text-center px-5 md:px-0">
          <h2 className="text-4xl font-black text-blanco">¡No te pierdas DevCommit 2025!</h2>
          <p className="text-xl text-blanco mt-3">La conferencia de desarrollo más esperada del año</p>
          <div className="mt-8">
            <Link 
              to="/registro" 
              className="bg-secondary text-blanco py-3 px-8 rounded-lg hover:bg-secondary-dark transition-colors font-bold uppercase"
            >
              Comprar Pase
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}