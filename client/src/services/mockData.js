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

export const mockCities = [
  { cityId: 1, cityName: "Paris", countryName: "France", displayName: "Paris, France", region: "Europe" },
  { cityId: 2, cityName: "Tokyo", countryName: "Japan", displayName: "Tokyo, Japan", region: "Asia" },
  { cityId: 3, cityName: "Rome", countryName: "Italy", displayName: "Rome, Italy", region: "Europe" },
  { cityId: 4, cityName: "Santorini", countryName: "Greece", displayName: "Santorini, Greece", region: "Europe" },
  { cityId: 5, cityName: "Malé", countryName: "Maldives", displayName: "Malé, Maldives", region: "Asia" },
  { cityId: 6, cityName: "New York", countryName: "United States", displayName: "New York, USA", region: "North America" },
  { cityId: 9, cityName: "Cape Town", countryName: "South Africa", displayName: "Cape Town, South Africa", region: "Africa" },
  { cityId: 10, cityName: "Buenos Aires", countryName: "Argentina", displayName: "Buenos Aires, Argentina", region: "South America" },
  { cityId: 11, cityName: "Cairo", countryName: "Egypt", displayName: "Cairo, Egypt", region: "Africa" },
  { cityId: 12, cityName: "Amsterdam", countryName: "Netherlands", displayName: "Amsterdam, Netherlands", region: "Europe" },
  { cityId: 13, cityName: "Berlin", countryName: "Germany", displayName: "Berlin, Germany", region: "Europe" }
];

export const mockActivities = [
  {
    id: 501,
    name: "Louvre Museum Guided Tour",
    cityName: "Paris",
    category: "Museums & Culture",
    durationMinutes: 180,
    rating: 4.8,
    estimatedCost: 3500,
    currency: "INR",
  },
  {
    id: 502,
    name: "Eiffel Tower Summit & Seine Cruise",
    cityName: "Paris",
    category: "Sightseeing",
    durationMinutes: 120,
    rating: 4.9,
    estimatedCost: 4500,
    currency: "INR",
  },
  {
    id: 503,
    name: "Montmartre Bohemian Walking Tour",
    cityName: "Paris",
    category: "Cafés & Highlights",
    durationMinutes: 150,
    rating: 4.7,
    estimatedCost: 2000,
    currency: "INR",
  },
  {
    id: 504,
    name: "Amsterdam Canal Cruise & Wine Tasting",
    cityName: "Amsterdam",
    category: "Canals & Culture",
    durationMinutes: 90,
    rating: 4.9,
    estimatedCost: 2800,
    currency: "INR",
  },
  {
    id: 505,
    name: "Rijksmuseum Masterpieces Tour",
    cityName: "Amsterdam",
    category: "Art & History",
    durationMinutes: 120,
    rating: 4.8,
    estimatedCost: 3200,
    currency: "INR",
  },
  {
    id: 506,
    name: "Berlin Wall Memorial & Cold War Walking Tour",
    cityName: "Berlin",
    category: "History & Architecture",
    durationMinutes: 180,
    rating: 4.9,
    estimatedCost: 2500,
    currency: "INR",
  },
  {
    id: 507,
    name: "Kreuzberg Street Food & Nightlife Experience",
    cityName: "Berlin",
    category: "Food & Nightlife",
    durationMinutes: 210,
    rating: 4.8,
    estimatedCost: 3800,
    currency: "INR",
  },
];

export const mockDayWiseItinerary = {
  trip: {
    id: 105,
    name: "abc",
    status: "UPCOMING",
    locationSummary: "xyz",
    startDate: "2026-08-31",
    endDate: "2026-09-05",
    formattedDates: "2026-08-31 - 2026-09-05",
    coverImageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
  },
  budgetSummary: {
    totalBudget: 120000,
    totalBudgetFormatted: "₹1,20,000",
    plannedExpenses: 96500,
    plannedExpensesFormatted: "₹96,500",
    remainingBudget: 23500,
    remainingBudgetFormatted: "₹23,500",
    currency: "INR",
  },
  days: [
    {
      id: 1,
      dayNumber: 1,
      dayLabel: "Day 1",
      dateFormatted: "June 10",
      cityName: "Paris",
      locationHeader: "Paris • June 10",
      items: [
        { id: 1, time: "09:00 AM", activityName: "Eiffel Tower", expense: 2500, expenseFormatted: "₹2,500" },
        { id: 2, time: "01:00 PM", activityName: "Lunch at Le Marais", expense: 1800, expenseFormatted: "₹1,800" },
        { id: 3, time: "05:30 PM", activityName: "Seine River Cruise", expense: 3000, expenseFormatted: "₹3,000" },
      ],
    },
    {
      id: 2,
      dayNumber: 2,
      dayLabel: "Day 2",
      dateFormatted: "June 11",
      cityName: "Paris",
      locationHeader: "Paris • June 11",
      items: [
        { id: 4, time: "10:00 AM", activityName: "Louvre Museum", expense: 2000, expenseFormatted: "₹2,000" },
        { id: 5, time: "03:00 PM", activityName: "Montmartre Walk", expense: 0, expenseFormatted: "Free" },
        { id: 6, time: "08:00 PM", activityName: "Dinner Experience", expense: 2500, expenseFormatted: "₹2,500" },
      ],
    },
  ],
};



