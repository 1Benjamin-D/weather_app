"use client";

import { useState } from "react";

interface Address {
  city: string;
  postalCode: string;
  coordinates0: number; // longitude
  coordinates1: number; // latitude
}

interface SearchProps {
  onCoordinatesChange: (lat: number, lon: number) => void;
}

export default function Search({ onCoordinatesChange }: SearchProps) {
  const [adresse, setAdresse] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmedAddress = adresse.trim(); // Supprimer les espaces au début et à la fin

    if (!trimmedAddress) return;

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          trimmedAddress // Utiliser l'adresse sans espaces
        )}&autocomplete=1`
      );
      if (!response.ok) {
        throw new Error("Address Fetch failed");
      }
      const data = await response.json();
      const results = data.features
        .map((feature: any) => ({
          city: feature.properties.city,
          postalCode: feature.properties.postcode,
          coordinates0: feature.geometry.coordinates[0], // longitude
          coordinates1: feature.geometry.coordinates[1], // latitude
        }))
        .filter(
          (address: Address) =>
            address.city.toLowerCase() === trimmedAddress.toLowerCase() ||
            address.postalCode === trimmedAddress
        );

      setAddresses(results);
      setError(null);

      if (results.length > 0) {
        const { coordinates0, coordinates1 } = results[0];
        onCoordinatesChange(coordinates1, coordinates0);
      }
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
        placeholder="Rechercher une ville ou un code postal..."
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
