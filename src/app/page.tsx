"use client";

import Map from "@/components/Map";
import Search from "@/components/Search";
import WeatherDisplay from "@/components/WeatherDisplay";
import { useState } from "react";

export default function Home() {
  // État pour stocker les coordonnées sélectionnées
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number | null;
    lon: number | null;
  }>({
    lat: 48.8566, // Latitude de Paris par défaut
    lon: 2.3522, // Longitude de Paris par défaut
  });

  // Fonction de rappel pour mettre à jour les coordonnées
  const handleCoordinatesChange = (lat: number, lon: number) => {
    setSelectedCoordinates({ lat, lon });
  };

  return (
    <main>
      <Search onCoordinatesChange={handleCoordinatesChange} />
      <WeatherDisplay
        lat={selectedCoordinates.lat}
        lon={selectedCoordinates.lon}
      />
      <Map lat={selectedCoordinates.lat} lon={selectedCoordinates.lon} />
    </main>
  );
}
