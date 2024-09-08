"use client";
import { motion } from "framer-motion";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { FC, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface MapProps {
  lat: number | null;
  lon: number | null;
}
const ICON = icon({
  iconUrl: "/Image/map-marker-icon-red.png",
  iconSize: [38, 38], // Taille par défaut de l'icône
  iconAnchor: [12, 41], // Point de l'icône correspondant à sa position
  popupAnchor: [1, -34], // Position du popup par rapport à l'icône
});

const RecenterAndZoom: FC<MapProps> = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {
    if (lat !== null && lon !== null) {
      const newCenter: [number, number] = [lat, lon];
      map.setView(newCenter, 12);
    }
  }, [lat, lon, map]);

  return null;
};

const Map: FC<MapProps> = ({ lat, lon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      viewport={{ once: true }}
      className="h-80 w-96 lg:w-[50%] border-2 border-blue-700"
    >
      <MapContainer
        center={lat && lon ? [lat, lon] : [46.603354, 1.888334]}
        zoom={lat && lon ? 12 : 5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAndZoom lat={lat} lon={lon} />
        {lat && lon && (
          <Marker position={[lat, lon]} icon={ICON}>
            <Popup>
              Coordonnées: {lat}, {lon}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </motion.div>
  );
};

export default Map;
