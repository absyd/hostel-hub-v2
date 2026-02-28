import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockMealOffRequests, mockUsers, MealOffRequest } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarOff, Check, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<MealOffRequest["status"], string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const MealOffPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<MealOffRequest[]>(mockMealOffRequests);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMeals, setNewMeals] = useState({ breakfast: true, lunch: true, dinner: true });

  if (!user) return null;

  const isReviewer = user.role === "admin" || user.role === "meal_manager";
  const isUser = user.role === "user";

  // Tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const myRequests = requests.filter((r) => r.userId === user.id);
  const pendingReviews = requests.filter((r) => r.status === "pending");
  const allRequests = isReviewer ? requests : myRequests;

  const alreadyRequested = myRequests.some((r) => r.date === tomorrowStr && r.status !== "rejected");

  const handleSubmit = () => {
    if (!newMeals.breakfast && !newMeals.lunch && !newMeals.dinner) {
      toast({ title: "Select at least one meal", variant: "destructive" });
      return;
    }
    const newReq: MealOffRequest = {
      id: `mor-${Date.now()}`,
      userId: user.id,
      date: tomorrowStr,
      requestedAt: new Date().toISOString(),
      status: "pending",
      meals: { ...newMeals },
    };
    setRequests((prev) => [...prev, newReq]);
    setDialogOpen(false);
    setNewMeals({ breakfast: true, lunch: true, dinner: true });
    toast({ title: "Request submitted", description: `Meal off request for ${tomorrowStr} sent for review.` });
  };

  const handleReview = (id: string, status: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, reviewedBy: user.id } : r))
    );
    toast({ title: `Request ${status}`, description: `Meal off request has been ${status}.` });
  };

  const getUserName = (userId: string) => mockUsers.find((u) => u.id === userId)?.name ?? "Unknown";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Meal Off Requests</h1>
          <p className="text-muted-foreground">
            {isReviewer ? "Review and manage meal exemption requests" : "Request meal exemptions for upcoming dates"}
          </p>
          {isUser && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 h-9">
                  <Plus className="h-4 w-4 mr-2" />
                  Request Meal Off
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Meal Off</DialogTitle>
                  <DialogDescription>
                    Select which meals you want to turn off for <strong>{tomorrowStr}</strong>. This will be reviewed by a meal manager or admin.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                    <div key={meal} className="flex items-center gap-3">
                      <Checkbox
                        id={meal}
                        checked={newMeals[meal]}
                        onCheckedChange={(checked) =>
                          setNewMeals((prev) => ({ ...prev, [meal]: !!checked }))
                        }
                      />
                      <Label htmlFor={meal} className="capitalize text-sm">{meal}</Label>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {alreadyRequested && isUser && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-3">
              <CalendarOff className="h-5 w-5 text-primary" />
              <p className="text-sm">You already have a meal off request for tomorrow ({tomorrowStr}).</p>
            </CardContent>
          </Card>
        )}

        {/* Pending reviews for reviewers */}
        {isReviewer && pendingReviews.length > 0 && (
          <Card className="border border-border bg-card border-warning/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <CalendarOff className="h-4 w-4" />
                Pending Reviews
                <Badge variant="secondary">{pendingReviews.length}</Badge>
              </CardTitle>
              <CardDescription className="text-sm">These requests need your approval</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Meals Off</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReviews.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{getUserName(req.userId)}</TableCell>
                      <TableCell>{req.date}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center">
                          {req.meals.breakfast && <Badge variant="outline" className="text-xs">B</Badge>}
                          {req.meals.lunch && <Badge variant="outline" className="text-xs">L</Badge>}
                          {req.meals.dinner && <Badge variant="outline" className="text-xs">D</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" className="text-success hover:bg-success/10" onClick={() => handleReview(req.id, "approved")}>
                            <Check className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleReview(req.id, "rejected")}>
                            <X className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* All requests */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">{isReviewer ? "All Requests" : "My Requests"}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {isReviewer && <TableHead>Resident</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Meals Off</TableHead>
                  <TableHead>Status</TableHead>
                  {isReviewer && <TableHead>Reviewed By</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isReviewer ? 5 : 3} className="text-center text-muted-foreground py-8">
                      No meal off requests yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  allRequests.map((req) => (
                    <TableRow key={req.id}>
                      {isReviewer && <TableCell className="font-medium">{getUserName(req.userId)}</TableCell>}
                      <TableCell>{req.date}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center">
                          {req.meals.breakfast && <Badge variant="outline" className="text-xs">B</Badge>}
                          {req.meals.lunch && <Badge variant="outline" className="text-xs">L</Badge>}
                          {req.meals.dinner && <Badge variant="outline" className="text-xs">D</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyles[req.status]}>
                          {req.status}
                        </Badge>
                      </TableCell>
                      {isReviewer && (
                        <TableCell className="text-muted-foreground text-sm">
                          {req.reviewedBy ? getUserName(req.reviewedBy) : "—"}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MealOffPage;
