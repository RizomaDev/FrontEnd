import Header from "../../components/Header/Header";
import imageTemporal from "../../assets/imageTemporal.png";
import Footer from "../../components/Footer/Footer";
import Cards from "../../components/Cards/Cards";
import Buttons from "../../components/Buttons/Buttons";
import React, { useEffect, useState } from "react";
import { getAllBookmarks } from "../../service/apiService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import heroWelcome from "../../assets/heroWelcome.jpg";
import Verdiales from "../../assets/Verdiales.jpg";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getAllBookmarks();
        const sortedBookmarks = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setBookmarks(sortedBookmarks.slice(0, 6));
      } catch (error) {
      }
    };
    fetchBookmarks();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

 
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = bookmarks.slice(indexOfFirstCard, indexOfLastCard);


  const handleNextPage = () => {
    if (currentPage < Math.ceil(bookmarks.length / cardsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
              Encuentra tu siguiente marcador y únete a la comunidad
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
          </div>
        </div>
      </div>

      <div className="text-left py-8 max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-primary mb-4">
          ¿Cómo funciona el mapa?
        </h2>
        <p className="text-xl text-neutral">
          Cada marcador en el mapa representa una iniciativa ciudadana. Haz clic para ver más información, filtra por categoría o barrio, y contribuye sumando nuevos marcadores. ¡Construyamos juntas una ciudad más justa, inclusiva y descentralizada!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto py-8 px-4 [filter:sepia(40%)]">
        {currentCards.map((bookmark) => (
          <Cards
            key={bookmark.id}
            id={bookmark.id}
            title={bookmark.title}
            category={bookmark.category}
            tag={bookmark.tag}
            address={bookmark.address}
            img={
              Array.isArray(bookmark.imageUrls) && bookmark.imageUrls.length > 0
                ? bookmark.imageUrls[0]
                : imageTemporal
            }
          />
        ))}
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
