import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, Loader2 } from "lucide-react";
import ScanResult from "@/components/ScanResult";
import Navigation from "@/components/Navigation";
import CameraCapture from "@/components/CameraCapture";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile || !user) return;

    setLoading(true);
    try {
      // Upload image to storage
      const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("skin-scans")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("skin-scans")
        .getPublicUrl(fileName);

      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Call edge function for analysis
        const { data, error } = await supabase.functions.invoke("analyze-skin", {
          body: { image: base64Image },
        });

        if (error) throw error;

        // Save scan to database
        const { error: dbError } = await supabase.from("skin_scans").insert({
          user_id: user.id,
          image_url: publicUrl,
          disease_name: data.disease_name,
          confidence_score: data.confidence_score,
          severity: data.severity,
          symptoms: data.symptoms,
          recommendations: data.recommendations,
          food_recommendations: data.food_recommendations,
        });

        if (dbError) throw dbError;

        setScanResult(data);
        toast({
          title: "Analysis Complete",
          description: "Your skin analysis has been completed successfully.",
        });
      };
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCameraCapture = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-4xl font-bold mb-3">Skin Disease Detection</h2>
            <p className="text-muted-foreground text-lg">
              Upload or capture an image for instant AI-powered analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card className="shadow-md hover-scale animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Upload Image</h3>
                
                {!previewUrl ? (
                  <div className="space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 flex flex-col gap-2 hover-scale"
                      variant="outline"
                    >
                      <Upload className="h-8 w-8" />
                      <span>Choose from Gallery</span>
                    </Button>
                    
                    <Button
                      onClick={() => setShowCamera(true)}
                      className="w-full h-32 flex flex-col gap-2 hover-scale bg-gradient-primary"
                    >
                      <Camera className="h-8 w-8" />
                      <span>Take Photo</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-scale-in">
                    <div className="relative rounded-lg overflow-hidden border border-border">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="flex-1 h-12 font-semibold hover-scale bg-gradient-primary"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Analyze Skin"
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setImageFile(null);
                          setPreviewUrl("");
                          setScanResult(null);
                        }}
                        variant="outline"
                        className="h-12 hover-scale"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Disclaimer:</strong> This tool provides preliminary analysis only. Always
                    consult a qualified dermatologist for proper diagnosis and treatment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div>
              {scanResult ? (
                <ScanResult result={scanResult} />
              ) : (
                <Card className="shadow-md animate-fade-in">
                  <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
                    <div className="text-center text-muted-foreground">
                      <Upload className="h-16 w-16 mx-auto mb-4 opacity-40" />
                      <p className="text-lg">Upload an image to see results</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
