
import { SeverityLevel } from './types';

// Get severity color for UI elements
export const getSeverityColor = (severity: SeverityLevel): string => {
  switch (severity) {
    case 'extreme': return 'bg-red-600 text-white';
    case 'high': return 'bg-red-500 text-white';
    case 'medium': return 'bg-orange-500 text-white';
    default: return 'bg-green-500 text-white';
  }
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Phone validation 
export const validatePhone = (phone: string): boolean => {
  // Basic validation for international phone numbers
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone);
};
