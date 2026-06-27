const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const fetchOrgs = async () => {
  const response = await fetch(`${API_BASE_URL}/orgs`);
  if (!response.ok) throw new Error('Failed to fetch organizations');
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

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to check flag');
  }
  return data;
};