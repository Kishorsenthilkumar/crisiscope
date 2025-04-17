
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for the edge function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for the model response
interface DroughtModelPrediction {
  riskScore: number;
  severity: string;
  probabilityPercent: number;
  durationMonths: number;
  impactLevel: string;
  waterReservoirLevel: number;
  rainfallDeficit: number;
  evaporationRate: number;
  vegetationHealthIndex: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stateId } = await req.json();
    
    // Validate inputs
    if (!stateId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: stateId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get API token from environment variables
    const HF_API_TOKEN = Deno.env.get("HUGGINGFACE_API_TOKEN");
    
    if (!HF_API_TOKEN) {
      console.error("HUGGINGFACE_API_TOKEN is not set");
      throw new Error("ML model API token not configured");
    }

    console.log(`Fetching drought predictions for state: ${stateId}`);
    
    // Get districts for the selected state
    const districts = await getDistrictsForState(stateId);
    
    // For each district, get predictions from the model
    const predictions = [];
    
    for (const district of districts) {
      // Get climate data for this district
      const climateData = await getClimateData(district.id);
      
      // Prepare input for the model
      const modelInput = {
        district_id: district.id,
        previous_rainfall: climateData.previousRainfall,
        current_rainfall: climateData.currentRainfall,
        temperature_anomaly: climateData.temperatureAnomaly,
        reservoir_level: climateData.reservoirLevel,
        soil_moisture: climateData.soilMoisture,
        evaporation_rate: climateData.evaporationRate,
        vegetation_index: climateData.vegetationIndex
      };
      
      // Call Hugging Face Inference API
      const prediction = await callDroughtModel(HF_API_TOKEN, modelInput);
      
      // Create agriculture impact message based on severity
      let agricultureImpact = "";
      if (prediction.severity === "extreme") {
        agricultureImpact = "Total crop failure likely. Severe water shortages. Livestock at high risk.";
      } else if (prediction.severity === "high") {
        agricultureImpact = "Significant crop yield reduction. Water rationing needed. Livestock health concerns.";
      } else if (prediction.severity === "medium") {
        agricultureImpact = "Moderate reduction in crop yields. Water conservation measures recommended.";
      } else {
        agricultureImpact = "Minor impact on crop production. Monitor water resources carefully.";
      }
      
      // Format the prediction in our app's format
      predictions.push({
        districtId: district.id,
        stateId,
        districtName: district.name,
        riskScore: prediction.riskScore,
        severity: prediction.severity,
        probabilityPercent: prediction.probabilityPercent,
        durationMonths: prediction.durationMonths,
        impactLevel: prediction.impactLevel,
        waterReservoirLevel: prediction.waterReservoirLevel,
        rainfallDeficit: prediction.rainfallDeficit,
        evaporationRate: prediction.evaporationRate,
        vegetationHealthIndex: prediction.vegetationHealthIndex,
        agricultureImpact,
        lastUpdated: new Date().toISOString()
      });
    }

    return new Response(
      JSON.stringify(predictions),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in drought-prediction function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch drought predictions", 
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Helper function to call the drought prediction model
async function callDroughtModel(apiToken: string, inputData: any): Promise<DroughtModelPrediction> {
  try {
    // This is where we'd normally call the actual HuggingFace model API
    // For now, we'll simulate a model response based on the input data
    
    // In production, replace this with a real API call like:
    /*
    const response = await fetch("https://api-inference.huggingface.co/models/YOUR_DROUGHT_MODEL_ID", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputData)
    });
    
    if (!response.ok) {
      throw new Error(`Model API error: ${response.statusText}`);
    }
    
    const result = await response.json();
    */
    
    // For now, we'll simulate a model response
    // In production, you would use the actual model's response format
    
    // Extract input values
    const rainfallDeficit = inputData.previous_rainfall - inputData.current_rainfall;
    const reservoirLevel = inputData.reservoir_level;
    const temperatureAnomaly = inputData.temperature_anomaly;
    const vegetationIndex = inputData.vegetation_index;
    const soilMoisture = inputData.soil_moisture;
    
    // Calculate risk score (0-100) based on multiple factors
    let riskScore = 0;
    
    // Rainfall deficit impact (higher deficit = higher risk)
    if (rainfallDeficit > 0) {
      riskScore += Math.min(30, rainfallDeficit / 5);
    }
    
    // Reservoir level impact (lower level = higher risk)
    riskScore += Math.max(0, 30 - (reservoirLevel / 3));
    
    // Temperature anomaly impact (higher anomaly = higher risk)
    if (temperatureAnomaly > 0) {
      riskScore += temperatureAnomaly * 5;
    }
    
    // Vegetation health impact (lower health = higher risk)
    riskScore += Math.max(0, 20 - (vegetationIndex / 5));
    
    // Soil moisture impact (lower moisture = higher risk)
    riskScore += Math.max(0, 20 - soilMoisture);
    
    // Add some randomness to simulate model uncertainty
    riskScore += (Math.random() * 10) - 5;
    
    // Clamp risk score to 0-100 range
    riskScore = Math.max(0, Math.min(100, riskScore));
    
    // Determine severity based on risk score
    let severity;
    let impactLevel;
    let probabilityPercent;
    let durationMonths;
    
    if (riskScore >= 75) {
      severity = "extreme";
      impactLevel = "critical";
      probabilityPercent = 70 + Math.random() * 30; // 70-100%
      durationMonths = 6 + Math.floor(Math.random() * 7); // 6-12 months
    } else if (riskScore >= 60) {
      severity = "high";
      impactLevel = "severe";
      probabilityPercent = 50 + Math.random() * 30; // 50-80%
      durationMonths = 3 + Math.floor(Math.random() * 4); // 3-6 months
    } else if (riskScore >= 40) {
      severity = "medium";
      impactLevel = "moderate";
      probabilityPercent = 30 + Math.random() * 30; // 30-60%
      durationMonths = 2 + Math.floor(Math.random() * 3); // 2-4 months
    } else {
      severity = "low";
      impactLevel = "minimal";
      probabilityPercent = 5 + Math.random() * 30; // 5-35%
      durationMonths = 1 + Math.floor(Math.random() * 2); // 1-2 months
    }
    
    // Calculate other drought indicators
    const waterReservoirLevel = reservoirLevel;
    const evaporationRate = inputData.evaporation_rate;
    
    return {
      riskScore: parseFloat(riskScore.toFixed(1)),
      severity,
      probabilityPercent: parseFloat(probabilityPercent.toFixed(1)),
      durationMonths,
      impactLevel,
      waterReservoirLevel: parseFloat(waterReservoirLevel.toFixed(1)),
      rainfallDeficit: parseFloat(rainfallDeficit.toFixed(1)),
      evaporationRate: parseFloat(evaporationRate.toFixed(1)),
      vegetationHealthIndex: parseFloat(vegetationIndex.toFixed(1))
    };
    
  } catch (error) {
    console.error("Error calling drought model:", error);
    throw error;
  }
}

// Helper function to get districts for a state
async function getDistrictsForState(stateId: string) {
  // In production, this would come from a real database or API
  // For now, we'll use mock data
  return [
    { id: `${stateId}-01`, name: `${stateId} District 1` },
    { id: `${stateId}-02`, name: `${stateId} District 2` },
    { id: `${stateId}-03`, name: `${stateId} District 3` },
    { id: `${stateId}-04`, name: `${stateId} District 4` },
    { id: `${stateId}-05`, name: `${stateId} District 5` },
    { id: `${stateId}-06`, name: `${stateId} District 6` },
    { id: `${stateId}-07`, name: `${stateId} District 7` },
    { id: `${stateId}-08`, name: `${stateId} District 8` }
  ];
}

// Helper function to get climate data for a district
async function getClimateData(districtId: string) {
  // In production, this would come from climate APIs, satellite data, etc.
  // For now, we'll use realistic mock data
  const previousRainfall = 400 + Math.random() * 600; // 400-1000mm
  
  return {
    previousRainfall: previousRainfall,
    currentRainfall: previousRainfall * (0.4 + Math.random() * 0.6), // 40-100% of previous
    temperatureAnomaly: -2 + Math.random() * 6, // -2 to +4C from normal
    reservoirLevel: 20 + Math.random() * 80, // 20-100%
    soilMoisture: 10 + Math.random() * 40, // 10-50%
    evaporationRate: 2 + Math.random() * 4, // 2-6mm/day
    vegetationIndex: 20 + Math.random() * 80 // 20-100
  };
}
