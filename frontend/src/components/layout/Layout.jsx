
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  useEffect(() => {
    // Cargar fuentes
    if (!document.querySelector('link[href*="Outfit"]')) {
      const linkFont = document.createElement('link');
      linkFont.rel = 'stylesheet';
      linkFont.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&display=swap';
      document.head.appendChild(linkFont);
    }
    
    // Scroll al inicio al cambiar de página
    window.scrollTo(0, 0);
    
    // Título predeterminado
    document.title = 'DevCommit - Conferencias y Workshops para Desarrolladores';
  }, []);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}