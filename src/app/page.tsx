"use client";

import Map from "@/components/Map";
import Search from "@/components/Search";
import WeatherDisplay from "@/components/WeatherDisplay";

export default function Home() {
  return (
    <main>
      {/* Appel du composant pour afficher les données météo */}
      <WeatherDisplay />
      <Map />
      <Search />
    </main>
  );
}
