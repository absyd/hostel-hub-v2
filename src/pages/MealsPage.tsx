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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, DollarSign, UtensilsCrossed, Plus, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MealsPage = () => {
  const [selectedDate, setSelectedDate] = useState("2026-02-27");
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [guestMeals, setGuestMeals] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
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

  const handleAddGuestMeals = () => {
    if (!selectedUser) {
      toast({ title: "Error", description: "Please select a user", variant: "destructive" });
      return;
    }
    
    const totalGuestMeals = guestMeals.breakfast + guestMeals.lunch + guestMeals.dinner;
    if (totalGuestMeals === 0) {
      toast({ title: "Error", description: "Please add at least one guest meal", variant: "destructive" });
      return;
    }

    toast({ 
      title: "Guest meals added", 
      description: `Added ${totalGuestMeals} guest meal(s) for ${mockUsers.find(u => u.id === selectedUser)?.name}` 
    });
    
    // Reset form
    setSelectedUser("");
    setGuestMeals({ breakfast: 0, lunch: 0, dinner: 0 });
    setGuestDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Meal Management</h1>
            <p className="text-muted-foreground">Track daily meals for all residents</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-9">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Guest Meals
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Guest Meals</DialogTitle>
                  <DialogDescription>
                    Add extra meals for guests visiting residents on {selectedDate}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">Select Resident</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a resident" />
                      </SelectTrigger>
                      <SelectContent>
                        {residents.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - Room {user.roomNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Number of Guest Meals</Label>
                    {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                      <div key={meal} className="flex items-center justify-between">
                        <Label htmlFor={meal} className="capitalize">{meal}</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGuestMeals(prev => ({ 
                              ...prev, 
                              [meal]: Math.max(0, prev[meal] - 1) 
                            }))}
                            disabled={guestMeals[meal] === 0}
                          >
                            -
                          </Button>
                          <Input
                            id={meal}
                            type="number"
                            min="0"
                            max="10"
                            value={guestMeals[meal]}
                            onChange={(e) => setGuestMeals(prev => ({ 
                              ...prev, 
                              [meal]: Math.max(0, Math.min(10, parseInt(e.target.value) || 0)) 
                            }))}
                            className="w-16 text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGuestMeals(prev => ({ 
                              ...prev, 
                              [meal]: Math.min(10, prev[meal] + 1) 
                            }))}
                            disabled={guestMeals[meal] === 10}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Guest Meals:</span>
                      <span className="font-bold text-primary">
                        {guestMeals.breakfast + guestMeals.lunch + guestMeals.dinner}
                      </span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setGuestDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddGuestMeals}>
                    Add Guest Meals
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Card className="border border-border bg-card px-4 py-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Meal Rate: <span className="font-semibold text-foreground">৳{mockMealRate.ratePerMeal}/meal</span>
              </div>
            </Card>
          </div>
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

        <Card className="border border-border bg-card">
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
