"use client";
import { motion } from "framer-motion";
import Image from "next/image";
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

  const formattedDate = weatherData
    ? new Date(weatherData.date).toLocaleDateString("fr-FR")
    : "";

  const getWeatherImage = (description: string) => {
    if (description.includes("légère pluie")) {
      return "/Image/rain.png";
    } else if (description.includes("nuageux")) {
      return "/Image/broken_clouds.png";
    } else if (description.includes("légères chutes de neige")) {
      return "/Image/snow.png";
    } else if (description.includes("orageux")) {
      return "/Image/thunderstorm.png";
    } else if (description.includes("brouillard")) {
      return "/Image/mist.png";
    } else if (description.includes("couvert")) {
      return "/Image/few_clouds.png";
    } else if (description.includes("pluie modérée")) {
      return "/Image/shower_rain.png";
    } else if (description.includes("partiellement nuageux")) {
      return "/Image/scattered_clouds.png";
    } else {
      return "/Image/clear_sky.png";
    }
  };

  return (
    <div>
      {weatherData ? (
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className=" border-2 border-blue-700 border-solid w-fit p-7 text-center rounded-md"
        >
          <div className="flex justify-between">
            <motion.h2
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="font-bold underline"
            >
              {weatherData.city}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {formattedDate}
            </motion.p>
          </div>
          <div className="my-4">
            <motion.p
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {weatherData.weatherDescription}
            </motion.p>
            <Image
              src={getWeatherImage(weatherData.weatherDescription)}
              alt={weatherData.weatherDescription}
              width={100}
              height={100}
              className="ml-[25%]"
            />
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {weatherData.temperature} °C
            </motion.p>
          </div>
          <div>
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="font-semibold">Nuages :</span>{" "}
              {weatherData.clouds} <span className="underline">%</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="font-semibold">Humidité :</span>{" "}
              {weatherData.humidity} <span className="underline">%</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="font-semibold">Vitesse du vent :</span>{" "}
              {windSpeedKmh} <span className="underline">km/h</span>
            </motion.p>
          </div>
        </motion.div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Chargement des données météo...</p>
      )}
    </div>
  );
}
