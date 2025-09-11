import React from 'react';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';

export default function Contact() {
  return (
    <div>
      <Header />
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Contacto</h1>
          <p className="text-lg text-gray-600 mb-8">
            ¿Quieres colaborar o tienes alguna pregunta? Escríbenos.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@otramalaga.org" className="text-lg hover:text-primary transition-colors">
                info@otramalaga.org
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-lg">
                Málaga, España
              </span>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Sobre colaboraciones</h2>
            <p className="text-gray-600">
              Buscamos colaboraciones con colectivos y organizaciones que compartan nuestros valores 
              de justicia social y transformación urbana. Si tienes una propuesta, escríbenos 
              a nuestro correo.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Tiempo de respuesta</h2>
            <p className="text-gray-600">
              Intentamos responder a todos los mensajes en un plazo de 48-72 horas.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
} 