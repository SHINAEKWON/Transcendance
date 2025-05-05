export function authorizedFetch(url: any, options: any = {}) {
    const authToken = localStorage.getItem("authToken");
    const hasBody = !!options.body;
    const headers = {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        "Authorization": `Bearer ${authToken}`,
        ...(options.headers || {})
    };
  
    return fetch(url, { ...options, headers });
  }
  