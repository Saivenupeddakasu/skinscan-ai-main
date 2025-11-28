import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Activity, Shield, History, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={false} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden animate-fade-in">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="p-4 bg-gradient-primary rounded-3xl hover-scale">
                <Activity className="h-16 w-16 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              AI-Powered Skin Disease Detection
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get instant, accurate analysis of skin conditions using advanced AI technology.
              Upload or capture an image for immediate results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="h-14 px-8 text-lg font-semibold hover-scale bg-gradient-primary"
              >
                Get Started Free
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-semibold hover-scale"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">Why Choose SkinVision AI?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl shadow-md border border-border hover-scale animate-fade-in">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Analysis</h3>
                <p className="text-muted-foreground">
                  Get AI-powered results in seconds with high accuracy using advanced Gemini 2.5 Flash vision model.
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-md border border-border hover-scale animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mb-4">
                  <History className="h-6 w-6 text-success-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Track History</h3>
                <p className="text-muted-foreground">
                  Save and compare past analyses to monitor changes in your skin condition over time.
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-md border border-border hover-scale animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="w-12 h-12 bg-gradient-warning rounded-xl flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-warning-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Detailed Reports</h3>
                <p className="text-muted-foreground">
                  Receive comprehensive analysis with symptoms, recommendations, and dietary guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-card p-12 rounded-2xl shadow-lg border border-border hover-scale animate-fade-in">
            <Shield className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-3xl font-bold">Start Your Skin Analysis Today</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of users who trust our AI-powered platform for accurate skin condition analysis.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="h-14 px-12 text-lg font-semibold hover-scale bg-gradient-primary"
            >
              Create Free Account
            </Button>
            <p className="text-sm text-muted-foreground">
              Must be 18+ to use this service • Free to start
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Medical Disclaimer:</strong> SkinVision AI provides AI-generated analysis for
              informational purposes only. This service is not a substitute for professional medical
              advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any
              questions regarding a medical condition.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              © 2024 SkinVision AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
