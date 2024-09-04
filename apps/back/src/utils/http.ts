import fetch from 'node-fetch';

export function getHeader(req: fetch.Headers, header: string): string | null {
  return req.get(header) || req.get(header.toLowerCase()) || null;
}
