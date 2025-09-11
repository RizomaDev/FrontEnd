import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import heroWelcome from "../../assets/heroWelcome.jpg";
import Verdiales from "../../assets/Verdiales.jpg";
import ButtonMap from "../../components/Buttons/ButtonMap";
import MapInteractive from "../../components/MapInteractive/MapInteractive";

export default function LandingPage() {
  const navigate = useNavigate();



  return (
    <>
      <Header />
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
              `url(${heroWelcome})`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content justify-start w-full">
          <div className="max-w-md text-left">
            <h1 className="mb-5 text-5xl font-bold">
              ¿Quieres crear marcadores y contribuir al mapa colaborativo?
            </h1>
          </div>
        </div>
      </div>

      <div className="hero bg-base-200 py-16">
        <div className="hero-content flex-col lg:flex-row items-center">
          <img
            src={Verdiales}
            className="max-w-sm rounded-lg shadow-2xl"
            alt="Imagen temporal"
          />
          <div className="lg:ml-8 flex flex-col items-start">
            <h1 className="text-5xl font-bold text-secondary">
              ¡Bienvenida a Otra Málaga!
            </h1>
            <p className="py-6">
              Otra Málaga es un mapa colaborativo donde puedes descubrir, documentar y compartir marcadores ciudadanos, espacios colectivos y prácticas sociales transformadoras. Explora el territorio desde una mirada comunitaria y participa subiendo tus propias propuestas. Cada marcador representa una propuesta viva: un centro cultural autogestionado, una red de cuidados, un huerto urbano, una biblioteca feminista, un grupo de consumo responsable o cualquier otra expresión de comunidad y resistencia cotidiana.
            </p>
            <ButtonMap />
          </div>
        </div>
      </div>

      <div className="text-left py-8 max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-primary mb-4">
          ¿Cómo funciona el mapa?
        </h2>
        <p className="text-xl text-neutral mb-8">
          Cada marcador en el mapa representa una iniciativa ciudadana. Haz clic para ver más información, filtra por categoría o barrio, y contribuye sumando nuevos marcadores. ¡Construyamos juntas una ciudad más justa, inclusiva y descentralizada!
        </p>
        <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
          <MapInteractive showHeader={false} showFilters={false} height="100%" isPreview={true} />
        </div>
      </div>
     
      <div className="flex justify-center gap-4 my-8"></div>
      <div className="flex justify-center gap-4 my-8">
        <div className="hero bg-base-200 py-8 px-4 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
          <div className="hero-content flex-col">
            <h2 className="text-4xl font-bold text-primary mb-4">
              ¿Quieres explorar más marcadores?
            </h2>
            <p className="text-lg text-neutral mb-6">
              Regístrate ahora y accede a todos los marcadores compartidos por la comunidad.
              <br />
              ¿Ya tienes cuenta? ¡Inicia sesión!
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/register")}
              >
                Registrarse
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
