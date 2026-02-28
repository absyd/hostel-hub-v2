import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  DollarSign,
  CalendarOff,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_LABELS, UserRole } from "@/lib/mock-data";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "meal_manager", "user"] },
  { title: "Users", url: "/users", icon: Users, roles: ["admin", "manager"] },
  { title: "Meals", url: "/meals", icon: UtensilsCrossed, roles: ["admin", "meal_manager"] },
  { title: "Rent", url: "/rent", icon: Building2, roles: ["admin", "manager"] },
  { title: "Finances", url: "/finances", icon: BarChart3, roles: ["admin", "manager", "meal_manager", "user"] },
  { title: "Meal Off", url: "/meal-off", icon: CalendarOff, roles: ["admin", "meal_manager", "manager", "user"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="gradient-hero">
        {/* Brand */}
        <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-slide-in">
              <h1 className="text-sm font-bold text-sidebar-foreground">HostelHub</h1>
              <p className="text-xs text-sidebar-muted">Management System</p>
            </div>
          )}
        </div>

        <Separator className="bg-sidebar-border mx-3 w-auto" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-xs uppercase tracking-wider">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end
                        className="text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gradient-hero border-t-0">
        <Separator className="bg-sidebar-border mx-1 w-auto" />
        <div className={`flex items-center gap-3 px-2 py-3 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="h-8 w-8 shrink-0 border border-sidebar-border">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-slide-in">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <Badge variant="outline" className="mt-0.5 text-[10px] border-sidebar-border text-sidebar-muted px-1.5 py-0">
                {ROLE_LABELS[user.role]}
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 shrink-0"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
