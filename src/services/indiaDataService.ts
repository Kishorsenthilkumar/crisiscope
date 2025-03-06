
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

// Expanded mock districts data with more districts per state
const districts: DistrictData[] = [
  // Maharashtra districts
  { id: "MH-01", stateId: "MH", name: "Mumbai", gdp: 168.9, gdpGrowth: 6.3, unemploymentRate: 6.1, populationMillions: 20.4, riskScore: 30 },
  { id: "MH-02", stateId: "MH", name: "Pune", gdp: 85.2, gdpGrowth: 7.5, unemploymentRate: 5.8, populationMillions: 10.2, riskScore: 25 },
  { id: "MH-03", stateId: "MH", name: "Nagpur", gdp: 42.8, gdpGrowth: 4.9, unemploymentRate: 8.2, populationMillions: 4.8, riskScore: 42 },
  { id: "MH-04", stateId: "MH", name: "Thane", gdp: 35.6, gdpGrowth: 5.8, unemploymentRate: 6.5, populationMillions: 11.1, riskScore: 38 },
  { id: "MH-05", stateId: "MH", name: "Nashik", gdp: 22.4, gdpGrowth: 4.5, unemploymentRate: 7.8, populationMillions: 6.1, riskScore: 45 },
  { id: "MH-06", stateId: "MH", name: "Aurangabad", gdp: 18.7, gdpGrowth: 4.2, unemploymentRate: 9.1, populationMillions: 3.7, riskScore: 52 },
  { id: "MH-07", stateId: "MH", name: "Solapur", gdp: 14.3, gdpGrowth: 3.8, unemploymentRate: 9.5, populationMillions: 4.3, riskScore: 58 },
  { id: "MH-08", stateId: "MH", name: "Amravati", gdp: 12.1, gdpGrowth: 3.5, unemploymentRate: 10.2, populationMillions: 2.9, riskScore: 62 },

  // Tamil Nadu districts
  { id: "TN-01", stateId: "TN", name: "Chennai", gdp: 75.3, gdpGrowth: 5.8, unemploymentRate: 5.2, populationMillions: 10.9, riskScore: 28 },
  { id: "TN-02", stateId: "TN", name: "Coimbatore", gdp: 38.1, gdpGrowth: 6.7, unemploymentRate: 4.8, populationMillions: 3.6, riskScore: 22 },
  { id: "TN-03", stateId: "TN", name: "Madurai", gdp: 26.4, gdpGrowth: 5.2, unemploymentRate: 6.3, populationMillions: 3.2, riskScore: 35 },
  { id: "TN-04", stateId: "TN", name: "Tiruchirappalli", gdp: 22.8, gdpGrowth: 4.9, unemploymentRate: 6.7, populationMillions: 2.7, riskScore: 39 },
  { id: "TN-05", stateId: "TN", name: "Salem", gdp: 18.5, gdpGrowth: 4.6, unemploymentRate: 7.1, populationMillions: 3.5, riskScore: 43 },
  { id: "TN-06", stateId: "TN", name: "Tirunelveli", gdp: 15.2, gdpGrowth: 4.3, unemploymentRate: 7.5, populationMillions: 3.1, riskScore: 46 },
  { id: "TN-07", stateId: "TN", name: "Erode", gdp: 14.7, gdpGrowth: 5.1, unemploymentRate: 6.2, populationMillions: 2.3, riskScore: 32 },
  { id: "TN-08", stateId: "TN", name: "Vellore", gdp: 12.3, gdpGrowth: 4.2, unemploymentRate: 7.8, populationMillions: 3.9, riskScore: 48 },

  // Gujarat districts
  { id: "GJ-01", stateId: "GJ", name: "Ahmedabad", gdp: 65.7, gdpGrowth: 7.4, unemploymentRate: 4.1, populationMillions: 8.1, riskScore: 20 },
  { id: "GJ-02", stateId: "GJ", name: "Surat", gdp: 48.2, gdpGrowth: 8.2, unemploymentRate: 3.9, populationMillions: 6.8, riskScore: 18 },
  { id: "GJ-03", stateId: "GJ", name: "Vadodara", gdp: 29.5, gdpGrowth: 6.8, unemploymentRate: 5.1, populationMillions: 4.2, riskScore: 30 },
  { id: "GJ-04", stateId: "GJ", name: "Rajkot", gdp: 24.1, gdpGrowth: 6.5, unemploymentRate: 5.3, populationMillions: 3.8, riskScore: 32 },
  { id: "GJ-05", stateId: "GJ", name: "Bhavnagar", gdp: 16.8, gdpGrowth: 5.7, unemploymentRate: 6.1, populationMillions: 2.9, riskScore: 38 },
  { id: "GJ-06", stateId: "GJ", name: "Jamnagar", gdp: 15.3, gdpGrowth: 5.9, unemploymentRate: 5.9, populationMillions: 2.2, riskScore: 35 },
  { id: "GJ-07", stateId: "GJ", name: "Junagadh", gdp: 12.4, gdpGrowth: 5.2, unemploymentRate: 6.5, populationMillions: 2.8, riskScore: 40 },
  { id: "GJ-08", stateId: "GJ", name: "Gandhinagar", gdp: 14.9, gdpGrowth: 6.3, unemploymentRate: 4.8, populationMillions: 1.6, riskScore: 25 },

  // Karnataka districts
  { id: "KA-01", stateId: "KA", name: "Bengaluru", gdp: 110.5, gdpGrowth: 9.2, unemploymentRate: 4.8, populationMillions: 13.2, riskScore: 25 },
  { id: "KA-02", stateId: "KA", name: "Mysuru", gdp: 38.7, gdpGrowth: 7.1, unemploymentRate: 5.4, populationMillions: 4.0, riskScore: 30 },
  { id: "KA-03", stateId: "KA", name: "Hubballi-Dharwad", gdp: 24.3, gdpGrowth: 6.5, unemploymentRate: 6.2, populationMillions: 2.2, riskScore: 38 },
  { id: "KA-04", stateId: "KA", name: "Mangaluru", gdp: 21.9, gdpGrowth: 6.9, unemploymentRate: 5.8, populationMillions: 1.9, riskScore: 32 },
  { id: "KA-05", stateId: "KA", name: "Belagavi", gdp: 17.6, gdpGrowth: 5.7, unemploymentRate: 6.5, populationMillions: 2.5, riskScore: 40 },
  { id: "KA-06", stateId: "KA", name: "Kalaburagi", gdp: 15.8, gdpGrowth: 5.2, unemploymentRate: 7.3, populationMillions: 3.1, riskScore: 45 },
  { id: "KA-07", stateId: "KA", name: "Davanagere", gdp: 13.4, gdpGrowth: 5.0, unemploymentRate: 7.1, populationMillions: 2.0, riskScore: 43 },
  { id: "KA-08", stateId: "KA", name: "Shivamogga", gdp: 11.9, gdpGrowth: 4.8, unemploymentRate: 7.5, populationMillions: 1.8, riskScore: 47 },

  // Uttar Pradesh districts
  { id: "UP-01", stateId: "UP", name: "Lucknow", gdp: 42.3, gdpGrowth: 4.2, unemploymentRate: 9.1, populationMillions: 4.6, riskScore: 55 },
  { id: "UP-02", stateId: "UP", name: "Kanpur", gdp: 38.7, gdpGrowth: 3.8, unemploymentRate: 9.8, populationMillions: 4.2, riskScore: 60 },
  { id: "UP-03", stateId: "UP", name: "Agra", gdp: 31.2, gdpGrowth: 3.5, unemploymentRate: 10.2, populationMillions: 3.9, riskScore: 65 },
  { id: "UP-04", stateId: "UP", name: "Varanasi", gdp: 28.5, gdpGrowth: 3.3, unemploymentRate: 10.5, populationMillions: 3.7, riskScore: 68 },
  { id: "UP-05", stateId: "UP", name: "Prayagraj", gdp: 26.4, gdpGrowth: 3.1, unemploymentRate: 10.9, populationMillions: 5.4, riskScore: 72 },
  { id: "UP-06", stateId: "UP", name: "Meerut", gdp: 24.8, gdpGrowth: 3.4, unemploymentRate: 10.3, populationMillions: 3.5, riskScore: 66 },
  { id: "UP-07", stateId: "UP", name: "Ghaziabad", gdp: 31.9, gdpGrowth: 4.1, unemploymentRate: 8.9, populationMillions: 4.7, riskScore: 52 },
  { id: "UP-08", stateId: "UP", name: "Noida", gdp: 43.5, gdpGrowth: 4.8, unemploymentRate: 8.3, populationMillions: 6.8, riskScore: 48 },
  
  // More states' districts...
  // West Bengal districts
  { id: "WB-01", stateId: "WB", name: "Kolkata", gdp: 58.5, gdpGrowth: 4.1, unemploymentRate: 7.8, populationMillions: 14.8, riskScore: 48 },
  { id: "WB-02", stateId: "WB", name: "Howrah", gdp: 25.7, gdpGrowth: 3.8, unemploymentRate: 8.1, populationMillions: 5.1, riskScore: 51 },
  { id: "WB-03", stateId: "WB", name: "Siliguri", gdp: 18.3, gdpGrowth: 3.6, unemploymentRate: 8.7, populationMillions: 2.9, riskScore: 55 },
  { id: "WB-04", stateId: "WB", name: "Durgapur", gdp: 15.9, gdpGrowth: 3.5, unemploymentRate: 8.9, populationMillions: 2.2, riskScore: 56 },
  { id: "WB-05", stateId: "WB", name: "Asansol", gdp: 14.7, gdpGrowth: 3.3, unemploymentRate: 9.2, populationMillions: 1.9, riskScore: 58 },
  { id: "WB-06", stateId: "WB", name: "Kharagpur", gdp: 12.3, gdpGrowth: 3.2, unemploymentRate: 9.5, populationMillions: 1.7, riskScore: 61 },
  
  // Rajasthan districts
  { id: "RJ-01", stateId: "RJ", name: "Jaipur", gdp: 45.7, gdpGrowth: 5.5, unemploymentRate: 7.2, populationMillions: 6.7, riskScore: 42 },
  { id: "RJ-02", stateId: "RJ", name: "Jodhpur", gdp: 28.3, gdpGrowth: 5.1, unemploymentRate: 7.5, populationMillions: 3.9, riskScore: 45 },
  { id: "RJ-03", stateId: "RJ", name: "Udaipur", gdp: 21.6, gdpGrowth: 4.9, unemploymentRate: 7.8, populationMillions: 3.1, riskScore: 48 },
  { id: "RJ-04", stateId: "RJ", name: "Kota", gdp: 19.8, gdpGrowth: 5.2, unemploymentRate: 7.3, populationMillions: 2.5, riskScore: 44 },
  { id: "RJ-05", stateId: "RJ", name: "Bikaner", gdp: 15.2, gdpGrowth: 4.7, unemploymentRate: 8.1, populationMillions: 2.3, riskScore: 50 },
  { id: "RJ-06", stateId: "RJ", name: "Ajmer", gdp: 14.5, gdpGrowth: 4.5, unemploymentRate: 8.4, populationMillions: 2.1, riskScore: 52 },
  
  // Andhra Pradesh districts
  { id: "AP-01", stateId: "AP", name: "Visakhapatnam", gdp: 32.8, gdpGrowth: 4.9, unemploymentRate: 6.3, populationMillions: 4.3, riskScore: 38 },
  { id: "AP-02", stateId: "AP", name: "Vijayawada", gdp: 28.5, gdpGrowth: 5.1, unemploymentRate: 6.1, populationMillions: 3.7, riskScore: 36 },
  { id: "AP-03", stateId: "AP", name: "Guntur", gdp: 22.3, gdpGrowth: 4.7, unemploymentRate: 6.5, populationMillions: 3.1, riskScore: 40 },
  { id: "AP-04", stateId: "AP", name: "Tirupati", gdp: 18.9, gdpGrowth: 4.5, unemploymentRate: 6.7, populationMillions: 2.7, riskScore: 42 },
  { id: "AP-05", stateId: "AP", name: "Kakinada", gdp: 15.6, gdpGrowth: 4.3, unemploymentRate: 7.0, populationMillions: 2.5, riskScore: 45 },
  { id: "AP-06", stateId: "AP", name: "Nellore", gdp: 14.1, gdpGrowth: 4.1, unemploymentRate: 7.2, populationMillions: 2.3, riskScore: 47 },
  
  // Telangana districts
  { id: "TS-01", stateId: "TS", name: "Hyderabad", gdp: 75.3, gdpGrowth: 7.2, unemploymentRate: 4.9, populationMillions: 9.8, riskScore: 25 },
  { id: "TS-02", stateId: "TS", name: "Warangal", gdp: 24.7, gdpGrowth: 6.5, unemploymentRate: 5.3, populationMillions: 3.2, riskScore: 30 },
  { id: "TS-03", stateId: "TS", name: "Nizamabad", gdp: 18.5, gdpGrowth: 5.9, unemploymentRate: 5.7, populationMillions: 2.5, riskScore: 34 },
  { id: "TS-04", stateId: "TS", name: "Karimnagar", gdp: 15.3, gdpGrowth: 5.6, unemploymentRate: 6.0, populationMillions: 2.2, riskScore: 36 },
  { id: "TS-05", stateId: "TS", name: "Khammam", gdp: 13.8, gdpGrowth: 5.3, unemploymentRate: 6.3, populationMillions: 2.0, riskScore: 39 },
  
  // Kerala districts
  { id: "KL-01", stateId: "KL", name: "Thiruvananthapuram", gdp: 28.9, gdpGrowth: 5.3, unemploymentRate: 8.5, populationMillions: 3.3, riskScore: 35 },
  { id: "KL-02", stateId: "KL", name: "Kochi", gdp: 32.5, gdpGrowth: 5.8, unemploymentRate: 8.2, populationMillions: 3.6, riskScore: 32 },
  { id: "KL-03", stateId: "KL", name: "Kozhikode", gdp: 24.7, gdpGrowth: 5.1, unemploymentRate: 8.8, populationMillions: 3.1, riskScore: 37 },
  { id: "KL-04", stateId: "KL", name: "Thrissur", gdp: 21.3, gdpGrowth: 4.9, unemploymentRate: 9.0, populationMillions: 3.0, riskScore: 39 },
  { id: "KL-05", stateId: "KL", name: "Kollam", gdp: 17.6, gdpGrowth: 4.7, unemploymentRate: 9.3, populationMillions: 2.8, riskScore: 42 },
  { id: "KL-06", stateId: "KL", name: "Kannur", gdp: 15.2, gdpGrowth: 4.5, unemploymentRate: 9.5, populationMillions: 2.5, riskScore: 44 }
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
