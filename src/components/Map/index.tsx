"use client";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { FC, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface MapProps {
  lat: number | null;
  lon: number | null;
}
const ICON = icon({
  iconUrl: "./Image/map-marker-icon.png",
  iconSize: [38, 38],
  iconAnchor: [22, 55],
  popupAnchor: [-3, -55],
});
// Composant pour ajuster dynamiquement le centre et le zoom de la carte
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
    <MapContainer
      center={lat && lon ? [lat, lon] : [46.603354, 1.888334]}
      zoom={lat && lon ? 12 : 5}
      scrollWheelZoom={true}
      className="h-80 w-96"
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
  );
};

export default Map;
