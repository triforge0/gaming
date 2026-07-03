const ADMIN_PREFIX = '/api/admin/treasurequest';

function apiOrigin(): string {
  if (location.port === '3002') {
    return `${location.protocol}//${location.hostname}:8080`;
  }
  const port = location.port ? `:${location.port}` : '';
  return `${location.protocol}//${location.hostname}${port}`;
}

function adminHeaders(token: string): HeadersInit {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token.trim()) {
    headers['X-TreasureQuest-Admin-Token'] = token.trim();
  }
  return headers;
}

export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function adminGet<T>(resource: 'quizzes' | 'checkpoints' | 'config', token: string): Promise<T> {
  const response = await fetch(`${apiOrigin()}${ADMIN_PREFIX}/${resource}`, {
    headers: adminHeaders(token),
  });
  if (!response.ok) {
    throw new AdminApiError(response.status, await response.text());
  }
  return (await response.json()) as T;
}

export async function adminPut(
  resource: 'quizzes' | 'checkpoints' | 'config',
  token: string,
  body: unknown,
): Promise<void> {
  const response = await fetch(`${apiOrigin()}${ADMIN_PREFIX}/${resource}`, {
    method: 'PUT',
    headers: { ...adminHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body, null, 2),
  });
  if (!response.ok) {
    throw new AdminApiError(response.status, await response.text());
  }
}
