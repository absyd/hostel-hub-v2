import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockUsers, mockRentPayments } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  paid: { label: "Paid", icon: CheckCircle, class: "bg-success/10 text-success border-success/20" },
  partial: { label: "Partial", icon: Clock, class: "bg-warning/10 text-warning border-warning/20" },
  unpaid: { label: "Unpaid", icon: AlertCircle, class: "bg-destructive/10 text-destructive border-destructive/20" },
};

const RentPage = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const residents = mockUsers.filter((u) => u.role === "user");
  const filteredResidents = residents.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.roomNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleMarkPaid = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    toast({ title: "Payment recorded", description: `Rent marked as paid for ${user?.name}.` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Rent Management</h1>
          <p className="text-muted-foreground">Track and manage monthly rent payments</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Expected",
              value: `৳${residents.reduce((s, u) => s + u.monthlyRent, 0).toLocaleString()}`,
              variant: "default" as const,
            },
            {
              label: "Collected",
              value: `৳${mockRentPayments.reduce((s, p) => s + p.amount, 0).toLocaleString()}`,
              variant: "default" as const,
            },
            {
              label: "Outstanding",
              value: `৳${(
                residents.reduce((s, u) => s + u.monthlyRent, 0) -
                mockRentPayments.reduce((s, p) => s + p.amount, 0)
              ).toLocaleString()}`,
              variant: "destructive" as const,
            },
          ].map((item) => (
            <Card key={item.label} className="shadow-card">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search residents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResidents.map((user) => {
                  const payment = mockRentPayments.find((p) => p.userId === user.id);
                  const status = payment?.status ?? "unpaid";
                  const cfg = statusConfig[status];
                  const StatusIcon = cfg.icon;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="font-mono text-sm">{user.roomNumber}</TableCell>
                      <TableCell>৳{user.monthlyRent.toLocaleString()}</TableCell>
                      <TableCell>৳{(payment?.amount ?? 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${cfg.class} gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {status !== "paid" && (
                          <Button size="sm" variant="outline" onClick={() => handleMarkPaid(user.id)}>
                            Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RentPage;
