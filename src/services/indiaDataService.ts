
// Mock data service for India economic data
// This would be replaced with actual API calls in a production environment

export interface IndiaStateData {
  id: string;
  name: string;
  gdp: number; // in billions of dollars
  gdpGrowth: number; // percentage
  unemploymentRate: number; // percentage
  populationMillions: number;
  riskScore: number; // 0-100, higher is worse
  literacyRate: number; // percentage
  coordinates?: [number, number]; // longitude, latitude
}

export interface DistrictData {
  id: string;
  stateId: string;
  name: string;
  gdp: number; // in billions of dollars
  gdpGrowth: number; // percentage
  unemploymentRate: number; // percentage
  populationMillions: number;
  riskScore: number; // 0-100, higher is worse
}

// Interface for economic crisis indicators
export interface EconomicCrisisIndicators {
  unemploymentIndicator: number; // 0-100
  povertyIndicator: number; // 0-100
  gdpGrowthIndicator: number; // 0-100
  riskScore: number; // 0-100
  overallIndicator: number; // 0-100
}

// Interface for GDP history data point
export interface GDPHistoryDataPoint {
  period: string;
  gdp: number;
}

// Mock data for Indian states with real coordinates
const indiaStates: IndiaStateData[] = [
  {
    id: "MH",
    name: "Maharashtra",
    gdp: 422.4,
    gdpGrowth: 5.6,
    unemploymentRate: 7.2,
    populationMillions: 123.1,
    riskScore: 35,
    literacyRate: 84.8,
    coordinates: [75.7139, 19.7515]
  },
  {
    id: "TN",
    name: "Tamil Nadu",
    gdp: 254.3,
    gdpGrowth: 6.2,
    unemploymentRate: 5.8,
    populationMillions: 77.8,
    riskScore: 28,
    literacyRate: 80.3,
    coordinates: [78.6569, 11.1271]
  },
  {
    id: "GJ",
    name: "Gujarat",
    gdp: 222.8,
    gdpGrowth: 7.1,
    unemploymentRate: 4.8,
    populationMillions: 70.4,
    riskScore: 25,
    literacyRate: 79.3,
    coordinates: [71.5724, 22.2587]
  },
  {
    id: "KA",
    name: "Karnataka",
    gdp: 234.5,
    gdpGrowth: 8.2,
    unemploymentRate: 5.2,
    populationMillions: 67.6,
    riskScore: 30,
    literacyRate: 77.2,
    coordinates: [75.7139, 15.3173]
  },
  {
    id: "UP",
    name: "Uttar Pradesh",
    gdp: 240.2,
    gdpGrowth: 4.1,
    unemploymentRate: 10.1,
    populationMillions: 231.5,
    riskScore: 68,
    literacyRate: 69.7,
    coordinates: [80.9462, 26.8467]
  },
  {
    id: "WB",
    name: "West Bengal",
    gdp: 169.1,
    gdpGrowth: 3.9,
    unemploymentRate: 8.5,
    populationMillions: 99.6,
    riskScore: 52,
    literacyRate: 77.1,
    coordinates: [87.8550, 23.6102]
  },
  {
    id: "RJ",
    name: "Rajasthan",
    gdp: 140.3,
    gdpGrowth: 5.3,
    unemploymentRate: 7.9,
    populationMillions: 79.3,
    riskScore: 45,
    literacyRate: 67.1,
    coordinates: [74.2179, 27.0238]
  },
  {
    id: "AP",
    name: "Andhra Pradesh",
    gdp: 145.8,
    gdpGrowth: 4.8,
    unemploymentRate: 6.7,
    populationMillions: 53.9,
    riskScore: 42,
    literacyRate: 67.4,
    coordinates: [79.7400, 15.9129]
  },
  {
    id: "TS",
    name: "Telangana",
    gdp: 139.6,
    gdpGrowth: 6.8,
    unemploymentRate: 5.5,
    populationMillions: 39.6,
    riskScore: 32,
    literacyRate: 72.8,
    coordinates: [79.0193, 18.1124]
  },
  {
    id: "KL",
    name: "Kerala",
    gdp: 118.5,
    gdpGrowth: 5.2,
    unemploymentRate: 9.1,
    populationMillions: 35.7,
    riskScore: 38,
    literacyRate: 94.0,
    coordinates: [76.2711, 10.8505]
  }
];

// Function to get all India states data
export const getIndiaStatesData = (): IndiaStateData[] => {
  return indiaStates;
};

// Function to get a specific state by ID
export const getStateById = (stateId: string): IndiaStateData | undefined => {
  return indiaStates.find(state => state.id === stateId);
};

// Mock districts data
const districts: DistrictData[] = [
  // Maharashtra districts
  { id: "MH-01", stateId: "MH", name: "Mumbai", gdp: 168.9, gdpGrowth: 6.3, unemploymentRate: 6.1, populationMillions: 20.4, riskScore: 30 },
  { id: "MH-02", stateId: "MH", name: "Pune", gdp: 85.2, gdpGrowth: 7.5, unemploymentRate: 5.8, populationMillions: 10.2, riskScore: 25 },
  { id: "MH-03", stateId: "MH", name: "Nagpur", gdp: 42.8, gdpGrowth: 4.9, unemploymentRate: 8.2, populationMillions: 4.8, riskScore: 42 },

  // Tamil Nadu districts
  { id: "TN-01", stateId: "TN", name: "Chennai", gdp: 75.3, gdpGrowth: 5.8, unemploymentRate: 5.2, populationMillions: 10.9, riskScore: 28 },
  { id: "TN-02", stateId: "TN", name: "Coimbatore", gdp: 38.1, gdpGrowth: 6.7, unemploymentRate: 4.8, populationMillions: 3.6, riskScore: 22 },
  { id: "TN-03", stateId: "TN", name: "Madurai", gdp: 26.4, gdpGrowth: 5.2, unemploymentRate: 6.3, populationMillions: 3.2, riskScore: 35 },

  // Gujarat districts
  { id: "GJ-01", stateId: "GJ", name: "Ahmedabad", gdp: 65.7, gdpGrowth: 7.4, unemploymentRate: 4.1, populationMillions: 8.1, riskScore: 20 },
  { id: "GJ-02", stateId: "GJ", name: "Surat", gdp: 48.2, gdpGrowth: 8.2, unemploymentRate: 3.9, populationMillions: 6.8, riskScore: 18 },
  { id: "GJ-03", stateId: "GJ", name: "Vadodara", gdp: 29.5, gdpGrowth: 6.8, unemploymentRate: 5.1, populationMillions: 4.2, riskScore: 30 },

  // Add more districts for other states as needed...
];

// Function to get districts by state ID
export const getDistrictsByState = (stateId: string): DistrictData[] => {
  return districts.filter(district => district.stateId === stateId);
};

// Function to get a specific district by ID
export const getDistrictById = (districtId: string): DistrictData | undefined => {
  return districts.find(district => district.id === districtId);
};

// Function to get economic crisis indicators for a state
export const getEconomicCrisisIndicators = (stateId: string): EconomicCrisisIndicators | null => {
  const state = getStateById(stateId);
  if (!state) return null;
  
  // Generate mock indicators based on state data
  const unemploymentIndicator = Math.min(100, state.unemploymentRate * 10);
  const povertyIndicator = Math.min(100, state.riskScore * 1.2);
  const gdpGrowthIndicator = Math.max(0, 100 - (state.gdpGrowth * 8));
  
  return {
    unemploymentIndicator,
    povertyIndicator,
    gdpGrowthIndicator,
    riskScore: state.riskScore,
    overallIndicator: Math.round((unemploymentIndicator + povertyIndicator + gdpGrowthIndicator) / 3)
  };
};

// Function to get GDP history for a state (mock data)
export const getStateGDPHistory = (stateId: string): GDPHistoryDataPoint[] => {
  const state = getStateById(stateId);
  if (!state) return [];
  
  // Generate mock GDP history for the past 5 years (quarterly data)
  const gdpHistory: GDPHistoryDataPoint[] = [];
  const currentYear = new Date().getFullYear();
  let baseGDP = state.gdp * 0.8; // Start with 80% of current GDP 5 years ago
  
  for (let year = currentYear - 4; year <= currentYear; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      // Skip future quarters in current year
      if (year === currentYear && quarter > Math.floor((new Date().getMonth() + 3) / 3)) {
        continue;
      }
      
      // Add some random variation to growth
      const quarterlyGrowth = (state.gdpGrowth / 4) * (0.8 + Math.random() * 0.4);
      baseGDP *= (1 + quarterlyGrowth / 100);
      
      gdpHistory.push({
        period: `${year} Q${quarter}`,
        gdp: Math.round(baseGDP * 10) / 10
      });
    }
  }
  
  return gdpHistory;
};

// Add to indiaDataConfig in apiConfig.ts
export const isIndiaDataConfigured = () => true;
