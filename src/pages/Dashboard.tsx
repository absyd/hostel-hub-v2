import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  mockUsers,
  mockMealEntries,
  mockRentPayments,
  mockMealRate,
  getMonthlySummary,
  getUserMealSummary,
  ROLE_LABELS,
} from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UtensilsCrossed, Building2, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}) {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-xs text-success font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const totalResidents = mockUsers.filter((u) => u.role === "user").length;
  const totalMealsToday = mockMealEntries
    .filter((e) => e.date === "2026-02-27")
    .reduce((s, e) => s + e.totalMeals, 0);
  const totalRentCollected = mockRentPayments.reduce((s, p) => s + p.amount, 0);
  const unpaidRent = mockRentPayments.filter((p) => p.status === "unpaid").length;

  const mealChartData = Array.from({ length: 7 }, (_, i) => {
    const day = 22 + i;
    const date = `2026-02-${String(day).padStart(2, "0")}`;
    const meals = mockMealEntries.filter((e) => e.date === date).reduce((s, e) => s + e.totalMeals, 0);
    return { day: `Feb ${day}`, meals };
  });

  const roleData = [
    { name: "Residents", value: mockUsers.filter((u) => u.role === "user").length },
    { name: "Managers", value: mockUsers.filter((u) => u.role === "manager").length },
    { name: "Meal Mgrs", value: mockUsers.filter((u) => u.role === "meal_manager").length },
    { name: "Admins", value: mockUsers.filter((u) => u.role === "admin").length },
  ];
  const pieColors = ["hsl(195, 67%, 45%)", "hsl(195, 67%, 30%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and analytics</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Residents" value={totalResidents} icon={Users} description="Active members" trend="+2 this month" />
        <StatCard title="Meals Today" value={totalMealsToday} icon={UtensilsCrossed} description={`Rate: ৳${mockMealRate.ratePerMeal}/meal`} />
        <StatCard title="Rent Collected" value={`৳${totalRentCollected.toLocaleString()}`} icon={DollarSign} description="This month" />
        <StatCard title="Unpaid Rent" value={unpaidRent} icon={AlertCircle} description="Pending payments" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Meals This Week</CardTitle>
            <CardDescription>Daily total meal count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mealChartData}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="meals" fill="hsl(195, 67%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {roleData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserDashboard({ userId }: { userId: string }) {
  const summary = getMonthlySummary(userId);
  const user = mockUsers.find((u) => u.id === userId)!;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">Your monthly summary for February 2026</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Meals" value={summary.totalMeals} icon={UtensilsCrossed} description="This month" />
        <StatCard title="Meal Cost" value={`৳${summary.mealCost.toLocaleString()}`} icon={DollarSign} description={`@৳${mockMealRate.ratePerMeal}/meal`} />
        <StatCard title="Rent" value={`৳${summary.rent.toLocaleString()}`} icon={Building2} description={`Room ${user.roomNumber}`} />
        <StatCard title="Balance Due" value={`৳${summary.balance.toLocaleString()}`} icon={AlertCircle} description={summary.balance > 0 ? "Payment pending" : "All clear!"} />
      </div>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: "Meal Cost", value: summary.mealCost },
              { label: "Rent", value: summary.rent },
              { label: "Total Due", value: summary.totalDue, bold: true },
              { label: "Paid", value: summary.paidAmount },
              { label: "Balance", value: summary.balance, bold: true },
            ].map((row) => (
              <div key={row.label} className={`flex justify-between items-center py-2 ${row.bold ? "border-t font-semibold" : ""}`}>
                <span className="text-muted-foreground">{row.label}</span>
                <span className={row.bold ? "text-foreground" : ""}>৳{row.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <DashboardLayout>
      {user.role === "admin" ? (
        <AdminDashboard />
      ) : user.role === "user" ? (
        <UserDashboard userId={user.id} />
      ) : (
        <AdminDashboard />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
