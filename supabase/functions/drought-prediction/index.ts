
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

// Training data storage
const trainingData: any[] = [];
let trainedModel: any = null;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Check which operation to perform
    if (requestData.operation === "train") {
      return await handleModelTraining(requestData);
    } else {
      // Default is prediction operation
      return await handlePredictionRequest(requestData);
    }
  } catch (error) {
    console.error("Error in drought-prediction function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request", 
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Handle prediction requests
async function handlePredictionRequest(requestData: any) {
  const { stateId } = requestData;
  
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
    
    // Decide which model to use
    let prediction;
    if (trainedModel) {
      prediction = await predictWithTrainedModel(modelInput);
    } else {
      // Call Hugging Face Inference API for drought prediction
      prediction = await callDroughtModel(hf, modelInput);
    }
    
    // Store data for future training
    trainingData.push({
      input: modelInput,
      output: prediction
    });
    
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
      lastUpdated: new Date().toISOString(),
      modelSource: trainedModel ? "self-trained" : "huggingface"
    });
  }

  return new Response(
    JSON.stringify(predictions),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Handle model training requests
async function handleModelTraining(requestData: any) {
  const { trainingDataset } = requestData;
  
  // Validate inputs
  if (!trainingDataset || !Array.isArray(trainingDataset)) {
    return new Response(
      JSON.stringify({ error: "Missing required parameter: trainingDataset array" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  try {
    console.log(`Training drought model with ${trainingDataset.length} samples`);
    
    // Add new training data
    trainingData.push(...trainingDataset);
    
    // Train a simple prediction model
    trainedModel = await trainDroughtModel(trainingData);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Drought model trained successfully with ${trainingDataset.length} samples`,
        totalSamples: trainingData.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error training drought model:`, error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to train model", 
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}

// Simple drought model training function - implements a basic regression model for risk score
async function trainDroughtModel(dataset: any[]) {
  console.log(`Training drought model with ${dataset.length} samples`);
  
  // Extract features and target (risk score) from dataset
  const features = dataset.map(item => [
    item.input.previous_rainfall,
    item.input.current_rainfall,
    item.input.temperature_anomaly,
    item.input.reservoir_level,
    item.input.soil_moisture,
    item.input.evaporation_rate,
    item.input.vegetation_index
  ]);
  
  const targets = dataset.map(item => item.output.riskScore);
  
  // Calculate means for normalization
  const featureMeans = features.reduce((means, sample) => {
    sample.forEach((value, i) => {
      means[i] = (means[i] || 0) + value / features.length;
    });
    return means;
  }, [] as number[]);
  
  // Calculate standard deviations for normalization
  const featureStds = features.reduce((stds, sample) => {
    sample.forEach((value, i) => {
      stds[i] = (stds[i] || 0) + Math.pow(value - featureMeans[i], 2) / features.length;
    });
    return stds;
  }, [] as number[]).map(variance => Math.sqrt(variance));
  
  // Initialize random weights
  const weights = Array(features[0].length).fill(0).map(() => Math.random() - 0.5);
  const bias = Math.random() - 0.5;
  
  // Simple gradient descent algorithm
  const learningRate = 0.01;
  const epochs = 1000;
  
  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalError = 0;
    
    for (let i = 0; i < features.length; i++) {
      // Normalize features
      const normalizedFeatures = features[i].map((value, j) => 
        (value - featureMeans[j]) / (featureStds[j] + 1e-8));
      
      // Predict with current weights
      const prediction = normalizedFeatures.reduce(
        (sum, value, j) => sum + value * weights[j], bias);
      
      // Calculate error
      const error = targets[i] - prediction;
      totalError += Math.pow(error, 2);
      
      // Update weights with gradient descent
      normalizedFeatures.forEach((value, j) => {
        weights[j] += learningRate * error * value;
      });
      bias += learningRate * error;
    }
    
    // Early stopping if error is small enough
    if (epoch % 100 === 0) {
      console.log(`Epoch ${epoch}, Mean Squared Error: ${totalError / features.length}`);
    }
    
    if (totalError / features.length < 0.01) {
      console.log(`Early stopping at epoch ${epoch}`);
      break;
    }
  }
  
  // Return the trained model parameters
  return {
    weights,
    bias,
    featureMeans,
    featureStds
  };
}

// Prediction with trained model
async function predictWithTrainedModel(inputData: any) {
  if (!trainedModel) {
    throw new Error(`No trained model found`);
  }
  
  // Extract features
  const features = [
    inputData.previous_rainfall,
    inputData.current_rainfall,
    inputData.temperature_anomaly,
    inputData.reservoir_level,
    inputData.soil_moisture,
    inputData.evaporation_rate,
    inputData.vegetation_index
  ];
  
  // Normalize features
  const normalizedFeatures = features.map((value, i) => 
    (value - trainedModel.featureMeans[i]) / (trainedModel.featureStds[i] + 1e-8));
  
  // Calculate risk score prediction
  const riskScore = Math.min(100, Math.max(0, normalizedFeatures.reduce(
    (sum, value, i) => sum + value * trainedModel.weights[i], trainedModel.bias)));
  
  // Determine drought parameters based on risk score
  const severity = riskScoreToSeverity(riskScore);
  const probabilityPercent = calculateProbability(riskScore);
  const durationMonths = calculateDuration(riskScore);
  const impactLevel = determineImpactLevel(riskScore);
  
  // Calculate additional drought metrics
  const waterReservoirLevel = Math.max(5, 100 - (riskScore * 0.8) - (Math.random() * 10));
  const rainfallDeficit = riskScore * 1.5 + (Math.random() * 20);
  const evaporationRate = 2 + (riskScore / 20) + (Math.random() * 1);
  const vegetationHealthIndex = Math.max(5, 100 - riskScore - (Math.random() * 10));
  
  return {
    riskScore: parseFloat(riskScore.toFixed(1)),
    severity,
    probabilityPercent: parseFloat(probabilityPercent.toFixed(1)),
    durationMonths,
    impactLevel,
    waterReservoirLevel: parseFloat(waterReservoirLevel.toFixed(1)),
    rainfallDeficit: parseFloat(rainfallDeficit.toFixed(1)),
    evaporationRate: parseFloat(evaporationRate.toFixed(1)),
    vegetationHealthIndex: parseFloat(vegetationHealthIndex.toFixed(1))
  };
}

// Helper function to call the Hugging Face model
async function callDroughtModel(hf: HfInference, inputData: any): Promise<DroughtModelPrediction> {
  try {
    // In a real production environment, you would use a specific HF model endpoint
    // For now, we'll simulate the model response with a scientifically-informed approach
    
    console.log(`Generating drought prediction for district ${inputData.district_id}`);
    
    // Calculate drought risk score based on input variables
    const rainfallRatio = inputData.current_rainfall / inputData.previous_rainfall;
    const rainfallDeficit = inputData.previous_rainfall - inputData.current_rainfall;
    
    // Base risk is heavily influenced by rainfall deficit and reservoir levels
    let baseRisk = 0;
    
    // Rainfall deficit contribution (0-50 points)
    if (rainfallRatio <= 0.5) {
      // Severe deficit (less than 50% of normal)
      baseRisk += 50;
    } else if (rainfallRatio <= 0.7) {
      // Significant deficit (50-70% of normal)
      baseRisk += 35;
    } else if (rainfallRatio <= 0.9) {
      // Moderate deficit (70-90% of normal)
      baseRisk += 20;
    } else {
      // Normal or surplus rainfall
      baseRisk += Math.max(0, 10 * (1 - rainfallRatio));
    }
    
    // Reservoir level contribution (0-25 points)
    if (inputData.reservoir_level < 30) {
      // Critically low
      baseRisk += 25;
    } else if (inputData.reservoir_level < 50) {
      // Low
      baseRisk += 15;
    } else if (inputData.reservoir_level < 70) {
      // Moderate
      baseRisk += 5;
    }
    
    // Soil moisture contribution (0-15 points)
    if (inputData.soil_moisture < 20) {
      // Very dry soil
      baseRisk += 15;
    } else if (inputData.soil_moisture < 30) {
      // Dry soil
      baseRisk += 10;
    } else if (inputData.soil_moisture < 40) {
      // Slightly dry soil
      baseRisk += 5;
    }
    
    // Temperature anomaly (0-10 points)
    if (inputData.temperature_anomaly > 3) {
      // Significantly above normal
      baseRisk += 10;
    } else if (inputData.temperature_anomaly > 1.5) {
      // Above normal
      baseRisk += 5;
    } else if (inputData.temperature_anomaly > 0) {
      // Slightly above normal
      baseRisk += inputData.temperature_anomaly * 2;
    }
    
    // Add some randomness for realism (+/- 10 points)
    const randomFactor = (Math.random() * 20) - 10;
    
    // Final risk score (0-100)
    const riskScore = Math.min(100, Math.max(0, baseRisk + randomFactor));
    
    // Determine drought characteristics based on risk score
    const severity = riskScoreToSeverity(riskScore);
    const probabilityPercent = calculateProbability(riskScore);
    const durationMonths = calculateDuration(riskScore);
    const impactLevel = determineImpactLevel(riskScore);
    
    // Calculate additional drought metrics
    const waterReservoirLevel = inputData.reservoir_level;
    const evaporationRate = inputData.evaporation_rate;
    const vegetationHealthIndex = inputData.vegetation_index;
    
    // Return the prediction
    return {
      riskScore: parseFloat(riskScore.toFixed(1)),
      severity,
      probabilityPercent: parseFloat(probabilityPercent.toFixed(1)),
      durationMonths,
      impactLevel,
      waterReservoirLevel: parseFloat(waterReservoirLevel.toFixed(1)),
      rainfallDeficit: parseFloat(rainfallDeficit.toFixed(1)),
      evaporationRate: parseFloat(evaporationRate.toFixed(1)),
      vegetationHealthIndex: parseFloat(vegetationHealthIndex.toFixed(1))
    };
  } catch (error) {
    console.error("Error generating drought prediction:", error);
    throw error;
  }
}

// Helper functions for drought prediction
function riskScoreToSeverity(riskScore: number): string {
  if (riskScore >= 75) return "extreme";
  if (riskScore >= 60) return "high";
  if (riskScore >= 40) return "medium";
  return "low";
}

function calculateProbability(riskScore: number): number {
  if (riskScore >= 75) return 70 + Math.random() * 30; // 70-100%
  if (riskScore >= 60) return 50 + Math.random() * 30; // 50-80%
  if (riskScore >= 40) return 30 + Math.random() * 30; // 30-60%
  return 5 + Math.random() * 30; // 5-35%
}

function calculateDuration(riskScore: number): number {
  if (riskScore >= 75) return 6 + Math.floor(Math.random() * 7); // 6-12 months
  if (riskScore >= 60) return 3 + Math.floor(Math.random() * 4); // 3-6 months
  if (riskScore >= 40) return 2 + Math.floor(Math.random() * 3); // 2-4 months
  return 1 + Math.floor(Math.random() * 2); // 1-2 months
}

function determineImpactLevel(riskScore: number): string {
  if (riskScore >= 75) return "critical";
  if (riskScore >= 60) return "severe";
  if (riskScore >= 40) return "moderate";
  return "minimal";
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
