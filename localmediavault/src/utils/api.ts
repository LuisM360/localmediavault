const API_BASE = process.env.API_BASE_URL;

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.message || "API Error");
  }

  return data;
}
