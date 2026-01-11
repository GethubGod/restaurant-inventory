import { Category, LocationOption, OrderItem, RecentOrder, Suggestion } from "../types";

export const locations: LocationOption[] = [
  { id: "downtown", name: "Downtown" },
  { id: "uptown", name: "Uptown" },
  { id: "midtown", name: "Midtown" },
  { id: "harbor", name: "Harbor" },
];

export const orders: OrderItem[] = [
  {
    id: 101,
    item: "Chicken Thighs (40lb)",
    qty: 3,
    source: "Costco",
    location: "Downtown",
    orderedBy: "Alex",
    status: "Pending",
    date: "2025-02-17T09:00:00Z",
    urgency: "Rush",
  },
  {
    id: 102,
    item: "Paper Towels (12ct)",
    qty: 4,
    source: "Restaurant Depot",
    location: "Uptown",
    orderedBy: "Maria",
    status: "Pending",
    date: "2025-02-16T14:30:00Z",
    urgency: "Normal",
  },
  {
    id: 103,
    item: "Salmon Fillet (10lb)",
    qty: 2,
    source: "Costco",
    location: "Midtown",
    orderedBy: "Jordan",
    status: "Completed",
    date: "2025-02-15T11:15:00Z",
    urgency: "Normal",
  },
  {
    id: 104,
    item: "Gloves (Case)",
    qty: 5,
    source: "Restaurant Depot",
    location: "Downtown",
    orderedBy: "Sam",
    status: "Pending",
    date: "2025-02-17T07:45:00Z",
    urgency: "Rush",
  },
  {
    id: 105,
    item: "Coffee Beans",
    qty: 2,
    source: "Local Supplier",
    location: "Harbor",
    orderedBy: "Priya",
    status: "Cancelled",
    date: "2025-02-14T16:00:00Z",
    urgency: "Normal",
  },
  {
    id: 106,
    item: "Avocados (Case)",
    qty: 3,
    source: "Costco",
    location: "Uptown",
    orderedBy: "Evan",
    status: "Pending",
    date: "2025-02-18T08:10:00Z",
    urgency: "Rush",
  },
];

export const suggestions: Suggestion[] = [
  { id: 201, item: "Roma Tomatoes", source: "Restaurant Depot", reason: "Ordered weekly" },
  { id: 202, item: "Mozzarella (Shredded)", source: "Costco", reason: "High usage last week" },
  { id: 203, item: "Napkins (10k)", source: "Restaurant Depot", reason: "Low shelf count" },
  { id: 204, item: "Sparkling Water (24pk)", source: "Costco", reason: "Popular add-on" },
];

export const categories: Category[] = [
  { id: "produce", name: "Produce", description: "Fresh greens, fruits, veg" },
  { id: "proteins", name: "Proteins", description: "Meat, seafood, eggs" },
  { id: "dry-goods", name: "Dry Goods", description: "Rice, pasta, flour" },
  { id: "paper", name: "Paper Goods", description: "Napkins, towels, cups" },
  { id: "beverage", name: "Beverages", description: "Sodas, juices, coffee" },
  { id: "cleaning", name: "Cleaning", description: "Chemicals, gloves, bags" },
];

export const recentOrders: RecentOrder[] = [
  { id: 301, item: "Ketchup (2ct)", qty: 2, location: "Downtown", source: "Costco", date: "2025-02-13T10:00:00Z" },
  { id: 302, item: "To-go Lids", qty: 1, location: "Uptown", source: "Restaurant Depot", date: "2025-02-12T12:00:00Z" },
  { id: 303, item: "Basmati Rice", qty: 3, location: "Downtown", source: "Restaurant Depot", date: "2025-02-11T08:00:00Z" },
];
