export type Listing = {
  id: string;
  type: "hostel" | "mess";
  name: string;
  university: string;
  gender: "boys" | "girls" | "co-ed";
  price: number;
  priceUnit: "month";
  distanceKm: number;
  rating: number;
  reviewCount: number;
  available: boolean;
  roomType?: "single" | "double" | "triple";
  mealPlan?: "2-time" | "3-time";
  tags: string[];
  color: string;
  images: string[];
};

export const listings: Listing[] = [
  {
    id: "h1",
    type: "hostel",
    name: "Al-Madina Boys Hostel",
    university: "UCP Lahore",
    gender: "boys",
    price: 12000,
    priceUnit: "month",
    distanceKm: 0.6,
    rating: 4.3,
    reviewCount: 27,
    available: true,
    roomType: "double",
    tags: ["AC rooms", "WiFi", "Laundry"],
    color: "#c1443d",
    images: [],
  },
  {
    id: "h2",
    type: "hostel",
    name: "Green View Girls Residency",
    university: "UCP Lahore",
    gender: "girls",
    price: 15000,
    priceUnit: "month",
    distanceKm: 1.2,
    rating: 4.6,
    reviewCount: 41,
    available: true,
    roomType: "single",
    tags: ["Security guard", "WiFi", "Mess included"],
    color: "#3d6b52",
    images: [],
  },
  {
    id: "h3",
    type: "hostel",
    name: "Campus Corner Hostel",
    university: "UET Lahore",
    gender: "co-ed",
    price: 9500,
    priceUnit: "month",
    distanceKm: 2.1,
    rating: 3.9,
    reviewCount: 15,
    available: false,
    roomType: "triple",
    tags: ["Non-AC", "Generator backup"],
    color: "#8a5a3d",
    images: [],
  },
  {
    id: "m1",
    type: "mess",
    name: "Chaudhry Mess Point",
    university: "UCP Lahore",
    gender: "co-ed",
    price: 6500,
    priceUnit: "month",
    distanceKm: 0.3,
    rating: 4.1,
    reviewCount: 63,
    available: true,
    mealPlan: "3-time",
    tags: ["Desi menu", "Home-style"],
    color: "#e8b54d",
    images: [],
  },
  {
    id: "m2",
    type: "mess",
    name: "Student Tiffin Service",
    university: "GCU Lahore",
    gender: "co-ed",
    price: 5000,
    priceUnit: "month",
    distanceKm: 1.5,
    rating: 4.4,
    reviewCount: 22,
    available: true,
    mealPlan: "2-time",
    tags: ["Delivery", "Low oil options"],
    color: "#3d6b52",
    images: [],
  },
  {
    id: "h4",
    type: "hostel",
    name: "Zaman Boys Hostel",
    university: "UCP Lahore",
    gender: "boys",
    price: 10500,
    priceUnit: "month",
    distanceKm: 0.9,
    rating: 4.0,
    reviewCount: 34,
    available: true,
    roomType: "double",
    tags: ["WiFi", "Study room"],
    color: "#2b3a2e",
    images: [],
  },
];

export const universities = [
  "UCP Lahore",
  "UET Lahore",
  "GCU Lahore",
  "Punjab University",
  "FAST Lahore",
];
