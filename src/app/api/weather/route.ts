import { NextResponse } from "next/server";

interface WeatherData {
  temperature: number;
  clouds: number;
  humidity: number;
  windSpeed: number;
  weatherDescription: string;
  city: string;
  date: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.error("Missing API key");
    return NextResponse.json(
      { message: "API key is missing" },
      { status: 500 }
    );
  }

  if (!lat || !lon) {
    console.error("Missing latitude or longitude");
    return NextResponse.json(
      { message: "Latitude or longitude is missing" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      console.error(
        `Error fetching data: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { message: "Error fetching data" },
        { status: response.status }
      );
    }

    const weatherData = await response.json();

    const weather: WeatherData = {
      temperature: weatherData.list[0].main.temp,
      clouds: weatherData.list[0].clouds.all,
      humidity: weatherData.list[0].main.humidity,
      windSpeed: weatherData.list[0].wind.speed,
      weatherDescription: weatherData.list[0].weather[0].description,
      city: weatherData.city.name,
      date: weatherData.list[0].dt_txt,
    };

    return NextResponse.json(weather);
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
