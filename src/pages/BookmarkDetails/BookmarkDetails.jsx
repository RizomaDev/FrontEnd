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
        setError("Error fetching bookmark details");
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
              Routes with a local perspective
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
              <div className="text-md text-content mb-4 flex items-center gap-2 ml-5">
                <span className="font-semibold text-base-content">Created by:</span>{" "}
                {bookmark.userName && (
                  <span className="font-bold text-secondary">@{bookmark.userName}</span>
                )}
              </div>
              <p className="text-base text-base-content leading-relaxed mb-6 ml-5">
                {bookmark.description}
              </p>
              <div className="bg-base-200 pb-10 pt-4">
                <h3 className="text-2xl font-semibold text-secondary ml-5 mb-4">
                  What to Expect
                </h3>
                <p className="text-md text-secondary font-semibold text-neutral-content ml-5 mb-6">
                  Duration: {bookmark.duration} in hours
                </p>
                <div className="text-base text-base-content leading-relaxed space-y-4 ml-5">
                  {/* Optionally add more details here if available */}
                </div>
                {bookmark.itinerary && (
                <div className="mb-6 ml-5">
                  <h4 className="text-lg font-semibold text-primary mb-2">Itinerary</h4>
                  <p className="text-base text-base-content leading-relaxed">{bookmark.itinerary}</p>
                </div>
              )}
              {bookmark.observation && (
                <div className="mb-6 ml-5">
                  <h4 className="text-lg font-semibold text-primary mb-2">Observations</h4>
                  <p className="text-base text-base-content leading-relaxed">{bookmark.observation}</p>
                </div>
              )}
              </div>
              <div className="bg-base-300 pt-8 pb-6 [filter:sepia(40%)]">
                <h3 className="text-2xl font-semibold text-primary mb-4 ml-5">
                  Contact the local guide
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
                    <p>Name: {bookmark.host}</p>
                    <p>Email: {bookmark.email}</p>
                    <p>Phone/whatsapp: {bookmark.mobile}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-11/12 mx-auto lg:w-64 flex-shrink-0 self-start order-1 lg:order-2 ">
              <div className="card bg-secondary shadow-md rounded-lg p-6 text-center [filter:sepia(40%)]">
                <div className="text-xl font-bold text-neutral-content mb-2">Average Price</div>
                <div className="text-3xl font-extrabold text-neutral-content">EUR {bookmark.price}</div>
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