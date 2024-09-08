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
    lat: null,
    lon: null,
  });

  // Fonction de rappel pour mettre à jour les coordonnées
  const handleCoordinatesChange = (lat: number, lon: number) => {
    setSelectedCoordinates({ lat, lon });
  };

  return (
    <main className="">
      <div className="mt-5 flex flex-col items-center lg:mb-[5%] lg:mt-[3%]">
        <Search onCoordinatesChange={handleCoordinatesChange} />
      </div>
      <div className="flex flex-col items-center justify-around gap-10 mt-5 lg:flex-row">
        <WeatherDisplay
          lat={selectedCoordinates.lat ?? 48.8566} // Latitude de Paris par défaut
          lon={selectedCoordinates.lon ?? 2.3522} // Longitude de Paris par défaut
        />
        <Map lat={selectedCoordinates.lat} lon={selectedCoordinates.lon} />
      </div>
      <h2 className="text-center mt-20">
        © 2024 Weather App (France). All rights reserved.
      </h2>
    </main>
  );
}
