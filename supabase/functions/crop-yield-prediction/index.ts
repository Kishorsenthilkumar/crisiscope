
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for the edge function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for the model response from HuggingFace
interface ModelPrediction {
  cropType: string;
  currentYield: number;
  predictedYield: number;
  yieldChangePercent: number;
  confidence: number;
  riskLevel: string;
  factors: {
    rainfall: number;
    temperature: number;
    soilMoisture: number;
    humidity: number;
  };
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

    console.log(`Fetching crop yield predictions for state: ${stateId}`);
    
    // Get districts for the selected state
    const districts = await getDistrictsForState(stateId);
    
    // For each district, get predictions from the model
    const predictions = [];
    
    for (const district of districts) {
      // Get weather and soil data for this district
      // This would typically come from another data source or API
      const environmentalData = await getEnvironmentalData(district.id);
      
      // Get list of crops for this district
      const crops = await getCropsForDistrict(district.id);
      
      // For each crop type, get prediction from model
      for (const crop of crops) {
        // Prepare input for the model
        const modelInput = {
          district_id: district.id,
          crop_type: crop,
          historical_yield: environmentalData.historicalYield[crop] || 5.0,
          rainfall: environmentalData.rainfall,
          temperature: environmentalData.temperature,
          soil_moisture: environmentalData.soilMoisture,
          humidity: environmentalData.humidity
        };
        
        // Call Hugging Face Inference API
        const prediction = await callHuggingFaceModel(HF_API_TOKEN, modelInput);
        
        // Format the prediction in our app's format
        predictions.push({
          districtId: district.id,
          stateId,
          districtName: district.name,
          cropType: crop,
          currentYield: environmentalData.historicalYield[crop] || 5.0,
          predictedYield: prediction.predictedYield,
          yieldChangePercent: prediction.yieldChangePercent,
          confidence: prediction.confidence,
          factors: {
            rainfall: environmentalData.rainfall,
            temperature: environmentalData.temperature,
            soilMoisture: environmentalData.soilMoisture,
            humidity: environmentalData.humidity
          },
          riskLevel: prediction.riskLevel,
          lastUpdated: new Date().toISOString()
        });
      }
    }

    return new Response(
      JSON.stringify(predictions),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in crop-yield-prediction function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch crop yield predictions", 
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Helper function to call the Hugging Face model
async function callHuggingFaceModel(apiToken: string, inputData: any): Promise<ModelPrediction> {
  try {
    // This is where we'd normally call the actual HuggingFace model API
    // For now, we'll simulate a model response based on the input data
    
    // In production, replace this with a real API call like:
    /*
    const response = await fetch("https://api-inference.huggingface.co/models/YOUR_MODEL_ID", {
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
    
    // Simulate some basic crop yield prediction logic
    const baseYield = inputData.historical_yield;
    const rainfall = inputData.rainfall;
    const temperature = inputData.temperature;
    const soilMoisture = inputData.soil_moisture;
    
    // Simple model: yield changes based on environmental factors
    let yieldChange = 0;
    
    // Rainfall impact (optimum around 600mm)
    if (rainfall < 300) {
      yieldChange -= 15 + (300 - rainfall) / 30;
    } else if (rainfall > 900) {
      yieldChange -= (rainfall - 900) / 100;
    } else {
      yieldChange += 5;
    }
    
    // Temperature impact (optimum around 25C)
    const tempDiff = Math.abs(temperature - 25);
    if (tempDiff > 5) {
      yieldChange -= (tempDiff - 5) * 1.2;
    }
    
    // Soil moisture impact (optimum around 30-40%)
    if (soilMoisture < 20) {
      yieldChange -= (20 - soilMoisture) * 0.8;
    } else if (soilMoisture > 50) {
      yieldChange -= (soilMoisture - 50) * 0.5;
    }
    
    // Calculate new yield
    const predictedYield = baseYield * (1 + yieldChange / 100);
    
    // Determine risk level
    let riskLevel = "low";
    if (yieldChange < -15) {
      riskLevel = "high";
    } else if (yieldChange < -5) {
      riskLevel = "medium";
    }
    
    // Calculate confidence based on data availability
    const confidence = 85 - (Math.random() * 15);
    
    return {
      cropType: inputData.crop_type,
      currentYield: baseYield,
      predictedYield: parseFloat(predictedYield.toFixed(2)),
      yieldChangePercent: parseFloat(yieldChange.toFixed(1)),
      confidence: parseFloat(confidence.toFixed(1)),
      riskLevel: riskLevel as "low" | "medium" | "high",
      factors: {
        rainfall: inputData.rainfall,
        temperature: inputData.temperature,
        soilMoisture: inputData.soil_moisture,
        humidity: inputData.humidity
      }
    };
    
  } catch (error) {
    console.error("Error calling HuggingFace model:", error);
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
    { id: `${stateId}-05`, name: `${stateId} District 5` }
  ];
}

// Helper function to get environmental data for a district
async function getEnvironmentalData(districtId: string) {
  // In production, this would come from weather APIs and soil sensors
  // For now, we'll use realistic mock data
  return {
    rainfall: 300 + Math.random() * 700, // 300-1000mm
    temperature: 20 + Math.random() * 15, // 20-35C
    soilMoisture: 15 + Math.random() * 40, // 15-55%
    humidity: 30 + Math.random() * 60, // 30-90%
    historicalYield: {
      wheat: 3 + Math.random() * 4, // 3-7 tons/ha
      rice: 4 + Math.random() * 4, // 4-8 tons/ha
      corn: 5 + Math.random() * 6, // 5-11 tons/ha
      cotton: 2 + Math.random() * 2, // 2-4 tons/ha
      sugarcane: 60 + Math.random() * 40 // 60-100 tons/ha
    }
  };
}

// Helper function to get list of crops for a district
async function getCropsForDistrict(districtId: string) {
  // In production, this would come from a real database or API
  // For now, we'll return a subset of possible crops
  const allCrops = ["wheat", "rice", "corn", "cotton", "sugarcane"];
  const numCrops = 1 + Math.floor(Math.random() * 3); // 1-3 crops per district
  
  // Randomly select crops for this district
  const selectedIndices = new Set();
  while (selectedIndices.size < numCrops) {
    selectedIndices.add(Math.floor(Math.random() * allCrops.length));
  }
  
  return Array.from(selectedIndices).map(i => allCrops[i as number]);
}
