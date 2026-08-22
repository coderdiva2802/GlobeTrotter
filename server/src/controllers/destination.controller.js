import { getRegionalSelections, searchCities } from '../services/geoCities.service.js';

export const getRegions = async (req, res, next) => {
  try {
    const regions = await getRegionalSelections();
    res.status(200).json({
      success: true,
      data: regions,
    });
  } catch (error) {
    next(error);
  }
};

export const searchDestinations = async (req, res, next) => {
  try {
    const { q, limit } = req.query;
    const cities = await searchCities(q || '', Number(limit) || 12);

    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};
