// Kibabii University and Bungoma area mock locations
// Based on coordinates: 0.62, 34.52 (Bungoma, Kenya)

export const kibabiiLocations = {
  university: {
    name: "Kibabii University",
    coordinates: [0.62, 34.52],
    address: "Kibabii University, Bungoma, Kenya",
    description: "Main campus of Kibabii University",
    facilities: [
      "Main Administration Block",
      "Library Complex",
      "Science Laboratories",
      "Student Center",
      "Sports Complex",
      "Lecture Halls",
      "Hostels"
    ]
  },
  
  nearbyLocations: [
    {
      id: 1,
      name: "Bungoma Town",
      type: "town",
      coordinates: [0.57, 34.56],
      description: "Main town center with shops and services",
      landmarks: ["Bungoma Market", "Post Office", "Banks", "Shopping Centers"]
    },
    {
      id: 2,
      name: "Kanduyi",
      type: "suburb",
      coordinates: [0.59, 34.54],
      description: "Residential area near the university",
      landmarks: ["Kanduyi Shopping Center", "Residential Estates"]
    },
    {
      id: 3,
      name: "Webuye",
      type: "town",
      coordinates: [0.62, 34.77],
      description: "Neighboring town with industrial facilities",
      landmarks: ["Pan Paper Mills", "Webuye Town Center"]
    },
    {
      id: 4,
      name: "Malakisi",
      type: "town",
      coordinates: [0.72, 34.42],
      description: "Agricultural town nearby",
      landmarks: ["Malakisi Market", "Farming Community"]
    }
  ],
  
  deliveryPoints: [
    {
      id: 1,
      name: "KU Main Gate",
      coordinates: [0.6201, 34.5198],
      type: "university_gate",
      description: "Main entrance to Kibabii University"
    },
    {
      id: 2,
      name: "KU Hostels",
      coordinates: [0.6195, 34.5205],
      type: "student_accommodation",
      description: "Student residential area"
    },
    {
      id: 3,
      name: "KU Cafeteria",
      coordinates: [0.6203, 34.5202],
      type: "dining",
      description: "Main university cafeteria"
    },
    {
      id: 4,
      name: "Bungoma CBD",
      coordinates: [0.5701, 34.5602],
      type: "town_center",
      description: "Central business district of Bungoma"
    },
    {
      id: 5,
      name: "Kanduyi Stage",
      coordinates: [0.5901, 34.5403],
      type: "transport_hub",
      description: "Main matatu stage in Kanduyi"
    }
  ],
  
  restaurants: [
    {
      id: 1,
      name: "KU Cafeteria",
      location: "Inside Kibabii University",
      cuisine: "Kenyan & International",
      deliveryTime: "20-30 min",
      rating: 4.2,
      priceRange: "KSh 150-400"
    },
    {
      id: 2,
      name: "Bungoma Best Bites",
      location: "Bungoma Town",
      cuisine: "Kenyan Fast Food",
      deliveryTime: "15-25 min",
      rating: 4.0,
      priceRange: "KSh 200-500"
    },
    {
      id: 3,
      name: "Kanduyi Kitchen",
      location: "Kanduyi Shopping Center",
      cuisine: "Local Kenyan Dishes",
      deliveryTime: "25-35 min",
      rating: 4.3,
      priceRange: "KSh 100-350"
    },
    {
      id: 4,
      name: "Webuye Delicacies",
      location: "Webuye Town",
      cuisine: "Mixed African Cuisine",
      deliveryTime: "30-45 min",
      rating: 3.9,
      priceRange: "KSh 250-600"
    }
  ],
  
  vendors: [
    {
      id: 1,
      name: "KU Bookstore",
      type: "books_stationery",
      location: "Kibabii University Campus",
      description: "Official university bookstore"
    },
    {
      id: 2,
      name: "Bungoma Electronics",
      type: "electronics",
      location: "Bungoma Town",
      description: "Mobile phones and accessories"
    },
    {
      id: 3,
      name: "Kanduyi Fashion",
      type: "clothing",
      location: "Kanduyi Shopping Center",
      description: "Latest fashion trends"
    },
    {
      id: 4,
      name: "Malakisi Fresh Produce",
      type: "groceries",
      location: "Malakisi Market",
      description: "Fresh fruits and vegetables"
    }
  ]
};
