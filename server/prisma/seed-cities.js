import { prisma } from '../src/lib/prisma.js';
import { getOrFetchCityImage } from '../src/services/pexels.service.js';

const initialCountriesAndCities = [
  // Europe
  {
    countryName: 'France',
    countryCode: 'FR',
    continent: 'Europe',
    cities: [
      { name: 'Paris', region: 'Île-de-France', popularityScore: 9.8, costIndex: 4, description: 'The City of Light, famous for Eiffel Tower, Louvre, and romance.' },
      { name: 'Nice', region: 'French Riviera', popularityScore: 9.1, costIndex: 4, description: 'Stunning Mediterranean coastline and Promenade des Anglais.' },
    ],
  },
  {
    countryName: 'Greece',
    countryCode: 'GR',
    continent: 'Europe',
    cities: [
      { name: 'Santorini', region: 'Cyclades', popularityScore: 9.7, costIndex: 4, description: 'Iconic whitewashed buildings, blue domes, and caldera sunsets.' },
      { name: 'Athens', region: 'Attica', popularityScore: 9.3, costIndex: 3, description: 'Historic cradle of Western civilization and ancient Acropolis.' },
    ],
  },
  {
    countryName: 'Italy',
    countryCode: 'IT',
    continent: 'Europe',
    cities: [
      { name: 'Rome', region: 'Lazio', popularityScore: 9.7, costIndex: 4, description: 'Eternal city of Colosseum, Vatican City, and gelato.' },
      { name: 'Venice', region: 'Veneto', popularityScore: 9.5, costIndex: 4, description: 'Romantic floating city of canals and gondolas.' },
    ],
  },
  // Asia
  {
    countryName: 'Japan',
    countryCode: 'JP',
    continent: 'Asia',
    cities: [
      { name: 'Tokyo', region: 'Kanto', popularityScore: 9.9, costIndex: 4, description: 'Futuristic metropolis blending neon skyscrapers and ancient shrines.' },
      { name: 'Kyoto', region: 'Kansai', popularityScore: 9.6, costIndex: 3, description: 'Cultural heart of Japan with bamboo groves and geisha districts.' },
    ],
  },
  {
    countryName: 'Maldives',
    countryCode: 'MV',
    continent: 'Asia',
    cities: [
      { name: 'Malé', region: 'Kaafu Atoll', popularityScore: 9.5, costIndex: 5, description: 'Overwater luxury villas and turquoise coral lagoons.' },
    ],
  },
  {
    countryName: 'India',
    countryCode: 'IN',
    continent: 'Asia',
    cities: [
      { name: 'Mumbai', region: 'Maharashtra', popularityScore: 9.2, costIndex: 2, description: 'Bustling coastal hub of Bollywood, Marine Drive, and heritage architecture.' },
      { name: 'Jaipur', region: 'Rajasthan', popularityScore: 9.1, costIndex: 2, description: 'The Pink City of grand palaces, forts, and royal heritage.' },
    ],
  },
  // North America
  {
    countryName: 'United States',
    countryCode: 'US',
    continent: 'North America',
    cities: [
      { name: 'New York City', region: 'New York', popularityScore: 9.8, costIndex: 4, description: 'Times Square, Central Park, Broadway, and iconic skyline.' },
      { name: 'San Francisco', region: 'California', popularityScore: 9.3, costIndex: 4, description: 'Golden Gate Bridge, cable cars, and tech innovation.' },
      { name: 'Miami', region: 'Florida', popularityScore: 9.2, costIndex: 4, description: 'Sun-soaked South Beach, Art Deco architecture, and nightlife.' },
    ],
  },
  {
    countryName: 'Canada',
    countryCode: 'CA',
    continent: 'North America',
    cities: [
      { name: 'Vancouver', region: 'British Columbia', popularityScore: 9.4, costIndex: 4, description: 'Scenic Pacific harbor backdrop, Stanley Park, and snowcapped peaks.' },
    ],
  },
  // South America
  {
    countryName: 'Peru',
    countryCode: 'PE',
    continent: 'South America',
    cities: [
      { name: 'Cusco', region: 'Andes', popularityScore: 9.4, costIndex: 2, description: 'Gateway to Machu Picchu and ancient Inca Empire sanctuary.' },
      { name: 'Lima', region: 'Pacific Coast', popularityScore: 9.0, costIndex: 2, description: 'Gastronomic capital of South America with coastal cliffs.' },
    ],
  },
  {
    countryName: 'Brazil',
    countryCode: 'BR',
    continent: 'South America',
    cities: [
      { name: 'Rio de Janeiro', region: 'Southeast', popularityScore: 9.6, costIndex: 3, description: 'Christ the Redeemer, Copacabana beach, and vibrant Carnival culture.' },
    ],
  },
  {
    countryName: 'Argentina',
    countryCode: 'AR',
    continent: 'South America',
    cities: [
      { name: 'Buenos Aires', region: 'Pampas', popularityScore: 9.2, costIndex: 2, description: 'Paris of South America, famous for Tango, steak, and historic plazas.' },
    ],
  },
  // Africa
  {
    countryName: 'Egypt',
    countryCode: 'EG',
    continent: 'Africa',
    cities: [
      { name: 'Cairo', region: 'Greater Cairo', popularityScore: 9.3, costIndex: 2, description: 'Great Pyramids of Giza, the Sphinx, and Nile cruises.' },
    ],
  },
  {
    countryName: 'South Africa',
    countryCode: 'ZA',
    continent: 'Africa',
    cities: [
      { name: 'Cape Town', region: 'Western Cape', popularityScore: 9.6, costIndex: 3, description: 'Dramatic Table Mountain, coastal vineyards, and Penguin boulders.' },
    ],
  },
  {
    countryName: 'Morocco',
    countryCode: 'MA',
    continent: 'Africa',
    cities: [
      { name: 'Marrakech', region: 'Marrakesh-Safi', popularityScore: 9.4, costIndex: 2, description: 'Historic Medina souks, red clay architecture, and Atlas Mountains.' },
    ],
  },
  // Oceania
  {
    countryName: 'Australia',
    countryCode: 'AU',
    continent: 'Oceania',
    cities: [
      { name: 'Sydney', region: 'New South Wales', popularityScore: 9.7, costIndex: 4, description: 'Sydney Opera House, Harbor Bridge, and Bondi Beach.' },
      { name: 'Melbourne', region: 'Victoria', popularityScore: 9.4, costIndex: 4, description: 'Cultural capital of laneways, street art, and specialty coffee.' },
    ],
  },
  {
    countryName: 'New Zealand',
    countryCode: 'NZ',
    continent: 'Oceania',
    cities: [
      { name: 'Queenstown', region: 'Otago', popularityScore: 9.5, costIndex: 4, description: 'Adventure capital of alpine lakes, skiing, and bungy jumping.' },
    ],
  },
];

async function seedCitiesAndImages() {
  console.log('🏙️ Seeding cities and fetching Pexels images...\n');

  for (const cData of initialCountriesAndCities) {
    const country = await prisma.country.upsert({
      where: { code: cData.countryCode },
      update: { name: cData.countryName, continent: cData.continent },
      create: {
        name: cData.countryName,
        code: cData.countryCode,
        continent: cData.continent,
      },
    });

    for (const cityInfo of cData.cities) {
      const existingCity = await prisma.city.findFirst({
        where: { name: cityInfo.name, countryId: country.id },
      });

      let city = existingCity;

      if (!city) {
        city = await prisma.city.create({
          data: {
            countryId: country.id,
            name: cityInfo.name,
            region: cityInfo.region,
            description: cityInfo.description,
            popularityScore: cityInfo.popularityScore,
            costIndex: cityInfo.costIndex,
          },
        });
      }

      // Fetch Pexels Image
      const imageUrl = await getOrFetchCityImage(city.id, city.name, country.name);
      console.log(`✅ City: ${city.name}, ${country.name} -> Cover Image: ${imageUrl.substring(0, 60)}...`);
    }
  }

  console.log('\n🎉 Cities and Pexels images seeded successfully!');
}

seedCitiesAndImages()
  .catch((e) => console.error('Error seeding cities:', e))
  .finally(async () => await prisma.$disconnect());
