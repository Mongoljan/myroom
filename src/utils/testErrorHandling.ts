/**
 * Test utility to verify error handling works correctly
 * This can be used in your login component for debugging
 */

import { CustomerService } from '@/services/customerApi';

export const testErrorHandling = async () => {
  try {
    // This should trigger the validation error you're seeing
    await CustomerService.login({
      email: 'wrong@email.com',
      password: 'wrongpassword'
    });
  } catch (error) {
    console.log('Error caught successfully:', error.message);
    
    // Should now show: "Имэйл эсвэл нууц үг буруу." instead of JSON object
    return error.message;
  }
};

// Example usage in your login component:
// import { testErrorHandling } from '@/utils/testErrorHandling';
// 
// const handleTestError = async () => {
//   const errorMessage = await testErrorHandling();
//   alert(`Error: ${errorMessage}`); // Should show proper message
// };