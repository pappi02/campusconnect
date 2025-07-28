// Mock products for Kibabii University area vendors
export const kibabiiProducts = [
  // KU Cafeteria Products
  {
    id: "KU-FOOD-001",
    name: "Ugali & Sukuma Wiki",
    category: "food",
    vendor: "KU Cafeteria",
    price: 150,
    description: "Traditional Kenyan dish with maize meal and kale",
    image: "/images/ugali-sukuma.jpg",
    preparationTime: "10-15 mins",
    available: true,
    rating: 4.5
  },
  {
    id: "KU-FOOD-002",
    name: "Chapati & Beans",
    category: "food",
    vendor: "KU Cafeteria",
    price: 100,
    description: "Fresh chapati served with delicious bean stew",
    image: "/images/chapati-beans.jpg",
    preparationTime: "15-20 mins",
    available: true,
    rating: 4.3
  },
  {
    id: "KU-FOOD-003",
    name: "Pilau",
    category: "food",
    vendor: "KU Cafeteria",
    price: 250,
    description: "Spiced rice with meat and vegetables",
    image: "/images/pilau.jpg",
    preparationTime: "20-25 mins",
    available: true,
    rating: 4.7
  },
  {
    id: "KU-FOOD-004",
    name: "Fish & Chips",
    category: "food",
    vendor: "KU Cafeteria",
    price: 350,
    description: "Crispy fried fish with potato chips",
    image: "/images/fish-chips.jpg",
    preparationTime: "15-20 mins",
    available: true,
    rating: 4.4
  },

  // Bungoma Best Bites Products
  {
    id: "BB-001",
    name: "Chicken Tikka",
    category: "food",
    vendor: "Bungoma Best Bites",
    price: 400,
    description: "Grilled chicken tikka with spices",
    image: "/images/chicken-tikka.jpg",
    preparationTime: "25-30 mins",
    available: true,
    rating: 4.6
  },
  {
    id: "BB-002",
    name: "Beef Burger",
    category: "food",
    vendor: "Bungoma Best Bites",
    price: 300,
    description: "Juicy beef burger with fries",
    image: "/images/beef-burger.jpg",
    preparationTime: "15-20 mins",
    available: true,
    rating: 4.2
  },

  // Kanduyi Kitchen Products
  {
    id: "KK-001",
    name: "Githeri",
    category: "food",
    vendor: "Kanduyi Kitchen",
    price: 120,
    description: "Traditional maize and beans mixture",
    image: "/images/githeri.jpg",
    preparationTime: "10-15 mins",
    available: true,
    rating: 4.1
  },
  {
    id: "KK-002",
    name: "Mandazi",
    category: "snacks",
    vendor: "Kanduyi Kitchen",
    price: 20,
    description: "Sweet fried dough snack",
    image: "/images/mandazi.jpg",
    preparationTime: "5-10 mins",
    available: true,
    rating: 4.0
  },

  // Webuye Delicacies Products
  {
    id: "WD-001",
    name: "Nyama Choma",
    category: "food",
    vendor: "Webuye Delicacies",
    price: 500,
    description: "Grilled goat meat with kachumbari",
    image: "/images/nyama-choma.jpg",
    preparationTime: "30-40 mins",
    available: true,
    rating: 4.8
  },
  {
    id: "WD-002",
    name: "Matoke",
    category: "food",
    vendor: "Webuye Delicacies",
    price: 200,
    description: "Steamed bananas with beef stew",
    image: "/images/matoke.jpg",
    preparationTime: "20-25 mins",
    available: true,
    rating: 4.3
  },

  // Drinks & Beverages
  {
    id: "DRINK-001",
    name: "Fresh Juice",
    category: "drinks",
    vendor: "KU Cafeteria",
    price: 80,
    description: "Fresh mango or passion juice",
    image: "/images/fresh-juice.jpg",
    available: true,
    rating: 4.4
  },
  {
    id: "DRINK-002",
    name: "Soda",
    category: "drinks",
    vendor: "Multiple Vendors",
    price: 50,
    description: "Coca Cola, Fanta, Sprite",
    image: "/images/soda.jpg",
    available: true,
    rating: 4.0
  },

  // Stationery & Books
  {
    id: "STAT-001",
    name: "KU Branded Notebook",
    category: "stationery",
    vendor: "KU Bookstore",
    price: 200,
    description: "Official Kibabii University notebook",
    image: "/images/ku-notebook.jpg",
    available: true,
    rating: 4.5
  },
  {
    id: "STAT-002",
    name: "Pens Set",
    category: "stationery",
    vendor: "KU Bookstore",
    price: 150,
    description: "Set of 5 quality pens",
    image: "/images/pens-set.jpg",
    available: true,
    rating: 4.2
  },

  // Electronics
  {
    id: "ELEC-001",
    name: "Phone Charger",
    category: "electronics",
    vendor: "Bungoma Electronics",
    price: 500,
    description: "Universal USB phone charger",
    image: "/images/phone-charger.jpg",
    available: true,
    rating: 4.1
  },
  {
    id: "ELEC-002",
    name: "Earphones",
    category: "electronics",
    vendor: "Bungoma Electronics",
    price: 300,
    description: "Quality wired earphones",
    image: "/images/earphones.jpg",
    available: true,
    rating: 4.0
  }
];

// Group products by vendor for easier display
export const productsByVendor = {
  "KU Cafeteria": kibabiiProducts.filter(p => p.vendor === "KU Cafeteria"),
  "Bungoma Best Bites": kibabiiProducts.filter(p => p.vendor === "Bungoma Best Bites"),
  "Kanduyi Kitchen": kibabiiProducts.filter(p => p.vendor === "Kanduyi Kitchen"),
  "Webuye Delicacies": kibabiiProducts.filter(p => p.vendor === "Webuye Delicacies"),
  "KU Bookstore": kibabiiProducts.filter(p => p.vendor === "KU Bookstore"),
  "Bungoma Electronics": kibabiiProducts.filter(p => p.vendor === "Bungoma Electronics")
};

// Group products by category
export const productsByCategory = {
  "food": kibabiiProducts.filter(p => p.category === "food"),
  "drinks": kibabiiProducts.filter(p => p.category === "drinks"),
  "snacks": kibabiiProducts.filter(p => p.category === "snacks"),
  "stationery": kibabiiProducts.filter(p => p.category === "stationery"),
  "electronics": kibabiiProducts.filter(p => p.category === "electronics")
};
