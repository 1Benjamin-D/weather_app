"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { FC } from "react";

const Map: FC = () => {
  return (
    <MapContainer
      center={[46.603354, 1.888334]}
      zoom={5}
      scrollWheelZoom={true}
      className="h-80 w-96"
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default Map;
