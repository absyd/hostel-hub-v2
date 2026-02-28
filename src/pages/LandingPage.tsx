import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, UtensilsCrossed, DollarSign, ArrowRight, Sparkles, CheckCircle2, Clock, Award, Target } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "User Management",
      description: "Streamlined resident registration, role assignment, and profile management with secure access controls"
    },
    {
      icon: UtensilsCrossed,
      title: "Meal Tracking",
      description: "Intelligent meal monitoring, automated cost calculation, and dietary preference management"
    },
    {
      icon: DollarSign,
      title: "Financial Management",
      description: "Automated rent collection, expense tracking, and comprehensive financial reporting"
    }
  ];

  const stats = [
    { label: "Hostels", value: "500+" },
    { label: "Residents managed", value: "25k+" },
    { label: "Monthly entries", value: "1.2M+" },
    { label: "Satisfaction", value: "98%" },
  ];

  const benefits = [
    {
      icon: CheckCircle2,
      title: "Efficient Operations",
      description: "Reduce administrative workload by 60% with automated workflows"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock access with real-time updates and notifications"
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Trusted by 500+ hostels with 98% customer satisfaction rate"
    },
    {
      icon: Target,
      title: "Smart Analytics",
      description: "Data-driven insights for optimized decision making and growth planning"
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_10%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(900px_circle_at_80%_0%,hsl(262_83%_58%/0.10),transparent_50%)] bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"></div>
        <div className="absolute -top-24 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,hsl(var(--primary)/0.25),hsl(262_83%_58%/0.25),hsl(38_92%_50%/0.18),hsl(var(--primary)/0.25))] blur-3xl"></div>
        <div className="container mx-auto px-6 py-28 relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg animate-pulse-glow">
                <Building2 className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-primary animate-float" />
              <span className="text-sm font-medium text-primary">Modern hostel operations, simplified</span>
              <Sparkles className="h-5 w-5 text-primary animate-float" style={{ animationDelay: "1s" }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              HostelHub
              <span className="block text-3xl md:text-4xl font-light text-muted-foreground mt-2">
                Hostel & Meal Management
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Complete hostel management solution — residents, meals, rent & finances — all in one place. 
              Experience the future of hostel administration with our cutting-edge platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="h-12 px-8 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/login")}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-8 text-base font-medium border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card/70 backdrop-blur-sm px-4 py-4">
                  <div className="text-2xl font-semibold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Everything You Need to Manage Your Hostel
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Streamline your hostel operations with our comprehensive management tools designed for efficiency and ease of use
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="text-2xl font-semibold text-foreground">Built for role-based clarity</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                Admin, Manager, Meal Manager, and Resident dashboards — each with the right tools, the right data, and the right access.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Role-based access", "Meal cost automation", "Rent tracking", "Monthly summaries"].map((pill) => (
                  <span key={pill} className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border border-border bg-card/70 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <benefit.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-semibold">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Hostel Management?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of hostel managers who trust HostelHub for their daily operations. 
              Experience efficiency, clarity, and control like never before.
            </p>
            <Button 
              size="lg" 
              className="h-14 px-10 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/login")}
            >
              Start Using HostelHub
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">HostelHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 HostelHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
