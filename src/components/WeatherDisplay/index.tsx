"use client";
import { useEffect, useState } from "react";

interface WeatherData {
  temperature: number;
  clouds: number;
  humidity: number;
  windSpeed: number;
  weatherDescription: string;
  city: string;
  date: string;
}

interface WeatherDisplayProps {
  lat: number | null;
  lon: number | null;
}

export default function WeatherDisplay({ lat, lon }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (lat === null || lon === null) return;

      try {
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data: WeatherData = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError("Error fetching weather data");
        console.error("Error fetching weather data:", err);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  const windSpeedKmh = weatherData
    ? (weatherData.windSpeed * 3.6).toFixed(2)
    : "";

  return (
    <div>
      {weatherData ? (
        <div className="weather-data">
          <h2>{weatherData.city}</h2>
          <p>Date : {weatherData.date}</p>
          <p>Température : {weatherData.temperature} °C</p>
          <p>Nuages : {weatherData.clouds} %</p>
          <p>Humidité : {weatherData.humidity} %</p>
          <p>Vitesse du vent : {windSpeedKmh} km/h</p>
          <p>Description : {weatherData.weatherDescription}</p>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Chargement des données météo...</p>
      )}
    </div>
  );
}
