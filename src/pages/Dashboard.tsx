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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UtensilsCrossed, Building2, DollarSign, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <Card className="border border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1">
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
  const pieColors = ["hsl(0 0% 9%)", "hsl(0 0% 40%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and analytics</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Residents" value={totalResidents} icon={Users} description="Active members" trend="+2 this month" />
        <StatCard title="Meals Today" value={totalMealsToday} icon={UtensilsCrossed} description={`Rate: ৳${mockMealRate.ratePerMeal}/meal`} />
        <StatCard title="Rent Collected" value={`৳${totalRentCollected.toLocaleString()}`} icon={DollarSign} description="This month" />
        <StatCard title="Unpaid Rent" value={unpaidRent} icon={AlertCircle} description="Pending payments" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Meals This Week</CardTitle>
            <CardDescription className="text-sm">Daily total meal count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mealChartData}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="meals" fill="hsl(0 0% 9%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Users by Role</CardTitle>
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
  
  // Get user's meal history for the current month
  const userMealHistory = mockMealEntries
    .filter(entry => entry.userId === userId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-5); // Show last 5 days

  // Get full meal history for the detailed tab
  const fullMealHistory = mockMealEntries
    .filter(entry => entry.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const mealChartData = userMealHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    breakfast: entry.breakfast ? 1 : 0,
    lunch: entry.lunch ? 1 : 0,
    dinner: entry.dinner ? 1 : 0,
    total: entry.totalMeals
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground">Your monthly summary for February 2026</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Meals" value={summary.totalMeals} icon={UtensilsCrossed} description="This month" />
        <StatCard title="Meal Cost" value={`৳${summary.mealCost.toLocaleString()}`} icon={DollarSign} description={`@৳${mockMealRate.ratePerMeal}/meal`} />
        <StatCard title="Rent" value={`৳${summary.rent.toLocaleString()}`} icon={Building2} description={`Room ${user.roomNumber}`} />
        <StatCard title="Balance Due" value={`৳${summary.balance.toLocaleString()}`} icon={AlertCircle} description={summary.balance > 0 ? "Payment pending" : "All clear!"} />
      </div>
      
      {/* Meal History Section */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Recent Meal History
          </CardTitle>
          <CardDescription className="text-sm">Your meal consumption for the last 5 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealChartData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(220 13% 3%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Meal Details Tabs */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Meal Details
          </CardTitle>
          <CardDescription className="text-sm">View your detailed meal history</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Daily Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{userMealHistory.reduce((sum, entry) => sum + entry.totalMeals, 0)}</div>
                  <div className="text-sm text-muted-foreground">Meals (Last 5 days)</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-success">{userMealHistory.filter(entry => entry.totalMeals === 3).length}</div>
                  <div className="text-sm text-muted-foreground">Full Days</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-warning">{userMealHistory.filter(entry => entry.totalMeals === 0).length}</div>
                  <div className="text-sm text-muted-foreground">No Meal Days</div>
                </div>
              </div>
              <div className="space-y-2">
                {userMealHistory.map((entry) => (
                  <div key={entry.date} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex gap-1">
                        {entry.breakfast && <Badge variant="default" className="text-xs">B</Badge>}
                        {entry.lunch && <Badge variant="default" className="text-xs">L</Badge>}
                        {entry.dinner && <Badge variant="default" className="text-xs">D</Badge>}
                      </div>
                    </div>
                    <Badge variant="outline" className="min-w-8 justify-center">
                      {entry.totalMeals}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Breakfast</TableHead>
                      <TableHead className="text-center">Lunch</TableHead>
                      <TableHead className="text-center">Dinner</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fullMealHistory.map((entry) => (
                      <TableRow key={entry.date}>
                        <TableCell className="text-sm">
                          {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={entry.breakfast ? "default" : "secondary"} className="min-w-6 justify-center">
                            {entry.breakfast ? "✓" : "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={entry.lunch ? "default" : "secondary"} className="min-w-6 justify-center">
                            {entry.lunch ? "✓" : "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={entry.dinner ? "default" : "secondary"} className="min-w-6 justify-center">
                            {entry.dinner ? "✓" : "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="min-w-8 justify-center">
                            {entry.totalMeals}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-medium">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Meal Cost", value: summary.mealCost },
              { label: "Rent", value: summary.rent },
              { label: "Total Due", value: summary.totalDue, bold: true },
              { label: "Paid", value: summary.paidAmount },
              { label: "Balance", value: summary.balance, bold: true },
            ].map((row) => (
              <div key={row.label} className={`flex justify-between items-center py-3 ${row.bold ? "border-t border-border font-semibold" : ""}`}>
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
