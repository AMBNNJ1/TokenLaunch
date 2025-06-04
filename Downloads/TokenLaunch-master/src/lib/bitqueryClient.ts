export async function bitqueryClient<T>(query: string, variables?: Record<string, any>, signal?: AbortSignal): Promise<T> {
  const key = (import.meta as any).env?.VITE_BITQUERY_KEY || process.env.NEXT_PUBLIC_BITQUERY_KEY;
  const res = await fetch('https://graphql.bitquery.io/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key ?? ''
    },
    body: JSON.stringify({ query, variables }),
    signal
  });

  if (!res.ok) {
    throw new Error(`Bitquery error: ${res.status}`);
  }

  return res.json();
}
