import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";

const History = () => {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("skin_scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load scan history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("skin_scans").delete().eq("id", id);
      if (error) throw error;

      setScans(scans.filter((scan) => scan.id !== id));
      toast({
        title: "Deleted",
        description: "Scan deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete scan",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-success text-success-foreground";
      case "moderate":
        return "bg-warning text-warning-foreground";
      case "severe":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} />

      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4 hover-scale">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold mb-2">Scan History</h1>
            <p className="text-muted-foreground">View all your previous skin analyses</p>
          </div>

          {loading ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-muted-foreground">Loading history...</p>
            </div>
          ) : scans.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-lg">No scans yet</p>
                <Button onClick={() => navigate("/dashboard")} className="mt-4 hover-scale bg-gradient-primary">
                  Start Your First Scan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {scans.map((scan, index) => (
                <Card key={scan.id} className="shadow-md hover-scale animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={scan.image_url}
                          alt="Scan"
                          className="w-32 h-32 object-cover rounded-lg border border-border"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">{scan.disease_name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(scan.created_at), "PPP")}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(scan.id)}
                            className="hover-scale"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Badge className={getSeverityColor(scan.severity)}>
                            {scan.severity}
                          </Badge>
                          <Badge variant="outline">
                            Confidence: {scan.confidence_score}%
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Symptoms:</h4>
                            <p className="text-sm text-muted-foreground">
                              {scan.symptoms.join(", ")}
                            </p>
                          </div>
                          
                          {scan.food_recommendations && scan.food_recommendations.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-1">
                                Food Recommendations:
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {scan.food_recommendations.join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
