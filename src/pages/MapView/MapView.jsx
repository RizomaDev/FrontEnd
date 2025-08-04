import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MapInteractive from "../../components/MapInteractive/MapInteractive";
import { useLocation } from "react-router-dom";
import 'leaflet/dist/leaflet.css';

export default function MapView() {
  const location = useLocation();
  const initialMapState = location.state;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow" style={{ minHeight: "500px" }}>
        <MapInteractive 
          initialCenter={initialMapState?.center}
          initialZoom={initialMapState?.zoom}
          focusedBookmarkId={initialMapState?.focusedBookmarkId}
        />
      </div>
      <Footer />
    </div>
  );
}
