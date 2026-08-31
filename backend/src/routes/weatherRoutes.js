const express        = require('express');
const { getAllCityWeather } = require('../services/weatherService');


const checkJwt = require('../middleware/checkJwt');

const router = express.Router();

router.use(checkJwt);

router.get('/weather', async (req, res, next) => {
  try {
    const rankedCities = await getAllCityWeather();
    res.json({
      success:   true,
      count:     rankedCities.length,    // how many cities returned successfully
      fetchedAt: new Date().toISOString(), // ISO 8601 UTC timestamp
      data:      rankedCities,           // the ranked array
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
