/**
 * Normalizes backend error messages into user-friendly English strings
 */
export function normalizeBackendError(error: any): string {
  if (!error) return 'An unknown error occurred';
  
  const errorMessage = error.message || String(error);
  
  // Check for common authorization errors
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('Only admins')) {
    return 'Access denied: You do not have permission to perform this action';
  }
  
  // Check for trap messages
  if (errorMessage.includes('trap') || errorMessage.includes('Trap')) {
    // Extract the actual message after "trap: "
    const trapMatch = errorMessage.match(/trap:\s*(.+)/i);
    if (trapMatch) {
      return trapMatch[1];
    }
    return 'Operation failed due to a backend error';
  }
  
  // Check for specific error patterns
  if (errorMessage.includes('does not exist')) {
    return 'The requested item does not exist';
  }
  
  if (errorMessage.includes('Actor not')) {
    return 'Backend connection not available. Please try again.';
  }
  
  // Return the original message if no pattern matches
  return errorMessage;
}
