import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookmarkById } from "../../service/apiService";
import { useAuth } from "../../context/AuthContext";
import FormDeleteBookmark from "../../components/Forms/FormDeleteBookmark/FormDeleteBookmark";
import Header from "../../components/Header/Header";
import HeaderLogged from "../../components/HeaderLogged/HeaderLogged";
import Footer from "../../components/Footer/Footer";

export default function BookmarkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookmark, setBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getBookmarkById(id)
      .then((data) => {
        setBookmark(data);
        setLoading(false);
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

  return (
    <>
      {user ? <HeaderLogged /> : <Header />}
      <div className="card bg-base-100 shadow-xl rounded-lg ">
        <div className="card-body p-0">
          <div className="p-6 md:p-8">
            <p className="text-lg text-accent-content font-medium mb-2">
              {bookmark.category}
              <br />
              {bookmark.tag}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-2 leading-tight">
              {bookmark.title}
            </h1>
            <p className="text-xl text-primary text-content mb-4">
              {bookmark.location && typeof bookmark.location === "object"
                ? `Lat: ${bookmark.location.latitude}, Lng: ${bookmark.location.longitude}`
                : bookmark.location}
            </p>
          </div>

          {bookmark.imageUrls && bookmark.imageUrls.length > 0 && (
            <div className="carousel w-full mb-8 relative [filter:sepia(40%)]">
              {bookmark.imageUrls.map((imgPath, idx) => (
                <div key={idx} id={`slide${idx + 1}`} className="carousel-item relative w-full">
                  <img
                    src={`http://localhost:8080/api/images/${imgPath.split('/').pop()}`}
                    className="w-full object-cover h-auto"
                    alt={`Bookmark Image ${idx + 1}`}
                  />
                  <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <a href={`#slide${idx === 0 ? bookmark.imageUrls.length : idx}`}
                      className="btn btn-circle btn-ghost bg-base-200 bg-opacity-50 hover:bg-opacity-75">❮</a>
                    <a href={`#slide${idx === bookmark.imageUrls.length - 1 ? 1 : idx + 2}`}
                      className="btn btn-circle btn-ghost bg-base-200 bg-opacity-50 hover:bg-opacity-75">❯</a>
                  </div>
                </div>
              ))}
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
                  {/* Optionally add more details here if available */}
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
                      // Soporte para YouTube y Vimeo
                      const ytMatch = bookmark.video.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
                      const vimeoMatch = bookmark.video.match(/vimeo\.com\/(\d+)/);
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
                      } else {
                        return (
                          <a className="text-base text-base-content leading-relaxed underline" href={bookmark.video} target="_blank" rel="noopener noreferrer">{bookmark.video}</a>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>
              <div className="bg-base-300 pt-8 pb-6 [filter:sepia(40%)]">
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
                  <div className="text-base text-base-content leading-relaxed flex flex-col gap-1">
                    <p>Nombre: {bookmark.host}</p>
                    <p>Email: {bookmark.email}</p>
                 
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-11/12 mx-auto lg:w-64 flex-shrink-0 self-start order-1 lg:order-2 ">
              <div className="card bg-secondary shadow-md rounded-lg p-6 text-center [filter:sepia(40%)]">
                <div className="text-xl font-bold text-neutral-content mb-2">Creado por</div>
                <div className="text-3xl font-extrabold text-neutral-content">nombre usuario {bookmark.userId}</div>
              </div>
              {user && bookmark.userId === user.id && (
                <div className="flex flex-col gap-3">
                  <div className="">
                    <div className="card-body p-0 flex items-center justify-center">
                      <button className="btn btn-primary text-primary-content w-full" onClick={() => navigate(`/EditBookmark/${bookmark.id}`)}>Edit this Bookmark</button>
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