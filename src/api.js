// api.js example
export const registerUser = async (userData) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
  
      return await response.json();
    } catch (error) {
      if (!error.message) {
        error.message = 'Network error';
      }
      throw error;
    }
  };