// Lightweight API helper for frontend → backend integration
// - Uses Vite env `VITE_API_BASE_URL` if provided (no trailing slash)
// - Exposes: getQuiz(slug), submitQuiz(slug, answers), uploadImages(files, alt_texts, token?)

type Answer = { questionId: string; selectedOptions: string[] };

import { getQuizBySlug } from '../quiz/data/quizzes';

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

export async function request(path: string, opts: RequestInit = {}) {
  const url = API_BASE + path;
  const headers = { ...(opts.headers || {}), } as Record<string,string>;
  // JSON requests default to application/json
  if (!opts.body || typeof opts.body === 'string') {
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  }

  // If Authorization header is not provided explicitly, try localStorage admin_token (dev/admin UI)
  try {
    if (!headers['Authorization']) {
      let token: string | null = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        token = window.localStorage.getItem('admin_token');
      }
      // Fallback for dev
      if (!token && import.meta.env.DEV) {
        token = 'ayW1YVN3g72H';
      }
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore in non-browser environments
  }

  // Add AbortController for timeout (60 seconds to handle slow Neon DB cold starts)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(url, { credentials: 'include', ...opts, headers, signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const text = await res.text();
      try {
          const json = JSON.parse(text);
          throw new Error(json.error?.message || json.error || text);
      } catch (e: any) {
          if (e.message && !e.message.includes('JSON')) throw e;
          throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
      }
    }
    // attempt to parse json, fall back to text
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    return res.text();
  } catch (e: any) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    throw e;
  }
}

/** Fetch a quiz by slug. Pass `shuffle=true` to ask server to shuffle options. */
export async function getQuiz(slug: string, shuffle = false): Promise<any> {
  // If no backend URL configured (static-only deploy), return local quiz data
  if (!API_BASE) {
    const local = getQuizBySlug(slug);
    if (local) return local;
    // otherwise fall through to attempt a relative request which will likely 404 in static mode
  }

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

  let authHeader = token || (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('admin_token') : undefined);
  
  if (!authHeader && import.meta.env.DEV) {
    authHeader = 'ayW1YVN3g72H';
  }

  const res = await fetch((API_BASE || '') + '/api/admin/upload', {
    method: 'POST',
    body: fd,
    headers: authHeader ? { Authorization: `Bearer ${authHeader}` } : undefined,
    credentials: 'include',
  });

  if (!res.ok) {
    const txt = await res.text();
    try {
      const json = JSON.parse(txt);
      throw new Error(json.error?.message || json.error || txt);
    } catch (e: any) {
      // if parsing failed or if the error we threw above was caught (it won't be caught here, but just in case)
      if (e.message && e.message !== 'Unexpected token' && !e.message.includes('JSON')) {
         throw e;
      }
      throw new Error(`Upload failed ${res.status}: ${txt}`);
    }
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

/** Get all quizzes (admin) */
export async function getAllQuizzes(token?: string): Promise<any> {
  return request(`/api/admin/quiz`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Delete a quiz by slug (admin) */
export async function deleteQuiz(slug: string, token?: string): Promise<any> {
  return request(`/api/admin/quiz/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Create a new ad (admin) */
export async function createAd(adData: any, token?: string): Promise<any> {
  return request(`/api/ads`, {
    method: 'POST',
    body: JSON.stringify(adData),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Update an existing ad by ID (admin) */
export async function updateAd(id: string, adData: any, token?: string): Promise<any> {
  return request(`/api/ads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(adData),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Delete an ad by ID (admin) */
export async function deleteAd(id: string, token?: string): Promise<any> {
  return request(`/api/ads/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Get all ads */
export async function getAds(token?: string): Promise<any> {
  return request(`/api/ads`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export default { 
  getQuiz, 
  submitQuiz, 
  uploadImages, 
  createQuiz, 
  updateQuiz, 
  publishQuiz, 
  getAllQuizzes,
  deleteQuiz,
  createAd,
  updateAd,
  deleteAd,
  getAds
};