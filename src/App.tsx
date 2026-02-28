import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/mock-data";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import MealsPage from "./pages/MealsPage";
import RentPage from "./pages/RentPage";
import FinancesPage from "./pages/FinancesPage";
import MealOffPage from "./pages/MealOffPage";
import MealHistoryPage from "./pages/MealHistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !hasRole(roles)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute roles={["admin", "manager"]}><UsersPage /></ProtectedRoute>} />
      <Route path="/meals" element={<ProtectedRoute roles={["admin", "meal_manager"]}><MealsPage /></ProtectedRoute>} />
      <Route path="/rent" element={<ProtectedRoute roles={["admin", "manager"]}><RentPage /></ProtectedRoute>} />
      <Route path="/finances" element={<ProtectedRoute roles={["admin", "manager", "meal_manager", "user"]}><FinancesPage /></ProtectedRoute>} />
      <Route path="/meal-off" element={<ProtectedRoute roles={["admin", "meal_manager", "manager", "user"]}><MealOffPage /></ProtectedRoute>} />
      <Route path="/meal-history" element={<ProtectedRoute roles={["admin", "manager", "meal_manager", "user"]}><MealHistoryPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
