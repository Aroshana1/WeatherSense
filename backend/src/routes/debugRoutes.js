//Cache inspection endpoint


const express       = require('express');
const cacheService  = require('../services/cacheService');
const checkJwt      = require('../middleware/checkJwt'); //  protect debug endpoint


const citiesData = require('../data/cities.json');
const cities = citiesData.List;

const router = express.Router();


router.use(checkJwt);


router.get('/cache', (req, res) => {
  
  const perCity = cacheService.getDebugInfo(cities);

  // Compute summary counts from the per-city array.
  const hitCount  = perCity.filter((c) => c.status === 'HIT').length;
  const missCount = perCity.filter((c) => c.status === 'MISS').length;


  //monitoring dashboards or health checks.
  const overallStats = cacheService.getOverallStats();

  res.json({
    success: true,
    // ISO 8601 UTC timestamp so the reader knows exactly when this snapshot
    snapshotAt: new Date().toISOString(),

    summary: {
      totalCities:  cities.length,
      // Cities whose data is currently in cache (within the 5-min window)
      cacheHits:    hitCount,
      // Cities whose data has expired or was never fetched
      cacheMisses:  missCount,

      ttlSeconds:   300,
    },


    lifetimeStats: {
      totalHits:   overallStats.hits,
      totalMisses: overallStats.misses,
      keysInCache: overallStats.keys,
    },

    cities: perCity,
  });
});

module.exports = router;
