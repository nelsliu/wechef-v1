const BASE = (import.meta.env.VITE_API_URL as string | undefined) || 'http://127.0.0.1:5000';

export async function api<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  const body = json !== undefined ? JSON.stringify(json) : rest.body;

  const response = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {})
    },
    ...rest,
    body
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      message += `: ${await response.text()}`;
    } catch (error) {
      console.error('Failed to read error body', error);
    }
    throw new Error(message.trim());
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
