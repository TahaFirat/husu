// In the native app there is no server. The web app's API route handlers are plain
// `GET(request, { params })` functions that only call public HTTPS APIs, so we run
// them in-process and route `/api/*` fetches to them.
import { GET as quranGET } from '@/app/api/quran/[id]/route';
import { GET as wordsGET } from '@/app/api/words/[id]/route';

// --- Polyfills for older iOS WebKit (iOS 15/16) ---
if (typeof (Response as unknown as { json?: unknown }).json !== 'function') {
  (Response as unknown as { json: (data: unknown, init?: ResponseInit) => Response }).json = (data, init = {}) => {
    const headers = new Headers(init.headers);
    if (!headers.has('content-type')) headers.set('content-type', 'application/json');
    return new Response(JSON.stringify(data), { ...init, headers });
  };
}
if (typeof (AbortSignal as unknown as { timeout?: unknown }).timeout !== 'function') {
  (AbortSignal as unknown as { timeout: (ms: number) => AbortSignal }).timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException('TimeoutError', 'TimeoutError')), ms);
    return controller.signal;
  };
}

type Handler = (request: Request, ctx: { params: Promise<{ id: string }> }) => Promise<Response>;
const routes: [RegExp, Handler][] = [
  [/^\/api\/quran\/([^/]+)$/, quranGET as Handler],
  [/^\/api\/words\/([^/]+)$/, wordsGET as Handler],
];

const nativeFetch = window.fetch.bind(window);

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(raw, window.location.href);
  if (url.origin === window.location.origin && url.pathname.startsWith('/api/')) {
    for (const [pattern, handler] of routes) {
      const match = url.pathname.match(pattern);
      if (match) {
        if (init?.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        return handler(new Request(url.href, init), { params: Promise.resolve({ id: decodeURIComponent(match[1]) }) });
      }
    }
    return new Response(JSON.stringify({ error: 'Bu özellik uygulamada kullanılamıyor.' }), { status: 404, headers: { 'content-type': 'application/json' } });
  }
  return nativeFetch(input, init);
};
