
const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL:      300,  // 5 minutes in seconds
  checkperiod: 60,   // cleanup scan every 60 seconds
});

function get(key) {
  return cache.get(String(key));
}

function set(key, value) {
  return cache.set(String(key), value);
}


function has(key) {
  return cache.has(String(key));
}

function getTtlSeconds(key) {
  const expiryTimestampMs = cache.getTtl(String(key));


  if (!expiryTimestampMs) return 0;

  const remainingMs = expiryTimestampMs - Date.now();

  return Math.max(0, Math.round(remainingMs / 1000));
}

function getDebugInfo(cityList) {
  return cityList.map((city) => {
    // Use CityCode as the cache key (same key used when the data was stored)
    const inCache = has(city.CityCode);

    return {
      cityId:             city.CityCode,   // was city.id
      name:               city.CityName,   // was city.name
      // HIT = data is available in cache; MISS = will trigger a fresh OWM call
      status:             inCache ? 'HIT' : 'MISS',
     
      ttlRemainingSeconds: inCache ? getTtlSeconds(city.CityCode) : null,
    };
  });
}


function getOverallStats() {
  return cache.getStats();
}

module.exports = {
  get,
  set,
  has,
  getTtlSeconds,
  getDebugInfo,
  getOverallStats,
};
