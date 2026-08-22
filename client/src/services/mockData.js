/**
 * Comprehensive travel planning mock dataset matching the PostgreSQL / Prisma database schema.
 * Focuses on destinations, activities, sights, tours, experiences, and curated packages.
 */

export const getDestinationCoverImage = (destination = '') => {
  const d = (destination || '').toLowerCase();
  if (d.includes('bali') || d.includes('indonesia')) {
    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('goa')) {
    return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('kerala') || d.includes('munnar') || d.includes('alleppey')) {
    return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('jaipur') || d.includes('rajasthan')) {
    return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('delhi')) {
    return 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('agra') || d.includes('taj')) {
    return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('dubai') || d.includes('uae')) {
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('tokyo') || d.includes('japan')) {
    return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('kyoto')) {
    return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('paris') || d.includes('france')) {
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('rome') || d.includes('italy')) {
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('mumbai')) {
    return 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('varanasi')) {
    return 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('udaipur')) {
    return 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('manali')) {
    return 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('ladakh')) {
    return 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('amsterdam')) {
    return 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80';
  }
  if (d.includes('berlin')) {
    return 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80';
};

export const mockUser = {
  id: 1,
  name: "User",
  fullName: "Alex Morgan",
  email: "alex.morgan@globetrotter.io",
  role: "USER",
  profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  preference: {
    language: "en",
    preferredCurrency: "INR",
    budgetLevel: "MEDIUM",
    travelStyle: "ADVENTUROUS"
  }
};

export const mockRegions = [
  {
    id: "india",
    name: "India",
    destinationCount: 35,
    destinationCountLabel: "35+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
    description: "Royal palaces, spiritual ghats, tranquil backwaters, and majestic Himalayan peaks.",
    popularCities: ["Jaipur", "Goa", "Kerala", "Delhi", "Agra", "Varanasi", "Udaipur", "Manali"]
  },
  {
    id: "europe",
    name: "Europe",
    destinationCount: 50,
    destinationCountLabel: "50+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "Iconic historic landmarks, diverse cultures, and world-class gastronomy.",
    popularCities: ["Paris", "Rome", "Santorini", "Amsterdam", "Berlin", "London"]
  },
  {
    id: "asia",
    name: "Asia & Middle East",
    destinationCount: 60,
    destinationCountLabel: "60+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "Futuristic skylines, desert adventures, ancient temples, and tropical islands.",
    popularCities: ["Tokyo", "Kyoto", "Dubai", "Bali", "Bangkok", "Singapore", "Malé"]
  },
  {
    id: "north-america",
    name: "North America",
    destinationCount: 40,
    destinationCountLabel: "40+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Majestic national parks, coastal highways, and buzzing cosmopolitan hubs.",
    popularCities: ["New York", "San Francisco", "Vancouver", "Los Angeles"]
  },
  {
    id: "africa",
    name: "Africa",
    destinationCount: 25,
    destinationCountLabel: "25+ Destinations",
    coverImageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    description: "Breathtaking savannah safaris, Sahara dunes, and ancient pyramid wonders.",
    popularCities: ["Cairo", "Cape Town", "Marrakech", "Nairobi", "Zanzibar"]
  }
];

export const mockCities = [
  // --- India ---
  { cityId: 101, cityName: "Jaipur", countryName: "India", displayName: "Jaipur, Rajasthan, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80" },
  { cityId: 102, cityName: "Goa", countryName: "India", displayName: "Goa, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80" },
  { cityId: 103, cityName: "Kerala (Munnar & Alleppey)", countryName: "India", displayName: "Kerala, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80" },
  { cityId: 104, cityName: "Delhi", countryName: "India", displayName: "Delhi, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80" },
  { cityId: 105, cityName: "Agra", countryName: "India", displayName: "Agra, Uttar Pradesh, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80" },
  { cityId: 106, cityName: "Mumbai", countryName: "India", displayName: "Mumbai, Maharashtra, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80" },
  { cityId: 107, cityName: "Varanasi", countryName: "India", displayName: "Varanasi, Uttar Pradesh, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80" },
  { cityId: 108, cityName: "Udaipur", countryName: "India", displayName: "Udaipur, Rajasthan, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80" },
  { cityId: 109, cityName: "Manali", countryName: "India", displayName: "Manali, Himachal Pradesh, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80" },
  { cityId: 110, cityName: "Ladakh", countryName: "India", displayName: "Leh Ladakh, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80" },
  { cityId: 111, cityName: "Bengaluru", countryName: "India", displayName: "Bengaluru, Karnataka, India", region: "India", coverImageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80" },

  // --- International ---
  { cityId: 1, cityName: "Paris", countryName: "France", displayName: "Paris, France", region: "Europe", coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
  { cityId: 2, cityName: "Tokyo", countryName: "Japan", displayName: "Tokyo, Japan", region: "Asia", coverImageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" },
  { cityId: 3, cityName: "Rome", countryName: "Italy", displayName: "Rome, Italy", region: "Europe", coverImageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80" },
  { cityId: 4, cityName: "Dubai", countryName: "United Arab Emirates", displayName: "Dubai, UAE", region: "Asia", coverImageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" },
  { cityId: 5, cityName: "Bali", countryName: "Indonesia", displayName: "Bali, Indonesia", region: "Asia", coverImageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80" },
  { cityId: 6, cityName: "Kyoto", countryName: "Japan", displayName: "Kyoto, Japan", region: "Asia", coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" },
  { cityId: 7, cityName: "London", countryName: "United Kingdom", displayName: "London, UK", region: "Europe", coverImageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80" },
  { cityId: 8, cityName: "Singapore", countryName: "Singapore", displayName: "Singapore", region: "Asia", coverImageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80" },
  { cityId: 9, cityName: "Bangkok", countryName: "Thailand", displayName: "Bangkok, Thailand", region: "Asia", coverImageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80" },
  { cityId: 10, cityName: "Santorini", countryName: "Greece", displayName: "Santorini, Greece", region: "Europe", coverImageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80" },
  { cityId: 11, cityName: "Malé", countryName: "Maldives", displayName: "Malé, Maldives", region: "Asia", coverImageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80" },
  { cityId: 12, cityName: "Amsterdam", countryName: "Netherlands", displayName: "Amsterdam, Netherlands", region: "Europe", coverImageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80" },
  { cityId: 13, cityName: "Berlin", countryName: "Germany", displayName: "Berlin, Germany", region: "Europe", coverImageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80" },
  { cityId: 14, cityName: "New York", countryName: "United States", displayName: "New York, USA", region: "North America", coverImageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" },
  { cityId: 15, cityName: "Cairo", countryName: "Egypt", displayName: "Cairo, Egypt", region: "Africa", coverImageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80" }
];

export const mockActivities = [
  // ================= INDIA ACTIVITIES =================
  // Jaipur
  { id: 1001, name: "Amer Fort & Elephant Safari", cityName: "Jaipur", countryName: "India", category: "Heritage & Culture", durationMinutes: 180, rating: 4.9, estimatedCost: 2800, currency: "INR" },
  { id: 1002, name: "Hawa Mahal & City Palace Tour", cityName: "Jaipur", countryName: "India", category: "Sightseeing", durationMinutes: 120, rating: 4.8, estimatedCost: 1800, currency: "INR" },
  { id: 1003, name: "Chokhi Dhani Rajasthani Cultural Dinner", cityName: "Jaipur", countryName: "India", category: "Food & Nightlife", durationMinutes: 240, rating: 4.7, estimatedCost: 2500, currency: "INR" },
  { id: 1004, name: "Jantar Mantar & Johari Bazaar Walk", cityName: "Jaipur", countryName: "India", category: "Heritage & Culture", durationMinutes: 150, rating: 4.6, estimatedCost: 1200, currency: "INR" },
  { id: 1005, name: "Nahargarh Fort Sunset View & Dinner", cityName: "Jaipur", countryName: "India", category: "Sightseeing", durationMinutes: 150, rating: 4.9, estimatedCost: 1600, currency: "INR" },

  // Delhi
  { id: 1010, name: "Red Fort & Chandni Chowk Food Crawl", cityName: "Delhi", countryName: "India", category: "Food & Nightlife", durationMinutes: 200, rating: 4.9, estimatedCost: 2400, currency: "INR" },
  { id: 1011, name: "Qutub Minar & Mehrauli Heritage Park", cityName: "Delhi", countryName: "India", category: "Heritage & Culture", durationMinutes: 150, rating: 4.8, estimatedCost: 1800, currency: "INR" },
  { id: 1012, name: "Humayun's Tomb & Sunder Nursery Walk", cityName: "Delhi", countryName: "India", category: "Sightseeing", durationMinutes: 120, rating: 4.8, estimatedCost: 1500, currency: "INR" },
  { id: 1013, name: "Akshardham Temple Water Show & Exhibition", cityName: "Delhi", countryName: "India", category: "Heritage & Culture", durationMinutes: 180, rating: 4.9, estimatedCost: 1200, currency: "INR" },

  // Agra
  { id: 1020, name: "Taj Mahal Sunrise Guided Experience", cityName: "Agra", countryName: "India", category: "Sightseeing", durationMinutes: 180, rating: 5.0, estimatedCost: 3200, currency: "INR" },
  { id: 1021, name: "Agra Fort & Mughal History Walk", cityName: "Agra", countryName: "India", category: "Heritage & Culture", durationMinutes: 120, rating: 4.8, estimatedCost: 2000, currency: "INR" },
  { id: 1022, name: "Mehtab Bagh Sunset Taj View & Tea", cityName: "Agra", countryName: "India", category: "Sightseeing", durationMinutes: 90, rating: 4.7, estimatedCost: 1000, currency: "INR" },

  // Goa
  { id: 1030, name: "Calangute & Baga Scuba Diving + Watersports", cityName: "Goa", countryName: "India", category: "Adventure & Nature", durationMinutes: 240, rating: 4.8, estimatedCost: 4500, currency: "INR" },
  { id: 1031, name: "Mandovi River Luxury Catamaran Sunset Cruise", cityName: "Goa", countryName: "India", category: "Sightseeing", durationMinutes: 120, rating: 4.9, estimatedCost: 3000, currency: "INR" },
  { id: 1032, name: "Old Goa Heritage Churches & Spice Plantation", cityName: "Goa", countryName: "India", category: "Heritage & Culture", durationMinutes: 210, rating: 4.7, estimatedCost: 2200, currency: "INR" },
  { id: 1033, name: "Dudhsagar Waterfalls & Jungle Jeep Safari", cityName: "Goa", countryName: "India", category: "Adventure & Nature", durationMinutes: 360, rating: 4.9, estimatedCost: 3800, currency: "INR" },

  // Kerala
  { id: 1040, name: "Alleppey Luxury Houseboat Day Cruise & Meals", cityName: "Kerala (Munnar & Alleppey)", countryName: "India", category: "Adventure & Nature", durationMinutes: 300, rating: 4.9, estimatedCost: 5500, currency: "INR" },
  { id: 1041, name: "Munnar Tea Gardens & Eravikulam Trek", cityName: "Kerala (Munnar & Alleppey)", countryName: "India", category: "Adventure & Nature", durationMinutes: 240, rating: 4.8, estimatedCost: 3200, currency: "INR" },
  { id: 1042, name: "Kathakali Classical Dance & Kalaripayattu Show", cityName: "Kerala (Munnar & Alleppey)", countryName: "India", category: "Heritage & Culture", durationMinutes: 120, rating: 4.8, estimatedCost: 1800, currency: "INR" },
  { id: 1043, name: "Periyar Wildlife Sanctuary Bamboo Rafting", cityName: "Kerala (Munnar & Alleppey)", countryName: "India", category: "Adventure & Nature", durationMinutes: 210, rating: 4.7, estimatedCost: 3500, currency: "INR" },

  // Mumbai
  { id: 1050, name: "Gateway of India & Elephanta Caves Speedboat", cityName: "Mumbai", countryName: "India", category: "Sightseeing", durationMinutes: 240, rating: 4.8, estimatedCost: 2500, currency: "INR" },
  { id: 1051, name: "Marine Drive & South Bombay Street Food Walk", cityName: "Mumbai", countryName: "India", category: "Food & Nightlife", durationMinutes: 150, rating: 4.9, estimatedCost: 1800, currency: "INR" },
  { id: 1052, name: "Bollywood Studio Behind-the-Scenes Tour", cityName: "Mumbai", countryName: "India", category: "Heritage & Culture", durationMinutes: 180, rating: 4.6, estimatedCost: 3500, currency: "INR" },

  // Varanasi
  { id: 1060, name: "Ganga Aarti Private Sunrise & Evening Boat Ride", cityName: "Varanasi", countryName: "India", category: "Heritage & Culture", durationMinutes: 150, rating: 5.0, estimatedCost: 2000, currency: "INR" },
  { id: 1061, name: "Sarnath Buddhist Monasteries Excursion", cityName: "Varanasi", countryName: "India", category: "Heritage & Culture", durationMinutes: 180, rating: 4.8, estimatedCost: 1600, currency: "INR" },

  // Udaipur
  { id: 1070, name: "Lake Pichola Sunset Boat Cruise & Jag Mandir", cityName: "Udaipur", countryName: "India", category: "Sightseeing", durationMinutes: 120, rating: 4.9, estimatedCost: 2800, currency: "INR" },
  { id: 1071, name: "City Palace Museum & Crystal Gallery", cityName: "Udaipur", countryName: "India", category: "Heritage & Culture", durationMinutes: 180, rating: 4.8, estimatedCost: 2200, currency: "INR" },

  // Manali & Ladakh
  { id: 1080, name: "Solang Valley Paragliding & Zipline Adventure", cityName: "Manali", countryName: "India", category: "Adventure & Nature", durationMinutes: 200, rating: 4.9, estimatedCost: 4500, currency: "INR" },
  { id: 1081, name: "Rohtang Pass Snow Excursion", cityName: "Manali", countryName: "India", category: "Adventure & Nature", durationMinutes: 360, rating: 4.8, estimatedCost: 5000, currency: "INR" },
  { id: 1090, name: "Pangong Tso Lake & Chang La Pass Jeep Expedition", cityName: "Ladakh", countryName: "India", category: "Adventure & Nature", durationMinutes: 480, rating: 5.0, estimatedCost: 6500, currency: "INR" },
  { id: 1091, name: "Nubra Valley Double-Humped Camel Safari", cityName: "Ladakh", countryName: "India", category: "Adventure & Nature", durationMinutes: 300, rating: 4.9, estimatedCost: 4500, currency: "INR" },

  // ================= INTERNATIONAL ACTIVITIES =================
  // Paris
  { id: 501, name: "Louvre Museum Priority Guided Tour", cityName: "Paris", countryName: "France", category: "Heritage & Culture", durationMinutes: 180, rating: 4.8, estimatedCost: 4500, currency: "INR" },
  { id: 502, name: "Eiffel Tower Summit & Seine Dinner Cruise", cityName: "Paris", countryName: "France", category: "Sightseeing", durationMinutes: 150, rating: 4.9, estimatedCost: 6200, currency: "INR" },
  { id: 503, name: "Montmartre Bohemian Walking Tour & Macarons", cityName: "Paris", countryName: "France", category: "Food & Nightlife", durationMinutes: 150, rating: 4.7, estimatedCost: 3200, currency: "INR" },
  { id: 504, name: "Palace of Versailles Hall of Mirrors & Gardens", cityName: "Paris", countryName: "France", category: "Heritage & Culture", durationMinutes: 240, rating: 4.9, estimatedCost: 4800, currency: "INR" },

  // Tokyo
  { id: 510, name: "Shibuya Crossing & Harajuku Hidden Alleys", cityName: "Tokyo", countryName: "Japan", category: "Sightseeing", durationMinutes: 180, rating: 4.9, estimatedCost: 4000, currency: "INR" },
  { id: 511, name: "teamLab Planets Immersive Digital Art Museum", cityName: "Tokyo", countryName: "Japan", category: "Heritage & Culture", durationMinutes: 120, rating: 4.9, estimatedCost: 4500, currency: "INR" },
  { id: 512, name: "Mt. Fuji & Hakone Hot Springs Day Tour", cityName: "Tokyo", countryName: "Japan", category: "Adventure & Nature", durationMinutes: 480, rating: 5.0, estimatedCost: 9500, currency: "INR" },
  { id: 513, name: "Tsukiji Outer Fish Market Street Food Crawl", cityName: "Tokyo", countryName: "Japan", category: "Food & Nightlife", durationMinutes: 150, rating: 4.8, estimatedCost: 3500, currency: "INR" },

  // Kyoto
  { id: 520, name: "Fushimi Inari 10,000 Torii Gates Sunrise Hike", cityName: "Kyoto", countryName: "Japan", category: "Heritage & Culture", durationMinutes: 150, rating: 4.9, estimatedCost: 2500, currency: "INR" },
  { id: 521, name: "Arashiyama Bamboo Grove & Monkey Forest", cityName: "Kyoto", countryName: "Japan", category: "Adventure & Nature", durationMinutes: 180, rating: 4.8, estimatedCost: 3200, currency: "INR" },
  { id: 522, name: "Traditional Gion Tea Ceremony Experience", cityName: "Kyoto", countryName: "Japan", category: "Heritage & Culture", durationMinutes: 90, rating: 4.9, estimatedCost: 3800, currency: "INR" },

  // Dubai
  { id: 530, name: "Burj Khalifa 124th Floor + Fountain Show", cityName: "Dubai", countryName: "United Arab Emirates", category: "Sightseeing", durationMinutes: 120, rating: 4.9, estimatedCost: 5500, currency: "INR" },
  { id: 531, name: "Premium Red Dunes Desert Safari + BBQ Dinner", cityName: "Dubai", countryName: "United Arab Emirates", category: "Adventure & Nature", durationMinutes: 360, rating: 5.0, estimatedCost: 4800, currency: "INR" },
  { id: 532, name: "Dubai Marina Luxury Yacht Shared Cruise", cityName: "Dubai", countryName: "United Arab Emirates", category: "Sightseeing", durationMinutes: 120, rating: 4.8, estimatedCost: 4200, currency: "INR" },

  // Bali
  { id: 540, name: "Ubud Monkey Forest, Rice Terraces & Jungle Swing", cityName: "Bali", countryName: "Indonesia", category: "Adventure & Nature", durationMinutes: 300, rating: 4.9, estimatedCost: 3600, currency: "INR" },
  { id: 541, name: "Uluwatu Sunset Temple & Kecak Fire Dance", cityName: "Bali", countryName: "Indonesia", category: "Heritage & Culture", durationMinutes: 180, rating: 4.8, estimatedCost: 3000, currency: "INR" },
  { id: 542, name: "Nusa Penida Island Speedboat Snorkel Tour", cityName: "Bali", countryName: "Indonesia", category: "Adventure & Nature", durationMinutes: 480, rating: 4.9, estimatedCost: 5500, currency: "INR" },

  // Rome
  { id: 550, name: "Colosseum, Roman Forum & Palatine Hill VIP Tour", cityName: "Rome", countryName: "Italy", category: "Heritage & Culture", durationMinutes: 200, rating: 4.9, estimatedCost: 5200, currency: "INR" },
  { id: 551, name: "Vatican Museums, Sistine Chapel & St. Peter's", cityName: "Rome", countryName: "Italy", category: "Heritage & Culture", durationMinutes: 210, rating: 4.9, estimatedCost: 5800, currency: "INR" },
  { id: 552, name: "Trastevere Evening Walking Pasta & Gelato Tour", cityName: "Rome", countryName: "Italy", category: "Food & Nightlife", durationMinutes: 180, rating: 4.8, estimatedCost: 4200, currency: "INR" },

  // Amsterdam
  { id: 560, name: "Amsterdam Canal Cruise & Wine Tasting", cityName: "Amsterdam", countryName: "Netherlands", category: "Sightseeing", durationMinutes: 90, rating: 4.9, estimatedCost: 3800, currency: "INR" },
  { id: 561, name: "Rijksmuseum & Van Gogh Museum Highlights", cityName: "Amsterdam", countryName: "Netherlands", category: "Heritage & Culture", durationMinutes: 210, rating: 4.8, estimatedCost: 5200, currency: "INR" },

  // Berlin
  { id: 570, name: "Berlin Wall Memorial & Cold War Walking Tour", cityName: "Berlin", countryName: "Germany", category: "Heritage & Culture", durationMinutes: 180, rating: 4.9, estimatedCost: 3200, currency: "INR" },
  { id: 571, name: "Kreuzberg Street Food & Nightlife Experience", cityName: "Berlin", countryName: "Germany", category: "Food & Nightlife", durationMinutes: 210, rating: 4.8, estimatedCost: 4000, currency: "INR" }
];

/**
 * Curated Holiday Packages:
 * All inclusions and stops are strictly backed by mockActivities with realistic planned expenses.
 */
export const mockHolidayPackages = [
  {
    id: "pkg-golden-triangle",
    title: "Golden Triangle Heritage Expedition",
    destination: "Delhi • Agra • Jaipur, India",
    category: "India Heritage & Hills",
    tag: "Bestseller",
    badgeColor: "#f59e0b",
    rating: 4.9,
    reviewsCount: 342,
    durationDays: 6,
    durationNights: 5,
    formattedDuration: "6 Days / 5 Nights",
    basePricePerPerson: 32000,
    discountedPrice: 24999,
    currency: "INR",
    coverImageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "Taj Mahal Sunrise Guided Experience",
      "Amer Fort & Elephant Safari",
      "Chokhi Dhani Rajasthani Cultural Dinner",
      "Red Fort & Chandni Chowk Food Crawl"
    ],
    routeSummary: "Delhi (2N) → Agra (1N) → Jaipur (2N)",
    description: "Explore the royal soul of India spanning the Mughal architecture of Delhi & Agra to the vibrant Pink City forts of Jaipur.",
    presetStops: [
      {
        id: 1,
        cityName: "Delhi",
        countryName: "India",
        dateRange: "Day 1 - Day 2",
        budgetPerPerson: 7500,
        budget: 7500,
        notes: "Red Fort & Chandni Chowk Food Crawl, Qutub Minar & Mehrauli Heritage Park, Humayun's Tomb Walk",
        selectedActivities: [
          mockActivities.find((a) => a.id === 1010),
          mockActivities.find((a) => a.id === 1011),
          mockActivities.find((a) => a.id === 1012),
        ].filter(Boolean),
      },
      {
        id: 2,
        cityName: "Agra",
        countryName: "India",
        dateRange: "Day 3",
        budgetPerPerson: 6500,
        budget: 6500,
        notes: "Taj Mahal Sunrise Guided Experience, Agra Fort & Mughal History Walk, Mehtab Bagh Sunset",
        selectedActivities: [
          mockActivities.find((a) => a.id === 1020),
          mockActivities.find((a) => a.id === 1021),
          mockActivities.find((a) => a.id === 1022),
        ].filter(Boolean),
      },
      {
        id: 3,
        cityName: "Jaipur",
        countryName: "India",
        dateRange: "Day 4 - Day 6",
        budgetPerPerson: 10999,
        budget: 10999,
        notes: "Amer Fort & Elephant Safari, Hawa Mahal & City Palace, Chokhi Dhani Rajasthani Cultural Dinner",
        selectedActivities: [
          mockActivities.find((a) => a.id === 1001),
          mockActivities.find((a) => a.id === 1002),
          mockActivities.find((a) => a.id === 1003),
        ].filter(Boolean),
      },
    ],
  },
  {
    id: "pkg-kerala-backwaters",
    title: "Kerala Backwaters, Hills & Tea Romance",
    destination: "Munnar • Alleppey, India",
    category: "India Heritage & Hills",
    tag: "Top Rated",
    badgeColor: "#10b981",
    rating: 4.9,
    reviewsCount: 289,
    durationDays: 5,
    durationNights: 4,
    formattedDuration: "5 Days / 4 Nights",
    basePricePerPerson: 26000,
    discountedPrice: 19999,
    currency: "INR",
    coverImageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "Alleppey Luxury Houseboat Day Cruise & Meals",
      "Munnar Tea Gardens & Eravikulam Trek",
      "Kathakali Classical Dance & Kalaripayattu Show",
      "Periyar Wildlife Sanctuary Bamboo Rafting"
    ],
    routeSummary: "Munnar (2N) → Thekkady (1N) → Alleppey (1N)",
    description: "Relax amidst mist-clad hills of Munnar, aromatic spice gardens, and serene palm-fringed backwaters of Alleppey.",
    presetStops: [
      {
        id: 1,
        cityName: "Kerala (Munnar & Alleppey)",
        countryName: "India",
        dateRange: "Day 1 - Day 3",
        budgetPerPerson: 11000,
        budget: 11000,
        notes: "Munnar Tea Gardens & Eravikulam Trek, Kathakali Classical Dance Show, Periyar Bamboo Rafting",
        selectedActivities: [
          mockActivities.find((a) => a.id === 1041),
          mockActivities.find((a) => a.id === 1042),
          mockActivities.find((a) => a.id === 1043),
        ].filter(Boolean),
      },
      {
        id: 2,
        cityName: "Kerala (Munnar & Alleppey)",
        countryName: "India",
        dateRange: "Day 4 - Day 5",
        budgetPerPerson: 8999,
        budget: 8999,
        notes: "Alleppey Luxury Houseboat Day Cruise & Meals",
        selectedActivities: [
          mockActivities.find((a) => a.id === 1040),
        ].filter(Boolean),
      },
    ],
  },
  {
    id: "pkg-goa-beach",
    title: "Goa Beach, Watersports & Catamaran Getaway",
    destination: "North Goa • South Goa, India",
    category: "Beach & Island",
    tag: "Trending",
    badgeColor: "#3b82f6",
    rating: 4.8,
    reviewsCount: 412,
    durationDays: 4,
    durationNights: 3,
    formattedDuration: "4 Days / 3 Nights",
    basePricePerPerson: 20000,
    discountedPrice: 15999,
    currency: "INR",
    coverImageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "Calangute & Baga Scuba Diving + Watersports",
      "Mandovi River Luxury Catamaran Sunset Cruise",
      "Dudhsagar Waterfalls & Jungle Jeep Safari",
      "Old Goa Heritage Churches & Spice Plantation"
    ],
    routeSummary: "Calangute (2N) → Candolim / South Goa (1N)",
    description: "Sun, sand, scuba diving, vibrant beach shacks, and romantic sunset cruises along the Arabian Sea.",
    presetStops: [
      {
        id: 1,
        cityName: "Goa",
        countryName: "India",
        dateRange: "Day 1 - Day 2",
        budgetPerPerson: 8500,
        budget: 8500,
        notes: "Calangute & Baga Scuba Diving + Watersports, Old Goa Heritage Churches",
        selectedActivities: [
          mockActivities.find((a) => a.id === 1030),
          mockActivities.find((a) => a.id === 1032),
        ].filter(Boolean),
      },
      {
        id: 2,
        cityName: "Goa",
        countryName: "India",
        dateRange: "Day 3 - Day 4",
        budgetPerPerson: 7499,
        budget: 7499,
        notes: "Mandovi River Luxury Catamaran Sunset Cruise, Dudhsagar Waterfalls Safari",
        selectedActivities: [
          mockActivities.find((a) => a.id === 1031),
          mockActivities.find((a) => a.id === 1033),
        ].filter(Boolean),
      },
    ],
  },
  {
    id: "pkg-dubai-highlights",
    title: "Dubai Skyline & Desert Safari Extravaganza",
    destination: "Dubai, UAE",
    category: "International Escapes",
    tag: "Luxury Pick",
    badgeColor: "#8b5cf6",
    rating: 4.9,
    reviewsCount: 198,
    durationDays: 5,
    durationNights: 4,
    formattedDuration: "5 Days / 4 Nights",
    basePricePerPerson: 45000,
    discountedPrice: 36999,
    currency: "INR",
    coverImageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "Burj Khalifa 124th Floor + Fountain Show",
      "Premium Red Dunes Desert Safari + BBQ Dinner",
      "Dubai Marina Luxury Yacht Shared Cruise"
    ],
    routeSummary: "Downtown Dubai (3N) → Dubai Marina (1N)",
    description: "Experience the glitz of futuristic Dubai, towering skyscrapers, luxury marina yachts, and golden desert dunes.",
    presetStops: [
      {
        id: 1,
        cityName: "Dubai",
        countryName: "United Arab Emirates",
        dateRange: "Day 1 - Day 3",
        budgetPerPerson: 20000,
        budget: 20000,
        notes: "Burj Khalifa 124th Floor, Premium Red Dunes Desert Safari + BBQ",
        selectedActivities: [
          mockActivities.find((a) => a.id === 530),
          mockActivities.find((a) => a.id === 531),
        ].filter(Boolean),
      },
      {
        id: 2,
        cityName: "Dubai",
        countryName: "United Arab Emirates",
        dateRange: "Day 4 - Day 5",
        budgetPerPerson: 16999,
        budget: 16999,
        notes: "Dubai Marina Luxury Yacht Shared Cruise",
        selectedActivities: [
          mockActivities.find((a) => a.id === 532),
        ].filter(Boolean),
      },
    ],
  },
  {
    id: "pkg-bali-escape",
    title: "Bali Tropical Paradise, Waterfalls & Islands",
    destination: "Bali, Indonesia",
    category: "Beach & Island",
    tag: "Popular",
    badgeColor: "#06b6d4",
    rating: 4.8,
    reviewsCount: 265,
    durationDays: 6,
    durationNights: 5,
    formattedDuration: "6 Days / 5 Nights",
    basePricePerPerson: 32000,
    discountedPrice: 24999,
    currency: "INR",
    coverImageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "Ubud Monkey Forest, Rice Terraces & Jungle Swing",
      "Nusa Penida Island Speedboat Snorkel Tour",
      "Uluwatu Sunset Temple & Kecak Fire Dance"
    ],
    routeSummary: "Ubud (3N) → Seminyak (2N)",
    description: "Explore lush terraced rice fields, sacred monkey temples, iconic cliffside Kecak dances, and turquoise island coves.",
    presetStops: [
      {
        id: 1,
        cityName: "Bali",
        countryName: "Indonesia",
        dateRange: "Day 1 - Day 3",
        budgetPerPerson: 12500,
        budget: 12500,
        notes: "Ubud Monkey Forest, Rice Terraces & Jungle Swing",
        selectedActivities: [
          mockActivities.find((a) => a.id === 540),
        ].filter(Boolean),
      },
      {
        id: 2,
        cityName: "Bali",
        countryName: "Indonesia",
        dateRange: "Day 4 - Day 6",
        budgetPerPerson: 12499,
        budget: 12499,
        notes: "Nusa Penida Island Speedboat Tour, Uluwatu Sunset Temple & Fire Dance",
        selectedActivities: [
          mockActivities.find((a) => a.id === 541),
          mockActivities.find((a) => a.id === 542),
        ].filter(Boolean),
      },
    ],
  },
  {
    id: "pkg-japan-classic",
    title: "Japan Sakura, Neon Skylines & Historic Temples",
    destination: "Tokyo • Kyoto, Japan",
    category: "International Escapes",
    tag: "Cultural Grandeur",
    badgeColor: "#ec4899",
    rating: 4.9,
    reviewsCount: 176,
    durationDays: 7,
    durationNights: 6,
    formattedDuration: "7 Days / 6 Nights",
    basePricePerPerson: 85000,
    discountedPrice: 69999,
    currency: "INR",
    coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    inclusions: [
      "teamLab Planets Immersive Digital Art Museum",
      "Mt. Fuji & Hakone Hot Springs Day Tour",
      "Fushimi Inari 10,000 Torii Gates Sunrise Hike",
      "Traditional Gion Tea Ceremony Experience"
    ],
    routeSummary: "Tokyo (3N) → Kyoto (3N)",
    description: "Immerse in Japan's harmony of futuristic technology in Tokyo, serene bamboo groves and golden shrines in Kyoto, and Mount Fuji vistas.",
    presetStops: [
      {
        id: 1,
        cityName: "Tokyo",
        countryName: "Japan",
        dateRange: "Day 1 - Day 3",
        budgetPerPerson: 35000,
        budget: 35000,
        notes: "teamLab Planets Immersive Art Museum, Mt. Fuji & Hakone Day Tour, Shibuya Crossing",
        selectedActivities: [
          mockActivities.find((a) => a.id === 510),
          mockActivities.find((a) => a.id === 511),
          mockActivities.find((a) => a.id === 512),
        ].filter(Boolean),
      },
      {
        id: 2,
        cityName: "Kyoto",
        countryName: "Japan",
        dateRange: "Day 4 - Day 6",
        budgetPerPerson: 34999,
        budget: 34999,
        notes: "Fushimi Inari Torii Gates Hike, Traditional Gion Tea Ceremony, Arashiyama Bamboo Grove",
        selectedActivities: [
          mockActivities.find((a) => a.id === 520),
          mockActivities.find((a) => a.id === 521),
          mockActivities.find((a) => a.id === 522),
        ].filter(Boolean),
      },
    ],
  },
];

export const mockTrips = [
  {
    id: 101,
    name: "Golden Triangle Heritage Odyssey",
    description: "Royal journey exploring Delhi's historic monuments, sunrise at the Taj Mahal, and Jaipur's pink palaces.",
    startDate: "2025-10-15T00:00:00.000Z",
    endDate: "2025-10-21T00:00:00.000Z",
    formattedDates: "Oct 15 - Oct 21, 2025",
    travelerCount: 2,
    travelerLabel: "2 Travelers",
    status: "UPCOMING",
    statusLabel: "Upcoming",
    coverImageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    locationSummary: "Delhi, Agra, Jaipur, India",
    stops: [
      { id: 1, cityName: "Delhi", countryName: "India", order: 1, dateRange: "15 Oct - 17 Oct", budget: 15000, selectedActivities: [mockActivities[5], mockActivities[6], mockActivities[7]] },
      { id: 2, cityName: "Agra", countryName: "India", order: 2, dateRange: "17 Oct - 18 Oct", budget: 13000, selectedActivities: [mockActivities[9], mockActivities[10], mockActivities[11]] },
      { id: 3, cityName: "Jaipur", countryName: "India", order: 3, dateRange: "18 Oct - 21 Oct", budget: 22000, selectedActivities: [mockActivities[0], mockActivities[1], mockActivities[2]] },
    ],
    budget: 50000,
    currency: "INR"
  },
  {
    id: 102,
    name: "Kerala Backwaters & Hill Serenity",
    description: "Tranquil retreat across Munnar tea plantations, spice forests, and an unforgettable Alleppey houseboat stay.",
    startDate: "2025-11-05T00:00:00.000Z",
    endDate: "2025-11-10T00:00:00.000Z",
    formattedDates: "Nov 05 - Nov 10, 2025",
    travelerCount: 2,
    travelerLabel: "2 Travelers",
    status: "UPCOMING",
    statusLabel: "Upcoming",
    coverImageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    locationSummary: "Munnar, Alleppey, Kerala",
    stops: [
      { id: 1, cityName: "Kerala (Munnar & Alleppey)", countryName: "India", order: 1, dateRange: "05 Nov - 08 Nov", budget: 22000, selectedActivities: [mockActivities[14], mockActivities[15], mockActivities[16]] },
      { id: 2, cityName: "Kerala (Munnar & Alleppey)", countryName: "India", order: 2, dateRange: "08 Nov - 10 Nov", budget: 18000, selectedActivities: [mockActivities[13]] },
    ],
    budget: 40000,
    currency: "INR"
  },
  {
    id: 103,
    name: "Japan Cherry Blossom & Tech Tour",
    description: "A breathtaking journey through neon Tokyo, sacred Kyoto shrines, and Mt. Fuji viewpoints.",
    startDate: "2024-04-10T00:00:00.000Z",
    endDate: "2024-04-18T00:00:00.000Z",
    formattedDates: "Apr 10 - Apr 18, 2024",
    travelerCount: 2,
    travelerLabel: "2 Travelers",
    status: "COMPLETED",
    statusLabel: "Completed",
    coverImageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    locationSummary: "Tokyo, Kyoto, Japan",
    stops: [
      { id: 1, cityName: "Tokyo", countryName: "Japan", order: 1, dateRange: "10 Apr - 14 Apr", budget: 70000, selectedActivities: [mockActivities[22], mockActivities[23], mockActivities[24]] },
      { id: 2, cityName: "Kyoto", countryName: "Japan", order: 2, dateRange: "14 Apr - 18 Apr", budget: 70000, selectedActivities: [mockActivities[26], mockActivities[27], mockActivities[28]] },
    ],
    budget: 140000,
    currency: "INR"
  }
];

export const mockDayWiseItinerary = {
  trip: {
    id: 105,
    name: "Golden Triangle Heritage Expedition",
    status: "UPCOMING",
    locationSummary: "Delhi, Agra, Jaipur, India",
    startDate: "2025-10-15",
    endDate: "2025-10-21",
    formattedDates: "Oct 15 - Oct 21, 2025",
    travelerCount: 2,
    budget: 49998,
    coverImageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
    stops: [
      {
        id: 1,
        cityName: "Delhi",
        countryName: "India",
        dateRange: "Day 1 - Day 2",
        budget: 15000,
        notes: "Red Fort & Chandni Chowk Food Crawl, Qutub Minar & Mehrauli Heritage Park, Humayun's Tomb Walk",
        selectedActivities: [mockActivities[5], mockActivities[6], mockActivities[7]],
      },
      {
        id: 2,
        cityName: "Agra",
        countryName: "India",
        dateRange: "Day 3",
        budget: 13000,
        notes: "Taj Mahal Sunrise Guided Experience, Agra Fort & Mughal History Walk, Mehtab Bagh Sunset",
        selectedActivities: [mockActivities[9], mockActivities[10], mockActivities[11]],
      },
      {
        id: 3,
        cityName: "Jaipur",
        countryName: "India",
        dateRange: "Day 4 - Day 6",
        budget: 21998,
        notes: "Amer Fort & Elephant Safari, Hawa Mahal & City Palace, Chokhi Dhani Rajasthani Cultural Dinner",
        selectedActivities: [mockActivities[0], mockActivities[1], mockActivities[2]],
      },
    ],
  },
  budgetSummary: {
    travelerCount: 2,
    totalBudget: 49998,
    totalBudgetFormatted: "₹49,998",
    costPerPerson: 24999,
    costPerPersonFormatted: "₹24,999 / person",
    plannedExpenses: 44600,
    plannedExpensesFormatted: "₹44,600",
    plannedPerPerson: 22300,
    plannedPerPersonFormatted: "₹22,300 / person",
    remainingBudget: 5398,
    remainingBudgetFormatted: "₹5,398",
    remainingPerPerson: 2699,
    remainingPerPersonFormatted: "₹2,699 / person",
    currency: "INR",
  },
  days: [
    {
      id: 1,
      dayNumber: 1,
      dayLabel: "Day 1",
      dateFormatted: "Oct 15",
      cityName: "Delhi",
      locationHeader: "Delhi • Oct 15",
      items: [
        { id: 1, time: "09:30 AM", activityName: "Red Fort & Chandni Chowk Food Crawl", expense: 4800, expenseFormatted: "₹4,800" },
        { id: 2, time: "02:30 PM", activityName: "Qutub Minar & Mehrauli Heritage Park", expense: 3600, expenseFormatted: "₹3,600" },
        { id: 3, time: "06:00 PM", activityName: "Humayun's Tomb & Sunder Nursery Walk", expense: 3000, expenseFormatted: "₹3,000" },
      ],
    },
    {
      id: 2,
      dayNumber: 2,
      dayLabel: "Day 2",
      dateFormatted: "Oct 16",
      cityName: "Agra",
      locationHeader: "Agra • Oct 16",
      items: [
        { id: 4, time: "06:00 AM", activityName: "Taj Mahal Sunrise Guided Experience", expense: 6400, expenseFormatted: "₹6,400" },
        { id: 5, time: "11:30 AM", activityName: "Agra Fort & Mughal History Walk", expense: 4000, expenseFormatted: "₹4,000" },
        { id: 6, time: "05:00 PM", activityName: "Mehtab Bagh Sunset Taj View & Tea", expense: 2000, expenseFormatted: "₹2,000" },
      ],
    },
    {
      id: 3,
      dayNumber: 3,
      dayLabel: "Day 3",
      dateFormatted: "Oct 17",
      cityName: "Jaipur",
      locationHeader: "Jaipur • Oct 17",
      items: [
        { id: 7, time: "09:00 AM", activityName: "Amer Fort & Elephant Safari", expense: 5600, expenseFormatted: "₹5,600" },
        { id: 8, time: "02:00 PM", activityName: "Hawa Mahal & City Palace Tour", expense: 3600, expenseFormatted: "₹3,600" },
        { id: 9, time: "07:00 PM", activityName: "Chokhi Dhani Rajasthani Cultural Dinner", expense: 5000, expenseFormatted: "₹5,000" },
      ],
    },
  ],
};
