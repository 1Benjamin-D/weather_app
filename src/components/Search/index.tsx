"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmedAddress = adresse.trim();

    if (!trimmedAddress) return;

    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          trimmedAddress
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
      setAddresses([]);
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

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query
        )}&type=municipality&autocomplete=1&limit=5`
      );
      if (!response.ok) {
        throw new Error("Suggestions Fetch failed");
      }
      const data = await response.json();
      const suggestions = data.features.map((feature: any) => ({
        city: feature.properties.city,
        postalCode: feature.properties.postcode,
        coordinates0: feature.geometry.coordinates[0], // longitude
        coordinates1: feature.geometry.coordinates[1], // latitude
      }));

      setSuggestions(suggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAdresse(value);
    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (address: Address) => {
    setAdresse(`${address.city} - ${address.postalCode}`);
    setSuggestions([]);
    onCoordinatesChange(address.coordinates1, address.coordinates0);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="flex border-2 border-black border-solid w-fit items-center text-center p-1"
      >
        <Image
          src={"/Image/search.png"}
          alt="search-icon"
          width={25}
          height={10}
        />
        <input
          type="text"
          value={adresse}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Saisissez votre ville"
          className=" p-2 focus:outline-none"
        />
        <button onClick={handleSearch} className="bg-blue-700 text-white p-2">
          Rechercher
        </button>
      </motion.div>
      {suggestions.length > 0 && (
        <ul className="border-2 border-black border-solid mt-2">
          {suggestions.map((suggestion) => (
            <li
              key={`${suggestion.city}-${suggestion.postalCode}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {suggestion.city} - {suggestion.postalCode}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
