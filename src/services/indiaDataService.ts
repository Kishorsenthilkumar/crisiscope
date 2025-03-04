
// Service for India state and district economic data

export interface IndiaStateData {
  id: string;
  name: string;
  gdp: number;
  gdpGrowth: number;
  unemploymentRate: number;
  povertyRate: number;
  populationMillions: number;
  literacyRate: number;
  riskScore: number;
  mainIndustries: string[];
}

export interface IndiaDistrictData {
  id: string;
  stateId: string;
  name: string;
  gdp: number;
  gdpGrowth: number;
  unemploymentRate: number;
  populationMillions: number;
  riskScore: number;
}

// Mock data for Indian states
export const getIndiaStatesData = (): IndiaStateData[] => [
  {
    id: "MH",
    name: "Maharashtra",
    gdp: 422.4,
    gdpGrowth: 7.5,
    unemploymentRate: 4.2,
    povertyRate: 17.3,
    populationMillions: 123.1,
    literacyRate: 82.3,
    riskScore: 48,
    mainIndustries: ["Manufacturing", "IT", "Finance", "Agriculture"]
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    gdp: 254.3,
    gdpGrowth: 8.0,
    unemploymentRate: 2.9,
    povertyRate: 11.3,
    populationMillions: 76.8,
    literacyRate: 80.3,
    riskScore: 35,
    mainIndustries: ["Automobile", "Textiles", "Heavy Industries", "IT"]
  },
  {
    id: "GJ",
    name: "Gujarat",
    gdp: 222.8,
    gdpGrowth: 9.2,
    unemploymentRate: 3.4,
    povertyRate: 16.6,
    populationMillions: 63.9,
    literacyRate: 78.0,
    riskScore: 41,
    mainIndustries: ["Petrochemicals", "Textiles", "Pharmaceuticals", "Diamonds"]
  },
  {
    id: "KA",
    name: "Karnataka",
    gdp: 219.3,
    gdpGrowth: 8.8,
    unemploymentRate: 2.8,
    povertyRate: 20.9,
    populationMillions: 67.6,
    literacyRate: 77.2,
    riskScore: 38,
    mainIndustries: ["IT", "Biotechnology", "Aerospace", "Manufacturing"]
  },
  {
    id: "UP",
    name: "Uttar Pradesh",
    gdp: 215.9,
    gdpGrowth: 6.5,
    unemploymentRate: 6.4,
    povertyRate: 29.4,
    populationMillions: 224.9,
    literacyRate: 67.7,
    riskScore: 65,
    mainIndustries: ["Agriculture", "Food Processing", "Tourism", "Textiles"]
  },
  {
    id: "WB",
    name: "West Bengal",
    gdp: 158.8,
    gdpGrowth: 6.0,
    unemploymentRate: 5.8,
    povertyRate: 20.0,
    populationMillions: 99.7,
    literacyRate: 76.3,
    riskScore: 52,
    mainIndustries: ["Tea", "Jute", "Engineering", "Mining"]
  },
  {
    id: "RJ",
    name: "Rajasthan",
    gdp: 124.6,
    gdpGrowth: 5.9,
    unemploymentRate: 5.2,
    povertyRate: 14.7,
    populationMillions: 79.2,
    literacyRate: 66.1,
    riskScore: 54,
    mainIndustries: ["Minerals", "Tourism", "Textiles", "Cement"]
  },
  {
    id: "AP",
    name: "Andhra Pradesh",
    gdp: 140.9,
    gdpGrowth: 11.2,
    unemploymentRate: 4.7,
    povertyRate: 9.2,
    populationMillions: 53.9,
    literacyRate: 67.4,
    riskScore: 39,
    mainIndustries: ["Agriculture", "IT", "Pharmaceuticals", "Mining"]
  },
  {
    id: "TS",
    name: "Telangana",
    gdp: 143.7,
    gdpGrowth: 14.9,
    unemploymentRate: 3.9,
    povertyRate: 9.0,
    populationMillions: 37.9,
    literacyRate: 72.8,
    riskScore: 32,
    mainIndustries: ["IT", "Pharmaceuticals", "Manufacturing", "Agriculture"]
  },
  {
    id: "KL",
    name: "Kerala",
    gdp: 128.7,
    gdpGrowth: 7.5,
    unemploymentRate: 9.0,
    povertyRate: 7.0,
    populationMillions: 35.7,
    literacyRate: 94.0,
    riskScore: 30,
    mainIndustries: ["Tourism", "Seafood", "Spices", "IT"]
  }
];

// Mock data for districts
export const getDistrictsByState = (stateId: string): IndiaDistrictData[] => {
  switch (stateId) {
    case "MH":
      return [
        { id: "MH-1", stateId: "MH", name: "Mumbai", gdp: 98.4, gdpGrowth: 6.9, unemploymentRate: 3.8, populationMillions: 12.4, riskScore: 45 },
        { id: "MH-2", stateId: "MH", name: "Pune", gdp: 68.2, gdpGrowth: 8.3, unemploymentRate: 2.9, populationMillions: 7.3, riskScore: 37 },
        { id: "MH-3", stateId: "MH", name: "Nagpur", gdp: 34.8, gdpGrowth: 7.2, unemploymentRate: 4.6, populationMillions: 4.4, riskScore: 52 }
      ];
    case "TN":
      return [
        { id: "TN-1", stateId: "TN", name: "Chennai", gdp: 78.6, gdpGrowth: 7.8, unemploymentRate: 2.5, populationMillions: 8.9, riskScore: 33 },
        { id: "TN-2", stateId: "TN", name: "Coimbatore", gdp: 42.3, gdpGrowth: 8.7, unemploymentRate: 2.2, populationMillions: 3.5, riskScore: 29 },
        { id: "TN-3", stateId: "TN", name: "Madurai", gdp: 27.9, gdpGrowth: 7.4, unemploymentRate: 3.1, populationMillions: 3.0, riskScore: 40 }
      ];
    case "KA":
      return [
        { id: "KA-1", stateId: "KA", name: "Bengaluru", gdp: 105.3, gdpGrowth: 10.3, unemploymentRate: 2.1, populationMillions: 12.3, riskScore: 32 },
        { id: "KA-2", stateId: "KA", name: "Mysuru", gdp: 18.9, gdpGrowth: 7.6, unemploymentRate: 3.3, populationMillions: 1.2, riskScore: 36 },
        { id: "KA-3", stateId: "KA", name: "Mangaluru", gdp: 14.5, gdpGrowth: 6.9, unemploymentRate: 3.0, populationMillions: 0.6, riskScore: 40 }
      ];
    default:
      return [];
  }
};

// Calculate economic indicators for visualization
export const getEconomicCrisisIndicators = (stateId: string) => {
  const states = getIndiaStatesData();
  const state = states.find(s => s.id === stateId);
  
  if (!state) return null;
  
  return {
    // Higher unemployment is worse
    unemploymentIndicator: Math.min(100, (state.unemploymentRate / 15) * 100),
    // Higher poverty is worse
    povertyIndicator: Math.min(100, (state.povertyRate / 30) * 100),
    // Lower GDP growth is worse
    gdpGrowthIndicator: Math.max(0, 100 - ((15 - state.gdpGrowth) / 15) * 100),
    // Risk score as reported
    riskScore: state.riskScore,
    // Combined indicator (weighted average)
    overallIndicator: (
      (state.unemploymentRate / 15) * 35 +
      (state.povertyRate / 30) * 25 +
      ((15 - state.gdpGrowth) / 15) * 20 +
      (state.riskScore / 100) * 20
    ).toFixed(1)
  };
};

// API to get GSDP historical data for visualization
export const getStateGDPHistory = (stateId: string) => {
  // Mock quarterly GDP data for the past 5 years
  const baseGDP = {
    "MH": 400, "TN": 240, "GJ": 210, "KA": 200, 
    "UP": 200, "WB": 150, "RJ": 120, "AP": 135,
    "TS": 140, "KL": 125
  }[stateId] || 100;
  
  const growth = {
    "MH": 2.0, "TN": 2.2, "GJ": 2.3, "KA": 2.4, 
    "UP": 1.7, "WB": 1.6, "RJ": 1.5, "AP": 2.1,
    "TS": 2.6, "KL": 1.9
  }[stateId] || 2.0;
  
  const volatility = {
    "MH": 0.3, "TN": 0.25, "GJ": 0.28, "KA": 0.31, 
    "UP": 0.4, "WB": 0.32, "RJ": 0.36, "AP": 0.29,
    "TS": 0.3, "KL": 0.27
  }[stateId] || 0.3;
  
  // Generate quarterly data for 5 years (20 quarters)
  const data = [];
  for (let i = 0; i < 20; i++) {
    const year = 2020 + Math.floor(i / 4);
    const quarter = (i % 4) + 1;
    const randomFactor = (Math.random() - 0.5) * volatility;
    const trendFactor = (i / 20) * growth;
    const gdpValue = baseGDP * (1 + trendFactor + randomFactor);
    
    data.push({
      period: `Q${quarter} ${year}`,
      gdp: parseFloat(gdpValue.toFixed(1))
    });
  }
  
  return data;
};
