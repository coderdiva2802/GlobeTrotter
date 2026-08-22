/**
 * Realistic mock dataset matching the PostgreSQL / Prisma database schema
 * and API Contract specifications.
 */

export const mockUser = {
  id: 1,
  name: "User",
  fullName: "Alex Morgan",
  email: "alex.morgan@globetrotter.io",
  role: "USER",
  profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  preference: {
    language: "en",
    preferredCurrency: "USD",
    budgetLevel: "MEDIUM",
    travelStyle: "ADVENTUROUS"
  }
};

export const mockRegions = [
  {
    id: "europe",
    name: "Europe",
    destinationCount: 50,
    destinationCountLabel: "50+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "Iconic historic landmarks, diverse cultures, and world-class gastronomy."
  },
  {
    id: "asia",
    name: "Asia",
    destinationCount: 60,
    destinationCountLabel: "60+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "Ancient heritage temples, vibrant night markets, and futuristic skylines."
  },
  {
    id: "north-america",
    name: "North America",
    destinationCount: 40,
    destinationCountLabel: "40+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Majestic national parks, coastal highways, and buzzing cosmopolitan hubs."
  },
  {
    id: "south-america",
    name: "South America",
    destinationCount: 30,
    destinationCountLabel: "30+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80",
    description: "Amazon rainforest wonders, Andean mountain passes, and lively carnival spirit."
  },
  {
    id: "africa",
    name: "Africa",
    destinationCount: 25,
    destinationCountLabel: "25+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    description: "Breathtaking savannah safaris, Sahara dunes, and rich cultural tapestries."
  }
];

export const mockTrips = [
  {
    id: 101,
    name: "Greek Island Escape",
    description: "Sun-soaked days exploring Cycladic architecture, Aegean sunsets, and coastal dining.",
    startDate: "2024-05-10T00:00:00.000Z",
    endDate: "2024-05-18T00:00:00.000Z",
    formattedDates: "May 10 - May 18, 2024",
    travelerCount: 2,
    travelerLabel: "2 Travelers",
    status: "COMPLETED",
    statusLabel: "Completed",
    coverImageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    locationSummary: "Santorini, Greece",
    stops: [
      { id: 1, cityName: "Santorini", countryName: "Greece", order: 1 }
    ],
    budget: 2800,
    currency: "USD"
  },
  {
    id: 102,
    name: "Maldives Getaway",
    description: "Ultimate luxury overwater villa retreat with crystal lagoons and coral reef diving.",
    startDate: "2024-02-20T00:00:00.000Z",
    endDate: "2024-02-28T00:00:00.000Z",
    formattedDates: "Feb 20 - Feb 28, 2024",
    travelerCount: 2,
    travelerLabel: "2 Travelers",
    status: "COMPLETED",
    statusLabel: "Completed",
    coverImageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    locationSummary: "Maldives",
    stops: [
      { id: 2, cityName: "Malé", countryName: "Maldives", order: 1 }
    ],
    budget: 4500,
    currency: "USD"
  },
  {
    id: 103,
    name: "Japan Adventure",
    description: "An unforgettable journey through neon Tokyo, sacred Kyoto temples, and Osaka food alleys.",
    startDate: "2024-11-10T00:00:00.000Z",
    endDate: "2024-11-28T00:00:00.000Z",
    formattedDates: "Nov 10 - Nov 28, 2024",
    travelerCount: 2,
    travelerLabel: "2 Travelers",
    status: "UPCOMING",
    statusLabel: "Upcoming",
    coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    locationSummary: "Tokyo, Kyoto, Osaka",
    stops: [
      { id: 3, cityName: "Tokyo", countryName: "Japan", order: 1 },
      { id: 4, cityName: "Kyoto", countryName: "Japan", order: 2 },
      { id: 5, cityName: "Osaka", countryName: "Japan", order: 3 }
    ],
    budget: 3800,
    currency: "USD"
  }
];
