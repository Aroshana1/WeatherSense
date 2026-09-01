// Fetches live weather data from OpenWeatherMap
const axios  = require('axios');
const { OWM_API_KEY } = require('../config/env');
const { computeComfortIndex } = require('./comfortIndexService');
const cacheService = require('./cacheService'); // Phase 3: in-memory TTL cache


const citiesData = require('../data/cities.json');


const cities = citiesData.List;

const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const OWM_UNITS = 'standard';

// Kelvin to Celsius conversion
//Celsius = Kelvin - 273.15
function kelvinToCelsius(kelvin) {

  return Math.round((kelvin - 273.15) * 100) / 100;
}


async function fetchWeatherForCity(city) {
  
  const cityId   = city.CityCode;   
  const cityName = city.CityName;   

  //Cache checking

  const cached = cacheService.get(cityId);
  if (cached !== undefined) {
    // Cache HIT — return immediately, no network call.
    console.log(`[cache] HIT  city=${cityName} (id=${cityId})`);
    return cached;
  }
  // Cache MISS — log it, then fall through to the OWM fetch below.
  console.log(`[cache] MISS city=${cityName} (id=${cityId}) — fetching from OWM`);


  const params = new URLSearchParams({
    id:    cityId,        // OWM city ID (from CityCode in cities.json)
    appid: OWM_API_KEY,   // our API key from .env
    units: OWM_UNITS,     // 'standard' → Kelvin
  });

  const url = `${OWM_BASE_URL}?${params.toString()}`;

 
  const response = await axios.get(url);


  const owmData = response.data;

  const raw = {
    // Convert from Kelvin using our helper above.
    tempC:      kelvinToCelsius(owmData.main.temp),

    humidity:   owmData.main.humidity,

    windSpeed:  owmData.wind.speed,

    clouds:     owmData.clouds.all,

    visibility: owmData.visibility || 0,
  };

  // Run the pure scoring function. 
  const comfortScore = computeComfortIndex(raw);

  const result = {
    cityId:  cityId,                   // from CityCode in cities.json
    name:    cityName,                 // from CityName in cities.json
    country: owmData.sys?.country || '', 
    ...raw,          
    comfortScore,
  };

  //Cache write (AFTER successful fetch)
  cacheService.set(cityId, result);

  return result;
}


async function getAllCityWeather() {

  const results = await Promise.allSettled(
    cities.map((city) => fetchWeatherForCity(city))  
  );


  const successfulCities = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successfulCities.push(result.value);
    } else {

      console.warn(
        `[weatherService] Failed to fetch city ${cities[index]?.CityName} ` +
        `(ID: ${cities[index]?.CityCode}): ${result.reason?.message}`
      );
    }
  });


  const ranked = successfulCities.sort(
    (a, b) => b.comfortScore - a.comfortScore
  );

  
  return ranked.map((city, index) => ({
    ...city,
    rank: index + 1, 
  }));
}

module.exports = { getAllCityWeather };
