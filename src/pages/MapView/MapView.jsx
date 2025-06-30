import React, { useEffect, useState } from "react";
import MapBookmarks from "../../components/MapBookmarks";
import { getAllBookmarks } from "../../service/apiService";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import 'leaflet/dist/leaflet.css';

export default function MapView() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    getAllBookmarks().then((data) => setBookmarks(data));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow" style={{ minHeight: "500px" }}>
        <MapBookmarks bookmarks={bookmarks} responsive />
      </div>
      <Footer />
    </div>
  );
}
