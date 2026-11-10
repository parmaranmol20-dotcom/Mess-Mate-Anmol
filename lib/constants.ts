import { Kitchen, Meal } from "@/types";

export const BRAND = {
  name: "MessMate",
  tagline: "Good food. Better days.",
  mission: "Make affordable, hygienic, home-style food easily accessible to students living in PGs and rented rooms.",
  servingLocation: "DBS Global University & nearby PG areas, Dehradun",
  servingPincodes: ["248007", "248011", "248197"],
  servingAreas: [
    "DBS Global University Campus",
    "Manduwala PG Corridor",
    "Kandoli Student Hub",
    "Selaqui Hostels & PGs",
    "Prem Nagar Student Residences",
  ],
  supportEmail: "care@messmate.in",
  supportPhone: "+91 88590 12345",
  instagramHandle: "@messmate_dbs",
};

// WhatsApp Business configuration
// Can be overridden via NEXT_PUBLIC_WHATSAPP_NUMBER in .env
export const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

// Pricing rules & configurations
export const PRICING_CONFIG = {
  baseSellingPrice: 100,
  individualMealMin: 80,
  individualMealMax: 120,
  weeklyPlan: {
    singleMealDaily: 699, // 7 meals
    doubleMealDaily: 1349, // 14 meals (lunch + dinner)
    savingsNote: "Tailored for exam weeks & flexible study stints",
  },
  monthlyPlan: {
    singleMealDaily: 2799, // 30 meals (~₹93/meal)
    doubleMealDaily: 5299, // 60 meals (~₹88/meal)
    targetBudgetRange: "₹2,500 – ₹3,500",
    savingsNote: "Targeted to fit student PG allowances with zero hidden fees",
  },
};

// Cutoff & Skip policy rules
export const SKIP_POLICY = {
  lunchCutoffHour: 9, // 9:00 AM same day
  lunchCutoffText: "9:00 AM of the delivery morning",
  dinnerCutoffHour: 16, // 4:00 PM same day
  dinnerCutoffText: "4:00 PM of the delivery afternoon",
  creditRuleText: "Approved skips automatically roll forward to extend your plan validity date so you never lose meal credits.",
  maxAdvanceDays: 7,
};

// Demo Kitchen Partners (Clearly marked as Demo for university presentation)
export const DEMO_KITCHENS: Kitchen[] = [
  {
    id: "kitch-1",
    name: "Annapurna Rasoi (Aunty's Kitchen)",
    address: "Lane 3, Manduwala, Near DBS Gate 2, Dehradun",
    description: "Homely North Indian comfort food cooked with low oil, fresh seasonal greens, and motherly care.",
    phone: "+91 98970 11223",
    approvalStatus: "approved",
    operatingHours: "11:00 AM – 3:30 PM & 6:30 PM – 10:00 PM",
    fssaiNumber: "FSSAI-DEMO-2024-8891",
    foodCategory: "North Indian, Pure Home-style",
    rating: 4.9,
    isDemo: true,
  },
  {
    id: "kitch-2",
    name: "Doon Student Dabbawala",
    address: "Kandoli Main Market, Opp. Girls PG Haven, Dehradun",
    description: "Specializing in balanced nutritious student thalis, hearty rajma chawal, and fresh whole-wheat rotis.",
    phone: "+91 98371 44556",
    approvalStatus: "approved",
    operatingHours: "11:30 AM – 3:00 PM & 7:00 PM – 9:45 PM",
    fssaiNumber: "FSSAI-DEMO-2024-4412",
    foodCategory: "Homely Thalis & Dal Rice",
    rating: 4.8,
    isDemo: true,
  },
  {
    id: "kitch-3",
    name: "Pahaadi Flavours & Tiffin",
    address: "Chakrata Road, Selaqui (Near DBS North Annex), Dehradun",
    description: "Authentic Ghar-ka-khana with traditional slow-cooked dals, seasonal mountain greens, and warm phulkas.",
    phone: "+91 98123 77889",
    approvalStatus: "approved",
    operatingHours: "12:00 PM – 3:30 PM & 7:00 PM – 10:30 PM",
    fssaiNumber: "FSSAI-DEMO-2024-9921",
    foodCategory: "Regional Homestyle & Combos",
    rating: 4.7,
    isDemo: true,
  },
];

// Demo Meals (Stored with realistic high quality food photography and clear demo flags)
export const DEMO_MEALS: Meal[] = [
  {
    id: "meal-1",
    name: "Ghar Jaisa Dal Rice & Seasonal Sabzi",
    description: "Yellow arhar dal tadka tempered with cumin & desi ghee, steamed basmati rice, dry aloo gobhi/beans, and crunchy salad.",
    price: 90,
    category: "dal_rice",
    foodType: "veg",
    imageURL: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    kitchenId: "kitch-1",
    kitchenName: "Annapurna Rasoi (Aunty's Kitchen)",
    kitchenLocation: "Manduwala, Dehradun",
    availability: true,
    mealTiming: "both",
    portionInfo: "Serves 1 generous student appetite (400g dal+rice, 120g sabzi)",
    ingredients: ["Arhar Dal", "Basmati Rice", "Seasonal Vegetable", "Ghee Tadka", "Green Salad"],
    isPopular: true,
    isDemo: true,
  },
  {
    id: "meal-2",
    name: "Doon Special Rajma Chawal Thali",
    description: "Slow-cooked Kashmiri rajma in thick aromatic onion-tomato gravy served with steaming jeera rice, 2 hot phulkas, pickle & onion rings.",
    price: 100,
    category: "combo",
    foodType: "veg",
    imageURL: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    kitchenId: "kitch-2",
    kitchenName: "Doon Student Dabbawala",
    kitchenLocation: "Kandoli Hub, Dehradun",
    availability: true,
    mealTiming: "both",
    portionInfo: "Serves 1 hungry student (250ml rajma, 300g rice, 2 phulkas)",
    ingredients: ["Kashmiri Rajma", "Jeera Basmati", "Whole Wheat Atta", "House Spice Blend", "Pickle"],
    isPopular: true,
    isDemo: true,
  },
  {
    id: "meal-3",
    name: "Amritsari Chole Rice & Boondi Raita",
    description: "Dark slow-infused kabuli chana simmered in tea leaves & whole spices, fragrant basmati rice, and cooling chilled boondi raita.",
    price: 95,
    category: "combo",
    foodType: "veg",
    imageURL: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    kitchenId: "kitch-1",
    kitchenName: "Annapurna Rasoi (Aunty's Kitchen)",
    kitchenLocation: "Manduwala, Dehradun",
    availability: true,
    mealTiming: "lunch",
    portionInfo: "Serves 1 (250ml chole, 300g rice, 100ml raita)",
    ingredients: ["Kabuli Chana", "Basmati Rice", "Fresh Curd", "Boondi", "Ginger Juliennes"],
    isPopular: true,
    isDemo: true,
  },
  {
    id: "meal-4",
    name: "Paneer Butter Masala Homestyle Thali",
    description: "Fresh cottage cheese cubes in silky mild makhani gravy, 4 hot whole wheat rotis, yellow dal, steamed rice, and fresh salad.",
    price: 120,
    category: "thali",
    foodType: "veg",
    imageURL: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    kitchenId: "kitch-2",
    kitchenName: "Doon Student Dabbawala",
    kitchenLocation: "Kandoli Hub, Dehradun",
    availability: true,
    mealTiming: "dinner",
    portionInfo: "Grand Single Thali (180ml paneer, 150ml dal, 4 rotis, rice, salad)",
    ingredients: ["Fresh Malai Paneer", "Tomato Butter Gravy", "Toor Dal", "Whole Wheat Phulka"],
    isPopular: true,
    isDemo: true,
  },
  {
    id: "meal-5",
    name: "Executive Homemade Lunch Thali",
    description: "Daily changing 2 seasonal sabzis (1 gravy, 1 dry), dal fry, 4 soft butter rotis, steamed rice, curd, and sweet gulab jamun / kheer.",
    price: 110,
    category: "thali",
    foodType: "veg",
    imageURL: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    kitchenId: "kitch-3",
    kitchenName: "Pahaadi Flavours & Tiffin",
    kitchenLocation: "Selaqui, Dehradun",
    availability: true,
    mealTiming: "lunch",
    portionInfo: "Complete 5-Item Thali (Sabzi 1, Sabzi 2, Dal, 4 Rotis, Rice, Curd)",
    ingredients: ["Seasonal Vegetables", "Panchratna Dal", "Desi Ghee Phulka", "Dahi"],
    isPopular: false,
    isDemo: true,
  },
  {
    id: "meal-6",
    name: "Light & Healthy Dinner Thali",
    description: "Specially formulated for easy night-time digestion: yellow moong dal tadka, bottle gourd / tori sabzi, 3 multigrain rotis, and fresh cucumber salad.",
    price: 85,
    category: "healthy",
    foodType: "veg",
    imageURL: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    kitchenId: "kitch-3",
    kitchenName: "Pahaadi Flavours & Tiffin",
    kitchenLocation: "Selaqui, Dehradun",
    availability: true,
    mealTiming: "dinner",
    portionInfo: "Healthy Single Meal (200ml Moong Dal, 150g Lauki sabzi, 3 Rotis)",
    ingredients: ["Moong Dal Dhuli", "Fresh Lauki", "Multigrain Atta", "Roasted Cumin", "Lemon"],
    isPopular: false,
    isDemo: true,
  },
];

