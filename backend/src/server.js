
// Load and validate environment variables 

const { PORT } = require('./config/env');

//Load cities list at startup 
const citiesData = require('./data/cities.json');
const cities = citiesData.List; 


const app = require('./app');


app.listen(PORT, () => {
  console.log('─────────────────────────────────────────');
  console.log(`  🌤  WeatherSense Comfort Index API`);
  console.log(`  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Port        : ${PORT}`);
  console.log(`  Cities loaded: ${cities.length} cities`);

  cities.forEach((c) => console.log(`    • [${c.CityCode}] ${c.CityName}`));
  console.log('─────────────────────────────────────────');
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log('─────────────────────────────────────────');
});
