import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-4 mb-6">Página no encontrada</h2>
        <p className="text-lg text-gray-600 mb-10">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link to="/">
          <Button variant="primary" size="large">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};