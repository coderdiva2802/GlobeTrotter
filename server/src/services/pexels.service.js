import { prisma } from '../lib/prisma.js';

const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

/**
 * Fetch images from Pexels API
 * @param {string} query
 * @param {number} perPage
 */
export const fetchPhotosFromPexels = async (query, perPage = 5) => {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    console.warn('PEXELS_API_KEY is not defined in environment variables.');
    return [];
  }

  try {
    const url = `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      console.warn(`Pexels API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return (data.photos || []).map((photo) => ({
      sourceId: String(photo.id),
      url: photo.src.large2x || photo.src.large || photo.src.medium,
      authorName: photo.photographer,
      authorUrl: photo.photographer_url,
      width: photo.width,
      height: photo.height,
    }));
  } catch (error) {
    console.error('Failed to fetch photos from Pexels:', error);
    return [];
  }
};

/**
 * Get cached image for a city or fetch & store from Pexels
 */
export const getOrFetchCityImage = async (cityId, cityName, countryName = '') => {
  try {
    // Check if city already has cover image
    const existingCityImage = await prisma.cityImage.findFirst({
      where: { cityId },
      include: { image: true },
      orderBy: { isCover: 'desc' },
    });

    if (existingCityImage?.image?.url) {
      return existingCityImage.image.url;
    }

    // Fetch from Pexels
    const searchQuery = `${cityName} ${countryName} travel landmarks`.trim();
    const photos = await fetchPhotosFromPexels(searchQuery, 3);

    if (photos.length === 0) {
      // Fallback curated travel image
      return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
    }

    // Store fetched images in database
    let coverUrl = photos[0].url;

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const isCover = i === 0;

      // Upsert Image
      const imageRecord = await prisma.image.create({
        data: {
          url: photo.url,
          source: 'PEXELS',
          sourceId: photo.sourceId,
          authorName: photo.authorName,
          authorUrl: photo.authorUrl,
          width: photo.width,
          height: photo.height,
        },
      });

      // Link to City
      await prisma.cityImage.create({
        data: {
          cityId,
          imageId: imageRecord.id,
          isCover,
          displayOrder: i,
        },
      });
    }

    return coverUrl;
  } catch (error) {
    console.error(`Error managing image for city ${cityName}:`, error);
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
  }
};
