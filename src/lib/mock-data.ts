export type UserRole = "admin" | "manager" | "meal_manager" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roomNumber: string;
  monthlyRent: number;
  createdAt: string;
  avatar?: string;
}

export interface MealEntry {
  id: string;
  userId: string;
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  totalMeals: number;
}

export interface MealRate {
  id: string;
  month: string;
  ratePerMeal: number;
}

export interface RentPayment {
  id: string;
  userId: string;
  month: string;
  amount: number;
  status: "paid" | "unpaid" | "partial";
  paidDate?: string;
}

export interface MealOffRequest {
  id: string;
  userId: string;
  date: string; // the date meal should be off
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
}

export interface MonthlySummary {
  userId: string;
  month: string;
  totalMeals: number;
  mealCost: number;
  rent: number;
  totalDue: number;
  paidAmount: number;
  balance: number;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  meal_manager: "Meal Manager",
  user: "Resident",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-primary text-primary-foreground",
  manager: "bg-accent text-accent-foreground",
  meal_manager: "bg-warning text-warning-foreground",
  user: "bg-secondary text-secondary-foreground",
};

export const mockUsers: User[] = [
  { id: "1", name: "Arif Hossain", email: "admin@hostel.com", role: "admin", roomNumber: "A-101", monthlyRent: 5000, createdAt: "2024-01-01" },
  { id: "2", name: "Rahim Uddin", email: "manager@hostel.com", role: "manager", roomNumber: "A-102", monthlyRent: 4500, createdAt: "2024-01-15" },
  { id: "3", name: "Kamal Ahmed", email: "meal@hostel.com", role: "meal_manager", roomNumber: "B-201", monthlyRent: 4000, createdAt: "2024-02-01" },
  { id: "4", name: "Jamal Khan", email: "user1@hostel.com", role: "user", roomNumber: "B-202", monthlyRent: 3500, createdAt: "2024-02-10" },
  { id: "5", name: "Nabil Sarker", email: "user2@hostel.com", role: "user", roomNumber: "B-203", monthlyRent: 3500, createdAt: "2024-03-01" },
  { id: "6", name: "Tanvir Islam", email: "user3@hostel.com", role: "user", roomNumber: "C-301", monthlyRent: 4000, createdAt: "2024-03-15" },
  { id: "7", name: "Shakib Rahman", email: "user4@hostel.com", role: "user", roomNumber: "C-302", monthlyRent: 3500, createdAt: "2024-04-01" },
  { id: "8", name: "Farhan Haque", email: "user5@hostel.com", role: "user", roomNumber: "C-303", monthlyRent: 4000, createdAt: "2024-04-15" },
];

const generateMealEntries = (): MealEntry[] => {
  const entries: MealEntry[] = [];
  const userIds = mockUsers.map((u) => u.id);
  for (let day = 1; day <= 28; day++) {
    const date = `2026-02-${String(day).padStart(2, "0")}`;
    userIds.forEach((uid) => {
      const b = Math.random() > 0.2;
      const l = Math.random() > 0.1;
      const d = Math.random() > 0.15;
      entries.push({
        id: `meal-${uid}-${day}`,
        userId: uid,
        date,
        breakfast: b,
        lunch: l,
        dinner: d,
        totalMeals: [b, l, d].filter(Boolean).length,
      });
    });
  }
  return entries;
};

export const mockMealEntries: MealEntry[] = generateMealEntries();

export const mockMealRate: MealRate = {
  id: "rate-1",
  month: "2026-02",
  ratePerMeal: 60,
};

export const mockRentPayments: RentPayment[] = [
  { id: "rp-1", userId: "4", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-05" },
  { id: "rp-2", userId: "5", month: "2026-02", amount: 2000, status: "partial", paidDate: "2026-02-10" },
  { id: "rp-3", userId: "6", month: "2026-02", amount: 0, status: "unpaid" },
  { id: "rp-4", userId: "7", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-03" },
  { id: "rp-5", userId: "8", month: "2026-02", amount: 0, status: "unpaid" },
];

export const mockMealOffRequests: MealOffRequest[] = [
  { id: "mor-1", userId: "4", date: "2026-02-28", requestedAt: "2026-02-27T10:00:00", status: "pending", meals: { breakfast: true, lunch: true, dinner: true } },
  { id: "mor-2", userId: "5", date: "2026-02-28", requestedAt: "2026-02-27T11:30:00", status: "approved", reviewedBy: "3", meals: { breakfast: true, lunch: false, dinner: true } },
  { id: "mor-3", userId: "7", date: "2026-02-28", requestedAt: "2026-02-27T09:00:00", status: "rejected", reviewedBy: "1", meals: { breakfast: false, lunch: true, dinner: true } },
];

export function getUserMealSummary(userId: string): { totalMeals: number; mealCost: number } {
  const entries = mockMealEntries.filter((e) => e.userId === userId);
  const totalMeals = entries.reduce((s, e) => s + e.totalMeals, 0);
  return { totalMeals, mealCost: totalMeals * mockMealRate.ratePerMeal };
}

export function getMonthlySummary(userId: string): MonthlySummary {
  const user = mockUsers.find((u) => u.id === userId);
  const { totalMeals, mealCost } = getUserMealSummary(userId);
  const rent = user?.monthlyRent ?? 0;
  const payment = mockRentPayments.find((p) => p.userId === userId);
  const paidAmount = payment?.amount ?? 0;
  const totalDue = mealCost + rent;
  return {
    userId,
    month: "2026-02",
    totalMeals,
    mealCost,
    rent,
    totalDue,
    paidAmount,
    balance: totalDue - paidAmount,
  };
}
