// Mock orders for Kibabii University area
export const kibabiiMockOrders = [
  {
    id: "KU001",
    customer: {
      name: "Brian Wanjala",
      phone: "+254712345678",
      location: "KU Hostel Block A",
      coordinates: [0.6195, 34.5205]
    },
    items: [
      {
        name: "Ugali & Sukuma",
        quantity: 1,
        price: 150,
        vendor: "KU Cafeteria"
      },
      {
        name: "Chapati & Beans",
        quantity: 2,
        price: 100,
        vendor: "KU Cafeteria"
      }
    ],
    total: 350,
    status: "preparing",
    estimatedDelivery: "15 mins",
    orderTime: "2024-01-15T12:30:00Z"
  },
  {
    id: "KU002",
    customer: {
      name: "Sarah Nekesa",
      phone: "+254723456789",
      location: "Kanduyi Stage",
      coordinates: [0.5901, 34.5403]
    },
    items: [
      {
        name: "Pilau",
        quantity: 1,
        price: 250,
        vendor: "Bungoma Best Bites"
      },
      {
        name: "Chicken Tikka",
        quantity: 1,
        price: 400,
        vendor: "Bungoma Best Bites"
      }
    ],
    total: 650,
    status: "out_for_delivery",
    estimatedDelivery: "10 mins",
    orderTime: "2024-01-15T12:45:00Z"
  },
  {
    id: "KU003",
    customer: {
      name: "Michael Simiyu",
      phone: "+254734567890",
      location: "KU Main Gate",
      coordinates: [0.6201, 34.5198]
    },
    items: [
      {
        name: "Mandazi",
        quantity: 4,
        price: 20,
        vendor: "Kanduyi Kitchen"
      },
      {
        name: "Tea",
        quantity: 2,
        price: 50,
        vendor: "Kanduyi Kitchen"
      }
    ],
    total: 180,
    status: "delivered",
    estimatedDelivery: "Delivered",
    orderTime: "2024-01-15T11:30:00Z"
  },
  {
    id: "KU004",
    customer: {
      name: "Faith Jepkoech",
      phone: "+254745678901",
      location: "Bungoma CBD",
      coordinates: [0.5701, 34.5602]
    },
    items: [
      {
        name: "Fish & Chips",
        quantity: 1,
        price: 350,
        vendor: "Webuye Delicacies"
      },
      {
        name: "Soda",
        quantity: 2,
        price: 60,
        vendor: "Webuye Delicacies"
      }
    ],
    total: 470,
    status: "pending",
    estimatedDelivery: "30 mins",
    orderTime: "2024-01-15T13:00:00Z"
  },
  {
    id: "KU005",
    customer: {
      name: "John Wekesa",
      phone: "+254756789012",
      location: "KU Science Complex",
      coordinates: [0.6198, 34.5208]
    },
    items: [
      {
        name: "Githeri",
        quantity: 1,
        price: 120,
        vendor: "KU Cafeteria"
      },
      {
        name: "Avocado",
        quantity: 1,
        price: 50,
        vendor: "KU Cafeteria"
      }
    ],
    total: 170,
    status: "preparing",
    estimatedDelivery: "20 mins",
    orderTime: "2024-01-15T13:15:00Z"
  }
];

export const kibabiiDeliveryPersonnel = [
  {
    id: "DP001",
    name: "Peter Wamalwa",
    phone: "+254777111222",
    vehicle: "Motorcycle",
    currentLocation: [0.619, 34.521],
    status: "available",
    rating: 4.5,
    completedDeliveries: 145
  },
  {
    id: "DP002",
    name: "Diana Nanjala",
    phone: "+254788333444",
    vehicle: "Bicycle",
    currentLocation: [0.571, 34.561],
    status: "on_delivery",
    rating: 4.7,
    completedDeliveries: 89
  },
  {
    id: "DP003",
    name: "Robert Barasa",
    phone: "+254799555666",
    vehicle: "Motorcycle",
    currentLocation: [0.591, 34.541],
    status: "available",
    rating: 4.3,
    completedDeliveries: 203
  }
];
