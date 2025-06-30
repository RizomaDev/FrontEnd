import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MapInteractive from "../../components/MapInteractive/MapInteractive";
import 'leaflet/dist/leaflet.css';

export default function MapView() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow" style={{ minHeight: "500px" }}>
        <MapInteractive />
      </div>
      <Footer />
    </div>
  );
}
