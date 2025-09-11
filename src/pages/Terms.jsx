import { Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function Terms() {
  return (
    <div>
      <Header />
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Política de Uso</h1>
          <p className="text-lg text-gray-600">
            Términos y condiciones para el uso de Otra Málaga
          </p>
        </div>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2>1. Sobre el Proyecto</h2>
            <p>
              Otra Málaga es un proyecto colectivo que busca visibilizar y mapear iniciativas 
              sociales, culturales y comunitarias en Málaga. Nos regimos por principios 
              feministas, anticapitalistas y de justicia social.
            </p>
          </section>

          <section className="mb-8">
            <h2>2. Licencia F2F</h2>
            <p>
              Este proyecto está bajo la Licencia de producción de pares feministas (F2F), 
              que permite:
            </p>
            <ul>
              <li>Compartir la obra (copiarla, distribuirla, ejecutarla)</li>
              <li>Hacer obras derivadas</li>
            </ul>
            <p>Bajo las siguientes condiciones:</p>
            <ul>
              <li>Atribución: Reconocer los créditos de la manera especificada</li>
              <li>Compartir igual: Las obras derivadas deben distribuirse bajo la misma licencia</li>
              <li>
                Uso no capitalista: La explotación comercial solo está permitida a cooperativas, 
                organizaciones y colectivas sin fines de lucro que se identifiquen con principios 
                feministas
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>3. Normas de la Comunidad</h2>
            <ul>
              <li>Respeto mutuo y lenguaje inclusivo</li>
              <li>No se permite contenido discriminatorio o de odio</li>
              <li>Las contribuciones deben alinearse con los principios del proyecto</li>
              <li>Compromiso con la veracidad de la información compartida</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>4. Privacidad y Datos</h2>
            <p>
              Respetamos tu privacidad y solo recolectamos los datos necesarios para el 
              funcionamiento de la plataforma. No compartimos información con terceros ni 
              usamos datos con fines comerciales.
            </p>
          </section>

          <section className="mb-8">
            <h2>5. Contribuciones</h2>
            <p>
              Las contribuciones a la plataforma deben:
            </p>
            <ul>
              <li>Respetar los derechos de autor y la propiedad intelectual</li>
              <li>Ser verificables y estar documentadas</li>
              <li>Alinearse con los principios feministas y anticapitalistas</li>
              <li>Contribuir al bien común de la ciudad</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>6. Moderación</h2>
            <p>
              Nos reservamos el derecho de moderar o eliminar contenido que:
            </p>
            <ul>
              <li>Promueva el odio o la discriminación</li>
              <li>Contenga información falsa o engañosa</li>
              <li>Viole los principios del proyecto</li>
              <li>Tenga fines comerciales no alineados con nuestros valores</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>7. Contacto</h2>
            <p>
              Para cualquier duda sobre estos términos o para reportar contenido inadecuado, 
              puedes contactarnos a través de nuestro{' '}
              <Link to="/Contact" className="text-primary hover:underline">
                formulario de contacto
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
} 