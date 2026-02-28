import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockUsers, getMonthlySummary, mockMealRate } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

const FinancesPage = () => {
  const { user: currentUser } = useAuth();
  const isResident = currentUser?.role === "user";
  const users = isResident
    ? mockUsers.filter((u) => u.id === currentUser?.id)
    : mockUsers.filter((u) => u.role === "user");

  const summaries = users.map((u) => ({ user: u, ...getMonthlySummary(u.id) }));

  const totalDue = summaries.reduce((s, r) => s + r.totalDue, 0);
  const totalPaid = summaries.reduce((s, r) => s + r.paidAmount, 0);
  const totalBalance = summaries.reduce((s, r) => s + r.balance, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Financial Summary</h1>
          <p className="text-muted-foreground">
            {isResident ? "Your monthly financial overview" : "Overview for February 2026"}
          </p>
        </div>

        {!isResident && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="border border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Total Due</p>
                <p className="text-2xl font-semibold text-foreground mt-1">৳{totalDue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-semibold text-success mt-1">৳{totalPaid.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border border-border bg-card">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-semibold text-destructive mt-1">৳{totalBalance.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-medium">Monthly Breakdown</CardTitle>
            <CardDescription className="text-sm">Meal rate: ৳{mockMealRate.ratePerMeal}/meal</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead className="text-right">Meals</TableHead>
                    <TableHead className="text-right">Meal Cost</TableHead>
                    <TableHead className="text-right">Rent</TableHead>
                    <TableHead className="text-right">Total Due</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaries.map((row) => (
                    <TableRow key={row.userId}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{row.user.name}</p>
                          <p className="text-xs text-muted-foreground">Room {row.user.roomNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{row.totalMeals}</TableCell>
                      <TableCell className="text-right">৳{row.mealCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right">৳{row.rent.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold">৳{row.totalDue.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-success">৳{row.paidAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            row.balance <= 0
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          ৳{row.balance.toLocaleString()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FinancesPage;
