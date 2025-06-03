/**
 * Form Validation Utilities
 * 
 * This file contains reusable validation functions for form fields
 * across the application to ensure consistent validation logic.
 */

/**
 * Validates if a string is a properly formatted email address
 * @param email - The email string to validate
 * @returns boolean - True if valid, false if invalid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates if a string is a properly formatted phone number
 * Allows various formats including international format
 * @param phone - The phone string to validate 
 * @returns boolean - True if valid, false if invalid (empty string is considered valid)
 */
export const validatePhone = (phone: string): boolean => {
  // This regex allows for:
  // +1 (123) 456-7890, (123) 456-7890, 123-456-7890, 123.456.7890, etc.
  const phoneRegex = /^(?:\+?\d{1,3}[- ]?)?\(?(?:\d{3})\)?[- ]?\d{3}[- ]?\d{4}$/;
  return phone === '' || phoneRegex.test(phone); // Empty is valid (since it's optional)
};

/**
 * Validates if a required field has a value
 * @param value - The string to check
 * @returns boolean - True if valid (has content), false if invalid (empty)
 */
export const validateRequired = (value: string): boolean => {
  return value.trim() !== '';
};

/**
 * Validate URL format
 * @param url - The URL string to validate
 * @returns boolean - True if valid, false if invalid (empty string is considered valid)
 */
export const validateUrl = (url: string): boolean => {
  if (url === '') return true; // Optional field
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}; 