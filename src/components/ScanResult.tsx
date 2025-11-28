import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Pill, Apple } from "lucide-react";

interface ScanResultProps {
  result: {
    disease_name: string;
    confidence_score: number;
    severity: string;
    symptoms: string[];
    recommendations: string[];
    food_recommendations?: string[];
  };
}

const ScanResult = ({ result }: ScanResultProps) => {
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "mild":
        return <CheckCircle className="h-5 w-5" />;
      case "moderate":
      case "severe":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Analysis Results</span>
          <Badge variant="outline">
            Confidence: {result.confidence_score}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Disease Name & Severity */}
        <div className="space-y-3">
          <div>
            <h3 className="text-2xl font-bold">{result.disease_name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getSeverityColor(result.severity)}>
              {getSeverityIcon(result.severity)}
              <span className="ml-1.5 capitalize">{result.severity}</span>
            </Badge>
          </div>
        </div>

        {/* Symptoms */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Common Symptoms
          </h4>
          <ul className="space-y-1 ml-6">
            {result.symptoms.map((symptom, index) => (
              <li key={index} className="text-sm text-muted-foreground list-disc">
                {symptom}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Recommendations
          </h4>
          <ul className="space-y-1 ml-6">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-muted-foreground list-disc">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        {/* Food Recommendations */}
        {result.food_recommendations && result.food_recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Apple className="h-4 w-4" />
              Dietary Recommendations
            </h4>
            <ul className="space-y-1 ml-6">
              {result.food_recommendations.map((food, index) => (
                <li key={index} className="text-sm text-muted-foreground list-disc">
                  {food}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Medical Disclaimer */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Medical Disclaimer:</strong> This analysis is AI-generated and for informational
            purposes only. It is not a substitute for professional medical advice, diagnosis, or
            treatment. Always seek the advice of a qualified healthcare provider with any questions
            regarding a medical condition.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResult;
