import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth-node';
export const runtime = 'nodejs';

type WeatherData = {
    current: {
      temp: number;
      humidity: number;
      weather: {
        main: string;
      }[];
    };
    timezone?: string;
  };
  

async function fetchWeatherData(lat: number, lon: number) {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            console.warn('OpenWeather API key is not set. Using mock data.');
            return getMockWeatherData(lat, lon);
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            console.error('OpenWeather API response not OK:', await response.text());
            return getMockWeatherData(lat, lon);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return getMockWeatherData(lat, lon);
    }
}

function getMockWeatherData(lat: number, lon: number) {
    const currentDate = Math.floor(Date.now() / 1000);

    return {
        lat,
        lon,
        timezone: "Asia/Jakarta",
        timezone_offset: 25200,
        current: {
            dt: currentDate,
            sunrise: currentDate - 21600,
            sunset: currentDate + 21600,
            temp: 28.5,
            feels_like: 30.2,
            pressure: 1010,
            humidity: 75,
            dew_point: 23.4,
            uvi: 8.5,
            clouds: 20,
            visibility: 10000,
            wind_speed: 3.2,
            wind_deg: 180,
            weather: [
                {
                    id: 801,
                    main: "Clouds",
                    description: "awan tersebar",
                    icon: "02d"
                }
            ]
        },
        daily: [
            {
                dt: currentDate,
                sunrise: currentDate - 21600,
                sunset: currentDate + 21600,
                temp: {
                    day: 28.5,
                    min: 24.8,
                    max: 31.2,
                    night: 25.1,
                    eve: 27.3,
                    morn: 24.9
                },
                feels_like: {
                    day: 30.2,
                    night: 25.7,
                    eve: 28.9,
                    morn: 25.3
                },
                pressure: 1010,
                humidity: 75,
                dew_point: 23.4,
                wind_speed: 3.2,
                wind_deg: 180,
                weather: [
                    {
                        id: 801,
                        main: "Clouds",
                        description: "awan tersebar",
                        icon: "02d"
                    }
                ],
                clouds: 20,
                pop: 0.2,
                uvi: 8.5
            },
            {
                dt: currentDate + 86400,
                sunrise: currentDate + 86400 - 21600,
                sunset: currentDate + 86400 + 21600,
                temp: {
                    day: 29.1,
                    min: 24.5,
                    max: 31.8,
                    night: 25.3,
                    eve: 28.1,
                    morn: 24.7
                },
                feels_like: {
                    day: 31.0,
                    night: 25.9,
                    eve: 29.5,
                    morn: 25.1
                },
                pressure: 1011,
                humidity: 70,
                dew_point: 22.8,
                wind_speed: 2.8,
                wind_deg: 175,
                weather: [
                    {
                        id: 800,
                        main: "Clear",
                        description: "cerah",
                        icon: "01d"
                    }
                ],
                clouds: 5,
                pop: 0.1,
                uvi: 9.0
            },
            {
                dt: currentDate + 172800,
                sunrise: currentDate + 172800 - 21600,
                sunset: currentDate + 172800 + 21600,
                temp: {
                    day: 27.8,
                    min: 24.2,
                    max: 30.4,
                    night: 24.8,
                    eve: 26.9,
                    morn: 24.3
                },
                feels_like: {
                    day: 29.5,
                    night: 25.3,
                    eve: 28.2,
                    morn: 24.8
                },
                pressure: 1012,
                humidity: 78,
                dew_point: 23.6,
                wind_speed: 3.5,
                wind_deg: 190,
                weather: [
                    {
                        id: 802,
                        main: "Clouds",
                        description: "awan berarak",
                        icon: "03d"
                    }
                ],
                clouds: 30,
                pop: 0.3,
                uvi: 8.0
            },
            {
                dt: currentDate + 259200,
                sunrise: currentDate + 259200 - 21600,
                sunset: currentDate + 259200 + 21600,
                temp: {
                    day: 26.5,
                    min: 23.9,
                    max: 28.7,
                    night: 24.2,
                    eve: 25.8,
                    morn: 24.0
                },
                feels_like: {
                    day: 26.5,
                    night: 24.7,
                    eve: 26.2,
                    morn: 24.5
                },
                pressure: 1013,
                humidity: 82,
                dew_point: 23.2,
                wind_speed: 3.8,
                wind_deg: 200,
                weather: [
                    {
                        id: 500,
                        main: "Rain",
                        description: "hujan ringan",
                        icon: "10d"
                    }
                ],
                clouds: 60,
                pop: 0.6,
                rain: 2.5,
                uvi: 7.5
            },
            {
                dt: currentDate + 345600,
                sunrise: currentDate + 345600 - 21600,
                sunset: currentDate + 345600 + 21600,
                temp: {
                    day: 27.2,
                    min: 23.8,
                    max: 29.5,
                    night: 24.5,
                    eve: 26.3,
                    morn: 23.9
                },
                feels_like: {
                    day: 28.8,
                    night: 25.0,
                    eve: 27.5,
                    morn: 24.3
                },
                pressure: 1014,
                humidity: 79,
                dew_point: 23.0,
                wind_speed: 3.0,
                wind_deg: 185,
                weather: [
                    {
                        id: 501,
                        main: "Rain",
                        description: "hujan sedang",
                        icon: "10d"
                    }
                ],
                clouds: 70,
                pop: 0.7,
                rain: 5.2,
                uvi: 7.0
            },
            {
                dt: currentDate + 432000,
                sunrise: currentDate + 432000 - 21600,
                sunset: currentDate + 432000 + 21600,
                temp: {
                    day: 28.0,
                    min: 24.2,
                    max: 30.1,
                    night: 24.9,
                    eve: 27.0,
                    morn: 24.3
                },
                feels_like: {
                    day: 29.7,
                    night: 25.4,
                    eve: 28.5,
                    morn: 24.8
                },
                pressure: 1012,
                humidity: 76,
                dew_point: 23.3,
                wind_speed: 2.5,
                wind_deg: 175,
                weather: [
                    {
                        id: 802,
                        main: "Clouds",
                        description: "awan berarak",
                        icon: "03d"
                    }
                ],
                clouds: 35,
                pop: 0.3,
                uvi: 8.2
            },
            {
                dt: currentDate + 518400,
                sunrise: currentDate + 518400 - 21600,
                sunset: currentDate + 518400 + 21600,
                temp: {
                    day: 28.8,
                    min: 24.5,
                    max: 31.3,
                    night: 25.2,
                    eve: 27.8,
                    morn: 24.6
                },
                feels_like: {
                    day: 30.5,
                    night: 25.7,
                    eve: 29.3,
                    morn: 25.0
                },
                pressure: 1011,
                humidity: 72,
                dew_point: 23.0,
                wind_speed: 2.8,
                wind_deg: 180,
                weather: [
                    {
                        id: 800,
                        main: "Clear",
                        description: "cerah",
                        icon: "01d"
                    }
                ],
                clouds: 10,
                pop: 0.1,
                uvi: 8.8
            }
        ]
    };
}

async function generatePlantCareRecommendations(plantName: string, weatherData: WeatherData) {
    try {
        const currentTemp = weatherData.current.temp;
        const humidity = weatherData.current.humidity;
        const weatherCondition = weatherData.current.weather[0].main;

        let recommendation = '';

        if (plantName === 'Rice') {
            if (currentTemp > 30) {
                recommendation = 'High temperature detected. Ensure adequate water supply. Consider increasing irrigation frequency.';
            } else if (currentTemp < 15) {
                recommendation = 'Low temperature detected. Protect young seedlings. Delay fertilizer application until temperatures rise.';
            } else {
                recommendation = 'Optimal temperature for rice growth. Maintain regular irrigation schedule and monitor for pests.';
            }

            if (humidity < 40) {
                recommendation += ' Low humidity may stress the plants. Consider light irrigation to increase ambient humidity.';
            }

            if (weatherCondition === 'Rain') {
                recommendation += ' Rainy conditions may increase disease risk. Check for signs of fungal infections.';
            }
        } else if (plantName === 'Coffee') {
            if (currentTemp > 28) {
                recommendation = 'Temperature exceeding coffee\'s comfort zone. Ensure shade is adequate. Water in the early morning or evening.';
            } else if (currentTemp < 10) {
                recommendation = 'Cold stress possible. Monitor plants closely. Avoid fertilization during cold periods.';
            } else {
                recommendation = 'Good temperature range for coffee plants. Maintain regular care practices.';
            }

            if (humidity > 80) {
                recommendation += ' High humidity increases risk of fungal diseases. Ensure adequate spacing between plants for airflow.';
            }

            if (weatherCondition === 'Clear') {
                recommendation += ' Sunny conditions may require additional irrigation, especially for younger plants.';
            }
        } else if (plantName === 'Corn (Maize)') {
            if (currentTemp > 32) {
                recommendation = 'High temperatures may affect pollination. Consider additional irrigation to reduce heat stress.';
            } else if (currentTemp < 10) {
                recommendation = 'Cold stress can damage corn plants. Protect young seedlings if possible.';
            } else {
                recommendation = 'Current temperature is acceptable for corn growth. Maintain regular care practices.';
            }

            if (humidity < 40) {
                recommendation += ' Low humidity may affect pollination. Consider irrigation during flowering.';
            }

            if (weatherCondition === 'Rain') {
                recommendation += ' Monitor for water pooling which can cause root issues. Ensure fields have proper drainage.';
            }
        } else if (plantName === 'Cassava') {
            if (currentTemp > 35) {
                recommendation = 'High temperatures may slow growth. Ensure plants have adequate moisture.';
            } else if (currentTemp < 15) {
                recommendation = 'Temperatures below optimal range. Growth may slow down. Reduce watering slightly.';
            } else {
                recommendation = 'Good temperature range for cassava. Continue regular maintenance.';
            }

            if (humidity > 85) {
                recommendation += ' High humidity increases disease risk. Monitor for signs of root rot.';
            }

            if (weatherCondition === 'Clear') {
                recommendation += ' Sunny conditions are favorable for cassava. Ensure adequate but not excessive irrigation.';
            }
        } else {
            recommendation = `Current conditions: ${currentTemp}°C, ${humidity}% humidity, ${weatherCondition}. Adjust care according to specific needs of ${plantName}.`;
        }

        return recommendation;
    } catch (error) {
        console.error('Error generating plant care recommendations:', error);
        return 'Unable to generate recommendations at this time. Please check general care guides for your plant type.';
    }
}

// GET - /api/agrocare/weather
export async function GET(request: NextRequest) {
    try {
        const session = await getSessionFromRequest(request);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lon = parseFloat(searchParams.get('lon') || '0');
        const plantId = searchParams.get('plantId');

        if (!lat || !lon) {
            return NextResponse.json(
                { error: 'Latitude and longitude are required' },
                { status: 400 }
            );
        }

        const weatherData = await fetchWeatherData(lat, lon);

        let plant = null;
        let careRecommendations = null;

        if (plantId) {
            plant = await prisma.plant.findUnique({
                where: { id: plantId }
            });

            if (plant) {
                careRecommendations = await generatePlantCareRecommendations(plant.name, weatherData);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const forecast = await prisma.weatherForecast.create({
            data: {
                userId: session.id,
                plantId: plantId || undefined,
                location: {
                    lat: lat,
                    lon: lon,
                    name: weatherData.timezone || 'Unknown Location'
                },
                forecast: weatherData
            }
        });

        return NextResponse.json({
            forecast: weatherData,
            plant,
            careRecommendations
        });
    } catch (error) {
        console.error('Error processing weather request:', error);
        return NextResponse.json(
            { error: 'Failed to process weather request' },
            { status: 500 }
        );
    }
}

// POST - /api/agrocare/weather/plant-recommendations
export async function POST(request: NextRequest) {
    try {
        const session = await getSessionFromRequest(request);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { weatherData, plantName } = await request.json();

        if (!weatherData || !plantName) {
            return NextResponse.json(
                { error: 'Weather data and plant name are required' },
                { status: 400 }
            );
        }

        const recommendations = await generatePlantCareRecommendations(plantName, weatherData);

        return NextResponse.json({ recommendations });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to generate recommendations' },
            { status: 500 }
        );
    }
}