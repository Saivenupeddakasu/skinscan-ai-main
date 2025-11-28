import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

    // Call Lovable AI with Gemini 2.5 Flash for vision analysis
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert dermatology AI assistant. Analyze skin condition images with high accuracy and provide detailed medical information. 

CRITICAL ANALYSIS REQUIREMENTS:
- Provide highly accurate disease identification based on visual characteristics
- Assess confidence score (0-100) based on image quality and clarity of symptoms
- Determine severity: mild, moderate, or severe
- List specific visible symptoms
- Provide evidence-based treatment recommendations
- Suggest dietary/nutritional support when relevant

RESPONSE FORMAT (JSON only):
{
  "disease_name": "Specific condition name",
  "confidence_score": 85,
  "severity": "moderate",
  "symptoms": ["symptom1", "symptom2", "symptom3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "food_recommendations": ["food1", "food2", "food3"]
}

SUPPORTED CONDITIONS (but not limited to):
- Acne (various types)
- Eczema/Atopic Dermatitis
- Psoriasis
- Rosacea
- Melanoma/Skin Cancer (urgent referral needed)
- Contact Dermatitis
- Fungal Infections (Ringworm, Candidiasis)
- Vitiligo
- Seborrheic Dermatitis
- Hives/Urticaria
- Warts
- Folliculitis
- Keratosis Pilaris

Always recommend consulting a dermatologist for proper diagnosis and treatment.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this skin condition image and provide a detailed assessment. Return ONLY valid JSON with no additional text.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service unavailable. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response:", JSON.stringify(data, null, 2));

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let result;
    try {
      // Extract JSON if wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Content:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate required fields
    if (!result.disease_name || !result.confidence_score || !result.severity) {
      throw new Error("Invalid response format from AI");
    }

    // Ensure arrays exist
    result.symptoms = result.symptoms || [];
    result.recommendations = result.recommendations || [];
    result.food_recommendations = result.food_recommendations || [];

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in analyze-skin function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Analysis failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
