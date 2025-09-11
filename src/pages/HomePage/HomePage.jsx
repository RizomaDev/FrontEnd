import { useEffect, useState } from "react";
import { getAllBookmarks, getCategories, getTags } from "../../service/apiService";
import Cards from "../../components/Cards/Cards";
import Buttons from "../../components/Buttons/Buttons";
import FilterCategoryTag from "../../components/FilterCategoryTag";
import imageTemporal from "../../assets/imageTemporal.png";
import { getImageUrl } from '../../utils/imageUtils';
import Verdiales from "../../assets/Verdiales.jpg";
import heroWelcome from "../../assets/heroWelcome.jpg";
import MapInteractive from "../../components/MapInteractive/MapInteractive";

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tagsForFilter, setTagsForFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const bookmarksData = await getAllBookmarks();
        setBookmarks(bookmarksData);
        const categoriesResponse = await getCategories();
        const sortedCategories = categoriesResponse.map((category) => ({
          id: category.id,
          name: category.name
        })).sort((a, b) => a.name.localeCompare(b.name));
        setCategoriesData(sortedCategories);
        const tagsResponse = await getTags();
        setTagsForFilter(tagsResponse.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {}
    };
    fetchAllData();
  }, []);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const bookmarkTag = bookmark.tag;
    const bookmarkCategoryName = bookmark.category;
    const matchesCategory = selectedCategory === "" || bookmarkCategoryName === selectedCategory;
    const matchesTag = selectedTag === "" || bookmarkTag === selectedTag;
    return matchesCategory && matchesTag;
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredBookmarks.slice(indexOfFirstCard, indexOfLastCard);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredBookmarks.length / cardsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url(${heroWelcome})` }}    
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
              ¡Bienvenide a Otra Málaga!
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
        <div className="w-full h-[500px] mt-8 rounded-lg overflow-hidden shadow-lg">
          <MapInteractive showHeader={false} showFilters={false} height="100%" isPreview={true} />
        </div>
      </div>

      <div className="text-left py-8 max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-primary mb-4">
          Busca tu siguiente marcador
        </h2>
        <p className="text-xl text-neutral mb-6">
          Aquí puedes encontrar los últimos marcadores
        </p>
        <FilterCategoryTag
          categories={categoriesData}
          tags={tagsForFilter}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onCategoryChange={handleCategoryChange}
          onTagChange={handleTagChange}
        />
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
              bookmark.imageUrls && bookmark.imageUrls.length > 0
                ? getImageUrl(bookmark.imageUrls[0])
                : imageTemporal
            }
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 my-8">
        <Buttons
          color="btn-secondary"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          {"< Anterior"}
        </Buttons>
        <Buttons
          color="btn-secondary"
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(filteredBookmarks.length / cardsPerPage)}
        >
          {"Siguiente >"}
        </Buttons>
      </div>
    </>
  );
}