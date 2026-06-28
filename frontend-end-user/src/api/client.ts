const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const handleResponse = async (response: Response, defaultError: string) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || defaultError);
    return data;
  } else {
    const text = await response.text();
    throw new Error(text || defaultError);
  }
};

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response, 'Failed to login');
};

export const registerUser = async (email: string, password: string, orgName: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/register/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, orgName }),
  });
  return handleResponse(response, 'Failed to sign up');
};

export const fetchOrgs = async () => {
  const response = await fetch(`${API_BASE_URL}/orgs`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch organizations');
  }
  return response.json();
};

export const checkFlag = async (orgId: string, featureKey: string) => {
  const response = await fetch(`${API_BASE_URL}/flags/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      org_id: orgId,
      feature_key: featureKey,
    }),
  });
  return handleResponse(response, 'Failed to check flag');
};