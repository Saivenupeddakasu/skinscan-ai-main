import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplets, Sun, Apple, Heart, Shield, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const SkinCare = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const tips = [
    {
      icon: Droplets,
      title: "Stay Hydrated",
      description: "Drink 8-10 glasses of water daily to maintain skin moisture and elasticity.",
      color: "text-primary",
    },
    {
      icon: Sun,
      title: "Sun Protection",
      description: "Use SPF 30+ sunscreen daily to prevent UV damage and premature aging.",
      color: "text-warning",
    },
    {
      icon: Apple,
      title: "Healthy Diet",
      description: "Eat antioxidant-rich foods like berries, nuts, and leafy greens for glowing skin.",
      color: "text-success",
    },
    {
      icon: Heart,
      title: "Gentle Cleansing",
      description: "Cleanse twice daily with mild products to remove dirt without stripping natural oils.",
      color: "text-destructive",
    },
    {
      icon: Shield,
      title: "Moisturize",
      description: "Apply moisturizer within 3 minutes after washing to lock in hydration.",
      color: "text-accent",
    },
    {
      icon: Sparkles,
      title: "Quality Sleep",
      description: "Get 7-9 hours of sleep for optimal skin repair and regeneration.",
      color: "text-primary",
    },
  ];

  const routines = [
    {
      time: "Morning",
      steps: [
        "Gentle cleanser",
        "Vitamin C serum",
        "Eye cream",
        "Moisturizer with SPF 30+",
      ],
    },
    {
      time: "Evening",
      steps: [
        "Oil-based cleanser (if wearing makeup)",
        "Water-based cleanser",
        "Toner or essence",
        "Treatment (retinol/acids)",
        "Night cream or sleeping mask",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Guide to Healthy Skin
          </h1>
          <p className="text-lg text-muted-foreground">
            Expert tips and routines for maintaining beautiful, healthy skin
          </p>
        </div>

        {/* Tips Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">
            Essential Skin Care Tips
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <Card
                key={index}
                className="hover-scale animate-fade-in shadow-md"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4`}>
                    <tip.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Routines Section */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-8">
            Daily Skin Care Routines
          </h2>
          <Tabs defaultValue="morning" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="morning">Morning Routine</TabsTrigger>
              <TabsTrigger value="evening">Evening Routine</TabsTrigger>
            </TabsList>
            {routines.map((routine) => (
              <TabsContent
                key={routine.time}
                value={routine.time.toLowerCase()}
                className="animate-fade-in"
              >
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-6">
                      {routine.time} Routine
                    </h3>
                    <div className="space-y-4">
                      {routine.steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-foreground flex-1 pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-muted/50 animate-fade-in">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Note:</strong> These are general skin care guidelines.
                For personalized advice or concerns about skin conditions, consult
                a qualified dermatologist.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SkinCare;
