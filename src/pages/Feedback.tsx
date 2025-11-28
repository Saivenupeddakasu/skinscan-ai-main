import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Feedback = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rating, setRating] = useState("5");
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("general");
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank You for Your Feedback!",
      description: "Your input helps us improve our service.",
    });
    setRating("5");
    setFeedback("");
    setCategory("general");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} />

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-3xl">
              <MessageCircle className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            We Value Your Feedback
          </h1>
          <p className="text-lg text-muted-foreground">
            Help us improve by sharing your thoughts and experiences with SkinVision AI
          </p>
        </div>

        {/* Feedback Form */}
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg animate-fade-in">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Rating */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    How would you rate your experience?
                  </Label>
                  <RadioGroup
                    value={rating}
                    onValueChange={setRating}
                    className="flex justify-between"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex flex-col items-center gap-2">
                        <RadioGroupItem
                          value={String(num)}
                          id={`rating-${num}`}
                          className="sr-only peer"
                        />
                        <Label
                          htmlFor={`rating-${num}`}
                          className="cursor-pointer peer-data-[state=checked]:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-10 w-10 ${
                              Number(rating) >= num
                                ? "fill-warning text-warning"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Label>
                        <span className="text-sm text-muted-foreground">{num}</span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Category */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    What is your feedback about?
                  </Label>
                  <RadioGroup value={category} onValueChange={setCategory}>
                    <div className="space-y-3">
                      {[
                        { value: "general", label: "General Experience" },
                        { value: "accuracy", label: "AI Accuracy" },
                        { value: "ui", label: "User Interface" },
                        { value: "features", label: "Features & Functionality" },
                        { value: "other", label: "Other" },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label
                            htmlFor={option.value}
                            className="flex-1 cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Feedback Text */}
                <div className="space-y-4">
                  <Label htmlFor="feedback" className="text-lg font-semibold">
                    Tell us more
                  </Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or report any issues..."
                    rows={6}
                    required
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full hover-scale bg-gradient-primary"
                >
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          <Card className="mt-8 bg-muted/50 animate-fade-in">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Your feedback is invaluable to us. We review every submission and use
                your insights to continuously improve SkinVision AI.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
