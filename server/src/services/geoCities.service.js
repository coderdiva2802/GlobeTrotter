import { prisma } from '../lib/prisma.js';
import { getOrFetchCityImage } from './pexels.service.js';

/**
 * World continent mappings for popular travel regions
 */
export const CONTINENT_MAP = {
  Europe: ['France', 'Italy', 'Spain', 'Greece', 'Germany', 'United Kingdom', 'Netherlands', 'Switzerland', 'Portugal', 'Austria'],
  Asia: ['Japan', 'Thailand', 'India', 'Indonesia', 'Vietnam', 'Singapore', 'South Korea', 'Malaysia', 'Maldives', 'China'],
  'North America': ['United States', 'Canada', 'Mexico', 'Costa Rica', 'Jamaica', 'Dominican Republic'],
  'South America': ['Brazil', 'Peru', 'Argentina', 'Chile', 'Colombia', 'Ecuador'],
  Africa: ['Egypt', 'South Africa', 'Kenya', 'Morocco', 'Tanzania', 'Mauritius'],
  Oceania: ['Australia', 'New Zealand', 'Fiji'],
};

/**
 * Search cities using local DB with fallback to GeoDB open search
 * @param {string} query
 * @param {number} limit
 */
export const searchCities = async (query = '', limit = 10) => {
  const q = query.trim().toLowerCase();

  // Search existing cities in database
  let dbCities = await prisma.city.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { country: { name: { contains: q, mode: 'insensitive' } } },
            { region: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {},
    take: limit,
    include: {
      country: true,
      images: {
        include: { image: true },
        orderBy: { isCover: 'desc' },
      },
    },
    orderBy: { popularityScore: 'desc' },
  });

  // Format cities with cover image URLs
  const formattedCities = await Promise.all(
    dbCities.map(async (city) => {
      let coverImageUrl = city.images?.[0]?.image?.url;

      if (!coverImageUrl) {
        coverImageUrl = await getOrFetchCityImage(city.id, city.name, city.country.name);
      }

      return {
        id: city.id,
        name: city.name,
        region: city.region,
        countryName: city.country.name,
        countryCode: city.country.code,
        continent: city.country.continent,
        latitude: city.latitude,
        longitude: city.longitude,
        description: city.description,
        costIndex: city.costIndex,
        averageDailyCost: city.averageDailyCost,
        popularityScore: city.popularityScore,
        coverImageUrl,
      };
    })
  );

  return formattedCities;
};

/**
 * Get dynamic regional continent summaries
 */
export const getRegionalSelections = async () => {
  const continents = Object.keys(CONTINENT_MAP);

  const regionalSummaries = await Promise.all(
    continents.map(async (continentName) => {
      // Find cities in this continent
      const citiesCount = await prisma.city.count({
        where: {
          country: {
            continent: continentName,
          },
        },
      });

      // Find top city cover image or search Pexels for continent landmark
      const topCity = await prisma.city.findFirst({
        where: {
          country: {
            continent: continentName,
          },
        },
        include: {
          country: true,
          images: { include: { image: true } },
        },
        orderBy: { popularityScore: 'desc' },
      });

      let coverImageUrl = topCity?.images?.[0]?.image?.url;

      if (!coverImageUrl && topCity) {
        coverImageUrl = await getOrFetchCityImage(topCity.id, topCity.name, topCity.country.name);
      }

      if (!coverImageUrl) {
        coverImageUrl = `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80`;
      }

      // Query top popular cities dynamically from database for this continent
      const popularCitiesRecords = await prisma.city.findMany({
        where: {
          country: {
            continent: continentName,
          },
        },
        select: { name: true },
        orderBy: { popularityScore: 'desc' },
        take: 5,
      });

      let popularCities = popularCitiesRecords.map((c) => c.name);

      if (popularCities.length === 0) {
        const fallbackCitiesMap = {
          Europe: ['Paris', 'Rome', 'Barcelona', 'Athens', 'Venice'],
          Asia: ['Tokyo', 'Kyoto', 'Malé', 'Mumbai', 'Jaipur'],
          'North America': ['New York City', 'San Francisco', 'Vancouver', 'Mexico City', 'Los Angeles'],
          'South America': ['Cusco', 'Rio de Janeiro', 'Buenos Aires', 'Lima', 'Santiago'],
          Africa: ['Cairo', 'Cape Town', 'Marrakech', 'Nairobi', 'Zanzibar'],
          Oceania: ['Sydney', 'Auckland', 'Melbourne', 'Fiji', 'Queenstown'],
        };
        popularCities = fallbackCitiesMap[continentName] || ['Paris', 'Tokyo', 'New York City', 'Cairo', 'Sydney'];
      }

      const descriptions = {
        Europe: 'Iconic historic landmarks, diverse cultures, and world-class gastronomy.',
        Asia: 'Ancient heritage temples, vibrant night markets, and futuristic skylines.',
        'North America': 'Majestic national parks, coastal highways, and buzzing cosmopolitan hubs.',
        'South America': 'Amazon rainforest wonders, Andean mountain passes, and lively carnival spirit.',
        Africa: 'Breathtaking savannah safaris, Sahara dunes, and rich cultural tapestries.',
        Oceania: 'Pristine coral barrier reefs, sun-soaked surf beaches, and natural wonders.',
      };

      const baseDestinationCounts = {
        Europe: 50,
        Asia: 60,
        'North America': 40,
        'South America': 30,
        Africa: 25,
        Oceania: 20,
      };

      const displayCount = Math.max(citiesCount, baseDestinationCounts[continentName] || 25);

      return {
        id: continentName.toLowerCase().replace(/\s+/g, '-'),
        name: continentName,
        destinationCount: displayCount,
        destinationCountLabel: `${displayCount}+ Destinations`,
        coverImageUrl,
        description: descriptions[continentName] || 'Explore breathtaking destinations and culture.',
        popularCities,
      };
    })
  );

  return regionalSummaries;
};
