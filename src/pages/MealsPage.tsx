import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockUsers, mockMealEntries, mockMealRate } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, ChevronLeft, ChevronRight, DollarSign, UtensilsCrossed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MealsPage = () => {
  const [selectedDate, setSelectedDate] = useState("2026-02-27");
  const { toast } = useToast();
  const residents = mockUsers.filter((u) => u.role === "user" || u.role === "meal_manager" || u.role === "manager");

  const dayEntries = mockMealEntries.filter((e) => e.date === selectedDate);

  const totalMealsToday = dayEntries.reduce((s, e) => s + e.totalMeals, 0);

  const navigateDay = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleSave = () => {
    toast({ title: "Meals saved", description: `Meal entries for ${selectedDate} have been updated.` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Meal Management</h1>
            <p className="text-muted-foreground">Track daily meals for all residents</p>
          </div>
          <Card className="shadow-card px-4 py-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Meal Rate: <span className="font-semibold text-foreground">৳{mockMealRate.ratePerMeal}/meal</span>
            </div>
          </Card>
        </div>

        {/* Date nav */}
        <div className="flex items-center gap-4">
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
          <Badge variant="secondary" className="ml-auto">
            <UtensilsCrossed className="h-3 w-3 mr-1" />
            {totalMealsToday} meals today
          </Badge>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead className="text-center">Breakfast</TableHead>
                  <TableHead className="text-center">Lunch</TableHead>
                  <TableHead className="text-center">Dinner</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residents.map((user) => {
                  const entry = dayEntries.find((e) => e.userId === user.id);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">Room {user.roomNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={entry?.breakfast ?? false} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={entry?.lunch ?? false} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={entry?.dinner ?? false} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={entry?.totalMeals === 3 ? "default" : "secondary"} className="min-w-8 justify-center">
                          {entry?.totalMeals ?? 0}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Meal Entries</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MealsPage;
