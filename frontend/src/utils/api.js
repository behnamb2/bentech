const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-username.github.io/expense-manager/api'  // GitHub Pages URL
  : 'http://localhost:5001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    console.error('API error response:', errorData);
    throw new Error(errorData.message || `Request failed with status: ${response.status}`);
  }
  return response.json();
};

const fetchConfig = {
  credentials: 'include',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const login = async (email, password) => {
  try {
    console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      ...fetchConfig,
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = await handleResponse(response);
    if (!data.token) {
      console.error('Invalid response data:', data);
      throw new Error('Invalid response from server');
    }
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed. Please check your connection and try again.');
  }
};

export const register = async (name, email, password) => {
  try {
    console.log('Attempting registration to:', `${API_BASE_URL}/auth/register`);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      ...fetchConfig,
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

export const getExpenses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      ...fetchConfig,
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get expenses error:', error);
    throw new Error(error.message || 'Failed to fetch expenses');
  }
};

export const addExpense = async (expenseData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      ...fetchConfig,
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Add expense error:', error);
    throw new Error(error.message || 'Failed to add expense');
  }
};

export const getExpense = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      ...fetchConfig,
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get expense error:', error);
    throw new Error(error.message || 'Failed to fetch expense');
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      ...fetchConfig,
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Update expense error:', error);
    throw new Error(error.message || 'Failed to update expense');
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      ...fetchConfig,
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Delete expense error:', error);
    throw new Error(error.message || 'Failed to delete expense');
  }
};

export const getDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/dashboard`, {
      ...fetchConfig,
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get dashboard data error:', error);
    throw new Error(error.message || 'Failed to fetch dashboard data');
  }
}; 