import { useEffect, useState } from 'react';

export function useHashRoute(): [string, (r: string) => void] {
  const [route, setRoute] = useState(() => normalize(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(normalize(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (r: string) => {
    window.location.hash = r;
  };

  return [route, navigate];
}

function normalize(hash: string): string {
  if (!hash || hash === '#') return '/';
  return hash.replace(/^#/, '') || '/';
}

export function parseRoute(route: string): { base: string; param?: string } {
  const parts = route.split('/').filter(Boolean);
  if (parts.length === 0) return { base: '/' };
  if (parts.length === 1) return { base: '/' + parts[0] };
  return { base: '/' + parts[0], param: parts.slice(1).join('/') };
}
