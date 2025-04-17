
// Prediction service for crop yield and drought crisis predictions
// Uses ML models via Edge Functions for production, with fallback to mock data

import { supabase } from '@/integrations/supabase/client';

export interface CropYieldPrediction {
  districtId: string;
  stateId: string;
  districtName: string;
  cropType: 'wheat' | 'rice' | 'corn' | 'cotton' | 'sugarcane';
  currentYield: number; // in tons per hectare
  predictedYield: number; // in tons per hectare
  yieldChangePercent: number; // predicted change in percentage
  confidence: number; // confidence level of prediction (0-100)
  factors: {
    rainfall: number; // mm
    temperature: number; // celsius
    soilMoisture: number; // percentage
    humidity: number; // percentage
  };
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string; // date string
}

export interface DroughtPrediction {
  districtId: string;
  stateId: string;
  districtName: string;
  riskScore: number; // 0-100
  severity: 'low' | 'medium' | 'high' | 'extreme';
  probabilityPercent: number; // 0-100
  durationMonths: number;
  impactLevel: 'minimal' | 'moderate' | 'severe' | 'critical';
  waterReservoirLevel: number; // percentage
  rainfallDeficit: number; // mm below average
  evaporationRate: number; // mm per day
  vegetationHealthIndex: number; // 0-100
  agricultureImpact: string;
  lastUpdated: string; // date string
}

// Configuration for production or development mode
const config = {
  // Set to true to use real ML models, false to use mock data
  useRealModels: true,
  // Fallback to mock data if API calls fail
  fallbackToMock: true,
  // Cache predictions to reduce API calls (in milliseconds)
  cacheDuration: 1000 * 60 * 15, // 15 minutes 
  // Log API calls for debugging
  logApiCalls: true
};

// Cache for prediction results
interface CacheEntry<T> {
  data: T[];
  timestamp: number;
}

const cache = {
  cropYields: new Map<string, CacheEntry<CropYieldPrediction>>(),
  droughts: new Map<string, CacheEntry<DroughtPrediction>>()
};

// Main function to get crop yield predictions
export const getCropYieldPredictions = async (stateId: string): Promise<CropYieldPrediction[]> => {
  try {
    // Check if we have a recent cache
    const cachedData = cache.cropYields.get(stateId);
    if (cachedData && Date.now() - cachedData.timestamp < config.cacheDuration) {
      if (config.logApiCalls) console.log('Returning cached crop yield predictions for', stateId);
      return cachedData.data;
    }
    
    if (config.useRealModels) {
      // Call Supabase Edge Function for ML model predictions
      if (config.logApiCalls) console.log('Fetching crop yield predictions from ML model for', stateId);
      
      const { data, error } = await supabase.functions.invoke('crop-yield-prediction', {
        body: { stateId }
      });
      
      if (error) {
        console.error('Error calling crop-yield-prediction function:', error);
        if (config.fallbackToMock) {
          console.warn('Falling back to mock crop yield data');
          return getMockCropYieldPredictions(stateId);
        }
        throw error;
      }
      
      if (data && Array.isArray(data)) {
        // Cache the results
        cache.cropYields.set(stateId, {
          data: data,
          timestamp: Date.now()
        });
        return data;
      } else {
        console.error('Invalid response format from crop-yield-prediction function');
        if (config.fallbackToMock) {
          console.warn('Falling back to mock crop yield data');
          return getMockCropYieldPredictions(stateId);
        }
        throw new Error('Invalid response format from crop-yield-prediction function');
      }
    } else {
      // Use mock data in development mode
      return getMockCropYieldPredictions(stateId);
    }
  } catch (err) {
    console.error('Error getting crop yield predictions:', err);
    if (config.fallbackToMock) {
      console.warn('Falling back to mock crop yield data');
      return getMockCropYieldPredictions(stateId);
    }
    throw err;
  }
};

// Main function to get drought predictions
export const getDroughtPredictions = async (stateId: string): Promise<DroughtPrediction[]> => {
  try {
    // Check if we have a recent cache
    const cachedData = cache.droughts.get(stateId);
    if (cachedData && Date.now() - cachedData.timestamp < config.cacheDuration) {
      if (config.logApiCalls) console.log('Returning cached drought predictions for', stateId);
      return cachedData.data;
    }
    
    if (config.useRealModels) {
      // Call Supabase Edge Function for ML model predictions
      if (config.logApiCalls) console.log('Fetching drought predictions from ML model for', stateId);
      
      const { data, error } = await supabase.functions.invoke('drought-prediction', {
        body: { stateId }
      });
      
      if (error) {
        console.error('Error calling drought-prediction function:', error);
        if (config.fallbackToMock) {
          console.warn('Falling back to mock drought data');
          return getMockDroughtPredictions(stateId);
        }
        throw error;
      }
      
      if (data && Array.isArray(data)) {
        // Cache the results
        cache.droughts.set(stateId, {
          data: data,
          timestamp: Date.now()
        });
        return data;
      } else {
        console.error('Invalid response format from drought-prediction function');
        if (config.fallbackToMock) {
          console.warn('Falling back to mock drought data');
          return getMockDroughtPredictions(stateId);
        }
        throw new Error('Invalid response format from drought-prediction function');
      }
    } else {
      // Use mock data in development mode
      return getMockDroughtPredictions(stateId);
    }
  } catch (err) {
    console.error('Error getting drought predictions:', err);
    if (config.fallbackToMock) {
      console.warn('Falling back to mock drought data');
      return getMockDroughtPredictions(stateId);
    }
    throw err;
  }
};

// Mock data generator for crop yield predictions (moved to separate function)
const getMockCropYieldPredictions = (stateId: string): CropYieldPrediction[] => {
  // This would be replaced with actual API calls to ML models
  const predictions: CropYieldPrediction[] = [];
  
  // Get 5-10 random districts from the state for sample predictions
  const districts = getMockDistricts(stateId);
  const cropTypes: ('wheat' | 'rice' | 'corn' | 'cotton' | 'sugarcane')[] = ['wheat', 'rice', 'corn', 'cotton', 'sugarcane'];
  
  districts.forEach(district => {
    // Choose 1-3 random crop types per district
    const numCrops = 1 + Math.floor(Math.random() * 3);
    const selectedCrops = shuffle(cropTypes).slice(0, numCrops);
    
    selectedCrops.forEach(cropType => {
      const currentYield = 2 + Math.random() * 5; // Between 2-7 tons per hectare
      const rainfall = 50 + Math.random() * 950; // 50-1000mm
      const temperature = 20 + Math.random() * 15; // 20-35 celsius
      const soilMoisture = 10 + Math.random() * 40; // 10-50%
      const humidity = 30 + Math.random() * 50; // 30-80%
      
      // Determine if this is a risk area (20% chance)
      const isRiskArea = Math.random() < 0.2;
      
      // Calculate predicted yield based on rainfall and temperature
      let predictedChange = 0;
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      
      if (isRiskArea) {
        // Higher chance of yield decrease in risk areas
        predictedChange = -5 - Math.random() * 25; // -5% to -30%
        riskLevel = rainfall < 300 ? 'high' : 'medium';
      } else {
        // Normal areas have more balanced predictions
        predictedChange = -10 + Math.random() * 20; // -10% to +10% 
        riskLevel = predictedChange < -5 ? 'medium' : 'low';
      }
      
      const predictedYield = currentYield * (1 + predictedChange / 100);
      const confidence = 70 + Math.random() * 25; // 70-95%
      
      predictions.push({
        districtId: district.id,
        stateId,
        districtName: district.name,
        cropType,
        currentYield: parseFloat(currentYield.toFixed(2)),
        predictedYield: parseFloat(predictedYield.toFixed(2)),
        yieldChangePercent: parseFloat(predictedChange.toFixed(1)),
        confidence: parseFloat(confidence.toFixed(1)),
        factors: {
          rainfall: parseFloat(rainfall.toFixed(1)),
          temperature: parseFloat(temperature.toFixed(1)),
          soilMoisture: parseFloat(soilMoisture.toFixed(1)),
          humidity: parseFloat(humidity.toFixed(1))
        },
        riskLevel,
        lastUpdated: new Date().toISOString()
      });
    });
  });
  
  return predictions;
};

// Mock data generator for drought predictions  (moved to separate function)
const getMockDroughtPredictions = (stateId: string): DroughtPrediction[] => {
  // This would be replaced with actual API calls to ML models
  const predictions: DroughtPrediction[] = [];
  
  // Get all districts from the state
  const districts = getMockDistricts(stateId);
  
  districts.forEach(district => {
    // Determine drought risk based on district's risk score
    const baseRiskScore = district.riskScore * 0.7 + Math.random() * 30;
    const riskScore = Math.min(100, baseRiskScore);
    
    let severity: 'low' | 'medium' | 'high' | 'extreme';
    let impactLevel: 'minimal' | 'moderate' | 'severe' | 'critical';
    let probabilityPercent: number;
    let durationMonths: number;
    
    if (riskScore >= 75) {
      severity = 'extreme';
      impactLevel = 'critical';
      probabilityPercent = 70 + Math.random() * 30; // 70-100%
      durationMonths = 6 + Math.floor(Math.random() * 7); // 6-12 months
    } else if (riskScore >= 60) {
      severity = 'high';
      impactLevel = 'severe';
      probabilityPercent = 50 + Math.random() * 30; // 50-80%
      durationMonths = 3 + Math.floor(Math.random() * 4); // 3-6 months
    } else if (riskScore >= 40) {
      severity = 'medium';
      impactLevel = 'moderate';
      probabilityPercent = 30 + Math.random() * 30; // 30-60%
      durationMonths = 2 + Math.floor(Math.random() * 3); // 2-4 months
    } else {
      severity = 'low';
      impactLevel = 'minimal';
      probabilityPercent = 5 + Math.random() * 30; // 5-35%
      durationMonths = 1 + Math.floor(Math.random() * 2); // 1-2 months
    }
    
    const waterReservoirLevel = Math.max(5, 100 - (riskScore * 0.8) - (Math.random() * 20));
    const rainfallDeficit = riskScore * 1.5 + (Math.random() * 50);
    const evaporationRate = 2 + (riskScore / 20) + (Math.random() * 2);
    const vegetationHealthIndex = Math.max(5, 100 - riskScore - (Math.random() * 15));
    
    // Create impact message based on severity
    let agricultureImpact = "";
    if (severity === 'extreme') {
      agricultureImpact = "Total crop failure likely. Severe water shortages. Livestock at high risk.";
    } else if (severity === 'high') {
      agricultureImpact = "Significant crop yield reduction. Water rationing needed. Livestock health concerns.";
    } else if (severity === 'medium') {
      agricultureImpact = "Moderate reduction in crop yields. Water conservation measures recommended.";
    } else {
      agricultureImpact = "Minor impact on crop production. Monitor water resources carefully.";
    }
    
    predictions.push({
      districtId: district.id,
      stateId,
      districtName: district.name,
      riskScore: parseFloat(riskScore.toFixed(1)),
      severity,
      probabilityPercent: parseFloat(probabilityPercent.toFixed(1)),
      durationMonths,
      impactLevel,
      waterReservoirLevel: parseFloat(waterReservoirLevel.toFixed(1)),
      rainfallDeficit: parseFloat(rainfallDeficit.toFixed(1)),
      evaporationRate: parseFloat(evaporationRate.toFixed(1)),
      vegetationHealthIndex: parseFloat(vegetationHealthIndex.toFixed(1)),
      agricultureImpact,
      lastUpdated: new Date().toISOString()
    });
  });
  
  return predictions;
};

// Helper function to get mock districts for a state
const getMockDistricts = (stateId: string) => {
  // This is a simplified version - in reality, we'd use the actual district data service
  const districts = [
    { id: `${stateId}-01`, name: `${stateId} District 1`, riskScore: 25 },
    { id: `${stateId}-02`, name: `${stateId} District 2`, riskScore: 40 },
    { id: `${stateId}-03`, name: `${stateId} District 3`, riskScore: 60 },
    { id: `${stateId}-04`, name: `${stateId} District 4`, riskScore: 35 },
    { id: `${stateId}-05`, name: `${stateId} District 5`, riskScore: 70 },
    { id: `${stateId}-06`, name: `${stateId} District 6`, riskScore: 45 },
    { id: `${stateId}-07`, name: `${stateId} District 7`, riskScore: 55 },
    { id: `${stateId}-08`, name: `${stateId} District 8`, riskScore: 30 }
  ];
  
  return districts;
};

// Helper function to shuffle an array
const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
