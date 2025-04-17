import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

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

    // Initialize Hugging Face Inference
    const hf = new HfInference(HF_API_TOKEN);

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
      
      // Call Hugging Face Inference API for drought prediction
      const prediction = await callDroughtModel(hf, modelInput);
      
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
async function callDroughtModel(hf: HfInference, inputData: any): Promise<DroughtModelPrediction> {
  try {
    // Use Hugging Face for ML model inference
    // Note: Replace with actual Hugging Face model endpoint for drought prediction
    const modelEndpoint = "your-huggingface-drought-prediction-model-endpoint";
    
    const result = await hf.prediction(modelEndpoint, {
      inputs: {
        district_id: inputData.district_id,
        previous_rainfall: inputData.previous_rainfall,
        current_rainfall: inputData.current_rainfall,
        temperature_anomaly: inputData.temperature_anomaly,
        reservoir_level: inputData.reservoir_level,
        soil_moisture: inputData.soil_moisture,
        evaporation_rate: inputData.evaporation_rate,
        vegetation_index: inputData.vegetation_index
      }
    });

    // Process model result and return prediction
    return {
      riskScore: result.risk_score,
      severity: result.severity,
      probabilityPercent: result.probability_percent,
      durationMonths: result.duration_months,
      impactLevel: result.impact_level,
      waterReservoirLevel: result.water_reservoir_level,
      rainfallDeficit: result.rainfall_deficit,
      evaporationRate: result.evaporation_rate,
      vegetationHealthIndex: result.vegetation_health_index
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
