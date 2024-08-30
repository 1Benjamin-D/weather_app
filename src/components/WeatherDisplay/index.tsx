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

export default function WeatherDisplay() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les données météo
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather");

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
  }, []);

  // const temperatureCelsius = weatherData
  //   ? (weatherData.temperature - 273.15).toFixed(2)
  //   : "";
  const windSpeedKmh = weatherData
    ? (weatherData.windSpeed * 3.6).toFixed(2)
    : "";

  return (
    <div>
      {weatherData ? (
        <div className="weather-data">
          <h2>{weatherData.city}</h2>
          <p>Date : {weatherData.date}</p>
          {/* <p>Température : {temperatureCelsius} °C</p> */}
          <p>Température 2: {weatherData.temperature} °C</p>
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
