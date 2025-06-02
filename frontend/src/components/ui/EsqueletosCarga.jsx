import React from 'react';

// Esqueleto para tarjetas de evento
export const EventoCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-36 bg-gray-300 rounded"></div>
        </div>
        <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-4 w-full bg-gray-300 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-6 w-16 bg-gray-300 rounded"></div>
          <div className="h-8 w-28 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

// Esqueleto para detalles de evento
export const EventoDetailSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-300"></div>
      <div className="p-6 space-y-6">
        <div className="h-8 w-3/4 bg-gray-300 rounded mb-4"></div>
        <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="h-6 w-36 bg-gray-300 rounded"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg space-y-3">
            <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
            <div className="h-4 w-3/5 bg-gray-300 rounded"></div>
            <div className="h-10 w-full bg-gray-300 rounded-lg mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Esqueleto para tarjetas de ponente
export const PonenteCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-300"></div>
      <div className="p-6 space-y-4 text-center">
        <div className="h-6 w-3/4 bg-gray-300 rounded mx-auto"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto"></div>
        <div className="h-10 w-full bg-gray-300 rounded-lg mt-4"></div>
      </div>
    </div>
  );
};