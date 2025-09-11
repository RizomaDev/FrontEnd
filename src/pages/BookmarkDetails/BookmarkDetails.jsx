import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookmarkById, getUserById } from "../../service/apiService";
import { useAuth } from "../../context/AuthContext";
import FormDeleteBookmark from "../../components/Forms/FormDeleteBookmark/FormDeleteBookmark";
import Header from "../../components/Header/Header";
import HeaderLogged from "../../components/HeaderLogged/HeaderLogged";
import Footer from "../../components/Footer/Footer";
import CategoryIcon from '../../components/MapInteractive/CategoryIcon';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import BookmarkMap from '../../components/BookmarkMap/BookmarkMap';
import { createCustomIcon } from '../../components/MapInteractive/CustomMarkerIcon';
import 'leaflet/dist/leaflet.css';

export default function BookmarkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookmark, setBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBookmarkById(id)
      .then((data) => {
        setBookmark(data);
        setLoading(false);
        if (data.userId) {
          if (data.creatorName) {
            setCreator({ id: data.userId, name: data.creatorName });
          }
          getUserById(data.userId)
            .then((userData) => {
              setCreator(userData);
            })
            .catch((error) => {
              if (!creator && data.creatorName) {
                setCreator({ id: data.userId, name: data.creatorName });
              } else {
                setCreator({ id: data.userId, name: "Usuario Anónimo" });
              }
            });
        } else {
          setCreator({ name: "Usuario Anónimo" });
        }
      })
      .catch((err) => {
        setError("Error al cargar los detalles del marcador");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-error">{error}</span>
      </div>
    );
  }

  if (!bookmark) return null;

  const categoryLower = bookmark.category ? bookmark.category.toLowerCase() : '';
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;

  return (
    <>
      {user ? <HeaderLogged /> : <Header />}
      <div className="card bg-base-100 shadow-xl rounded-lg">
        <div className="card-body p-0">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <CategoryIcon 
                category={bookmark.category} 
                tag={bookmark.tag} 
                size="lg"
              />
              <div>
                <span 
                  className="badge"
                  style={{ 
                    backgroundColor: backgroundColor,
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {bookmark.category}
                </span>
                <span 
                  className="badge ml-2"
                  style={{ 
                    backgroundColor: 'oklch(0.7036 0.0814 186.26)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {bookmark.tag}
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-2 leading-tight">
              {bookmark.title}
            </h1>
            <p className="text-xl text-primary text-content mb-4">
              {bookmark.address && bookmark.address !== "Dirección no disponible"
                ? bookmark.address
                : "Sin dirección disponible"}
            </p>
          </div>

          {bookmark.imageUrls && bookmark.imageUrls.length > 0 && (
            <div className="w-full [filter:sepia(40%)]">
              <div className="carousel w-full">
                {bookmark.imageUrls.map((imgPath, idx) => (
                  <div 
                    key={idx} 
                    id={`slide${idx + 1}`} 
                    className="carousel-item relative w-full"
                  >
                    <div className="w-full aspect-[16/9] relative overflow-hidden">
                      <img
                        src={imgPath}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={`Bookmark Image ${idx + 1}`}
                      />
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a 
                        href={`#slide${idx === 0 ? bookmark.imageUrls.length : idx}`}
                        className="btn btn-circle btn-ghost bg-base-200 bg-opacity-50 hover:bg-opacity-75"
                      >
                        ❮
                      </a>
                      <a 
                        href={`#slide${idx === bookmark.imageUrls.length - 1 ? 1 : idx + 2}`}
                        className="btn btn-circle btn-ghost bg-base-200 bg-opacity-50 hover:bg-opacity-75"
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {bookmark.imageUrls.length > 1 && (
                <div className="flex justify-center w-full py-2 gap-2">
                  {bookmark.imageUrls.map((_, idx) => (
                    <a 
                      key={idx} 
                      href={`#slide${idx + 1}`}
                      className="btn btn-xs"
                    >
                      {idx + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="p-6 md:p-8 pt-0 flex flex-col lg:flex-row gap-6">
            <div className="flex-1 order-2 lg:order-1">
              <div className="bg-base-200 pb-10 pt-4">
                <h3 className="text-2xl font-semibold text-secondary ml-5 mb-4">
                  Qué esperar
                </h3>
                <p className="text-base text-base-content leading-relaxed ml-5 mb-6">
                   {bookmark.description} 
                </p>
                <div className="text-base text-base-content leading-relaxed space-y-4 ml-5">
                </div>
                {bookmark.url && (
                <div className="mb-6 ml-5">
                  <h4 className="text-lg font-semibold text-primary mb-2">Información adicional</h4>
                  <a className="text-base text-base-content leading-relaxed underline" href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.url}</a>
                </div>
                )}
                {bookmark.video && (
                  <div className="mb-6 ml-5">
                    <h4 className="text-lg font-semibold text-primary mb-2">Video</h4>
                    {(() => {
                      const ytMatch = bookmark.video.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
                      const vimeoMatch = bookmark.video.match(/vimeo\.com\/(\d+)/);
                      const cloudinaryMatch = bookmark.video.match(/cloudinary\.com/);
                      
                      if (ytMatch) {
                        return (
                          <div className="aspect-video w-full max-w-xl">
                            <iframe
                              width="100%"
                              height="315"
                              src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            ></iframe>
                          </div>
                        );
                      } else if (vimeoMatch) {
                        return (
                          <div className="aspect-video w-full max-w-xl">
                            <iframe
                              src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                              width="100%"
                              height="315"
                              frameBorder="0"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              title="Vimeo video player"
                            ></iframe>
                          </div>
                        );
                      } else if (cloudinaryMatch) {
                        return (
                          <div className="aspect-video w-full max-w-xl">
                            <video
                              className="w-full rounded-lg shadow-lg"
                              controls
                              preload="metadata"
                            >
                              <source src={bookmark.video} type="video/mp4" />
                              Tu navegador no soporta el elemento de video.
                            </video>
                          </div>
                        );
                      } else {
                        return (
                          <a className="text-base text-base-content leading-relaxed underline" href={bookmark.video} target="_blank" rel="noopener noreferrer">{bookmark.video}</a>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>

              {bookmark.location && bookmark.location.latitude && bookmark.location.longitude && (
                <div className="mt-6 bg-base-200 rounded-lg overflow-hidden">
                  <h3 className="text-2xl font-semibold text-secondary p-5 pb-0">
                    Ubicación
                  </h3>
                  <div className="p-5">
                    <div className="h-[400px] relative rounded-lg overflow-hidden">
                      <BookmarkMap bookmark={bookmark} />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 bg-base-300 pt-8 pb-6 [filter:sepia(40%)] rounded-lg">
                <h3 className="text-2xl font-semibold text-primary mb-4 ml-5">
                  Creado por
                </h3>
                <div className="flex items-center gap-6 mb-8 ml-5">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-full">
                      <img
                        src="https://placehold.co/80x80/dddddd/000000?text=Host"
                        alt="Host Profile"
                      />
                    </div>
                  </div>
                  <div className="text-base text-base-content leading-relaxed">
                    <p className="font-medium text-lg">
                      {creator?.name || "Usuario Anónimo"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-11/12 mx-auto lg:w-64 flex-shrink-0 self-start order-1 lg:order-2">
              {user && bookmark.userId === user.id && (
                <div className="flex flex-col gap-3">
                  <div className="">
                    <div className="card-body p-0 flex items-center justify-center">
                      <button 
                        className="btn btn-primary text-white w-full" 
                        onClick={() => navigate(`/EditBookmark/${bookmark.id}`)}
                      >
                        Edit this Bookmark
                      </button>
                    </div>
                  </div>
                  <FormDeleteBookmark id_bookmark={bookmark.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}