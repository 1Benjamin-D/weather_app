"use client";

import { useState } from "react";

interface Address {
  city: string;
  postalCode: string;
  coordinates0: number; // longitude
  coordinates1: number; // Latitude
}

export default function Search() {
  const [adresse, setAdresse] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!adresse) return;
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          adresse
        )}&autocomplete=1`
      );
      if (!response.ok) {
        throw new Error("Adress Fetch failed");
      }
      const data = await response.json();
      const results = data.features
        .map((feature: any) => ({
          city: feature.properties.city,
          postalCode: feature.properties.postcode,
          coordinates0: feature.geometry.coordinates[0], // longitude
          coordinates1: feature.geometry.coordinates[1], // Latitude
        }))
        .filter(
          (address: Address) =>
            address.city.toLowerCase() === adresse.toLowerCase() ||
            address.postalCode === adresse
        );
      setAddresses(results);
      console.log(results);
      setError(null);
    } catch (err) {
      setError("Error fetching addresses");
      console.error("Error fetching addresses:", err);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Rechercher une ville ..."
        className="border-2 border-black border-solid p-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 mt-2"
      >
        Rechercher
      </button>
    </div>
  );
}