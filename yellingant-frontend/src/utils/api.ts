// Lightweight API helper for frontend → backend integration
// - Uses Vite env `VITE_API_BASE_URL` if provided (no trailing slash)
// - Exposes: getQuiz(slug), submitQuiz(slug, answers), uploadImages(files, alt_texts, token?)

type Answer = { questionId: string; selectedOptions: string[] };

// Default API base: prefer VITE_API_BASE_URL, otherwise in development assume backend at localhost:5000
let API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
if (!API_BASE) {
  // when running in dev mode, point to local backend
  if (import.meta.env.DEV) {
    API_BASE = 'http://localhost:5000';
  } else {
    API_BASE = '';
  }
}

async function request(path: string, opts: RequestInit = {}) {
  const url = API_BASE + path;
  const headers = { ...(opts.headers || {}), } as Record<string,string>;
  // JSON requests default to application/json
  if (!opts.body || typeof opts.body === 'string') {
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  }

  // If Authorization header is not provided explicitly, try localStorage admin_token (dev/admin UI)
  try {
    if (!headers['Authorization'] && typeof window !== 'undefined' && window.localStorage) {
      const token = window.localStorage.getItem('admin_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore in non-browser environments
  }

  const res = await fetch(url, { credentials: 'include', ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  // attempt to parse json, fall back to text
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

/** Fetch a quiz by slug. Pass `shuffle=true` to ask server to shuffle options. */
export async function getQuiz(slug: string, shuffle = false): Promise<any> {
  const q = shuffle ? '?shuffle=true' : '';
  return request(`/api/quiz/${encodeURIComponent(slug)}${q}`);
}

/** Submit quiz answers. `answers` should be array of { questionId, selectedOptions } */
export async function submitQuiz(
  slug: string,
  answers: Answer[],
  userId?: string,
  sessionId?: string
): Promise<any> {
  return request(`/api/quiz/${encodeURIComponent(slug)}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers, userId, sessionId }),
  });
}

/** Upload images for admin. `alt_texts` required by server middleware. Pass `token` for Authorization if needed. */
export async function uploadImages(files: File[], alt_texts: string[], token?: string): Promise<any> {
  const fd = new FormData();
  files.forEach((f) => fd.append('images', f));
  fd.append('alt_texts', JSON.stringify(alt_texts || []));

  const authHeader = token || (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('admin_token') : undefined);
  const res = await fetch((API_BASE || '') + '/api/admin/upload', {
    method: 'POST',
    body: fd,
    headers: authHeader ? { Authorization: `Bearer ${authHeader}` } : undefined,
    credentials: 'include',
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Upload failed ${res.status}: ${txt}`);
  }
  return res.json();
}

/** Create a new quiz (admin) */
export async function createQuiz(quizData: any, token?: string): Promise<any> {
  return request(`/api/admin/quiz`, {
    method: 'POST',
    body: JSON.stringify(quizData),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Update an existing quiz by slug (admin) */
export async function updateQuiz(slug: string, quizData: any, token?: string): Promise<any> {
  return request(`/api/admin/quiz/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    body: JSON.stringify(quizData),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Publish or unpublish a quiz (admin) */
export async function publishQuiz(slug: string, publish = true, token?: string): Promise<any> {
  return request(`/api/admin/quiz/${encodeURIComponent(slug)}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ publish }),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export default { getQuiz, submitQuiz, uploadImages, createQuiz, updateQuiz, publishQuiz };
