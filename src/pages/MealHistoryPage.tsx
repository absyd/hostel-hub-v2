import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockUsers, mockMealEntries, mockMealRate } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, ChevronLeft, ChevronRight, UtensilsCrossed, Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MealHistoryPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState("2026-02-27");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [viewMode, setViewMode] = useState<"personal" | "all">("personal");

  const navigateDay = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  // Get meal entries based on view mode and filters
  let mealEntries = mockMealEntries;
  
  if (viewMode === "personal" && user) {
    mealEntries = mealEntries.filter(entry => entry.userId === user.id);
  }

  if (selectedUser !== "all") {
    mealEntries = mealEntries.filter(entry => entry.userId === selectedUser);
  }

  if (searchTerm) {
    mealEntries = mealEntries.filter(entry => {
      const userEntry = mockUsers.find(u => u.id === entry.userId);
      return userEntry?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             userEntry?.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  // Sort by date (most recent first)
  mealEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get unique users for filter dropdown
  const availableUsers = viewMode === "personal" && user 
    ? [user] 
    : mockUsers.filter(u => u.role === "user" || u.role === "meal_manager" || u.role === "manager");

  const getUserName = (userId: string) => {
    const userEntry = mockUsers.find(u => u.id === userId);
    return userEntry ? `${userEntry.name} (Room ${userEntry.roomNumber})` : "Unknown";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Meal History</h1>
            <p className="text-muted-foreground">
              {viewMode === "personal" ? "Your personal meal history" : "Complete meal history for all residents"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === "admin" || user?.role === "manager" || user?.role === "meal_manager" ? (
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "personal" | "all")}>
                <TabsList>
                  <TabsTrigger value="personal">My Meals</TabsTrigger>
                  <TabsTrigger value="all">All Meals</TabsTrigger>
                </TabsList>
              </Tabs>
            ) : null}
            <Card className="border border-border bg-card px-4 py-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <UtensilsCrossed className="h-4 w-4" />
                Meal Rate: <span className="font-semibold text-foreground">৳{mockMealRate.ratePerMeal}/meal</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              {viewMode === "all" && (
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="All users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - Room {user.roomNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="icon" onClick={() => navigateDay(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={() => navigateDay(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal History Table */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-medium">Meal Entries</CardTitle>
            <CardDescription>
              {mealEntries.length} meal entries found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {viewMode === "all" && <TableHead>Resident</TableHead>}
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Breakfast</TableHead>
                    <TableHead className="text-center">Lunch</TableHead>
                    <TableHead className="text-center">Dinner</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mealEntries.map((entry) => (
                    <TableRow key={`${entry.userId}-${entry.date}`}>
                      {viewMode === "all" && (
                        <TableCell className="font-medium text-sm">
                          {getUserName(entry.userId)}
                        </TableCell>
                      )}
                      <TableCell className="text-sm">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
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
                      <TableCell className="text-right font-medium">
                        ৳{(entry.totalMeals * mockMealRate.ratePerMeal).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border border-border bg-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {mealEntries.reduce((sum, entry) => sum + entry.totalMeals, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Meals</div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success">
                {mealEntries.filter(entry => entry.totalMeals === 3).length}
              </div>
              <div className="text-sm text-muted-foreground">Full Days</div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-warning">
                ৳{mealEntries.reduce((sum, entry) => sum + (entry.totalMeals * mockMealRate.ratePerMeal), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MealHistoryPage;
