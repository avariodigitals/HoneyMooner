const WP_BASE_URL = import.meta.env.VITE_WP_BASE_URL ?? 'https://cms.thehoneymoonertravel.com/wp-json';

export interface AuthResponse {
  token_type?: string;
  iat?: number;
  expires_in?: number;
  jwt_token: string;
}

export interface UserProfile {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email: string;
  roles: string[];
  avatar_urls?: { [key: string]: string };
}

const AUTH_TOKEN_ENDPOINTS = [
  '/jwt-auth/v1/token'
];

const AUTH_VALIDATE_ENDPOINTS = (
  import.meta.env.VITE_WP_AUTH_VALIDATE_ENDPOINTS ??
  '/jwt-auth/v1/token/validate,/api/v1/token/validate'
).split(',').map((s: string) => s.trim()).filter(Boolean);

const AUTH_REGISTER_ENDPOINTS = (
  import.meta.env.VITE_WP_AUTH_REGISTER_ENDPOINTS ??
  '/custom/v1/signup,/wp/v2/users/register'
).split(',').map((s: string) => s.trim()).filter(Boolean);

let wpRoutes: Record<string, unknown> | null = null;

function resolveEndpoint(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  if (endpoint.startsWith('/')) return `${WP_BASE_URL}${endpoint}`;
  return `${WP_BASE_URL}/${endpoint}`;
}

function bearerHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`
  };
}

async function getWPRoutes(): Promise<Record<string, unknown>> {
  if (wpRoutes) return wpRoutes;
  const response = await fetch(WP_BASE_URL);
  if (!response.ok) return {};
  const data = await response.json().catch(() => ({})) as { routes?: Record<string, unknown> };
  wpRoutes = data.routes || {};
  return wpRoutes;
}

function endpointPath(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    try {
      const parsed = new URL(endpoint);
      return parsed.pathname.replace(/\/wp-json$/, '') || parsed.pathname;
    } catch {
      return endpoint;
    }
  }
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

export const authService = {
  async isRegistrationAvailable(): Promise<boolean> {
    try {
      const routes = await getWPRoutes();
      return AUTH_REGISTER_ENDPOINTS.some((endpoint: string) => endpointPath(endpoint) in routes);
    } catch {
      return false;
    }
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    let lastError: any;

    for (const endpoint of AUTH_TOKEN_ENDPOINTS) {
      try {
        const body = new URLSearchParams();
        body.set('username', username);
        body.set('password', password);
        const response = await fetch(resolveEndpoint(endpoint), {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Login failed' }));
          // Friendly error messages for common auth errors
          if (response.status === 404 || error?.code === 'rest_no_route') {
            lastError = { message: 'Login endpoint not found on WordPress. Install/configure an auth plugin (e.g. JWT) or provide a custom token endpoint.' };
          } else if (response.status === 403 || error?.code === 'incorrect_password') {
            lastError = { message: 'The password you entered for the username ' + username + ' is incorrect.' };
          } else if (response.status === 403 || error?.code === 'invalid_username') {
            lastError = { message: 'The username ' + username + ' does not exist.' };
          } else if (error?.message) {
            lastError = { message: error.message };
          } else {
            lastError = { message: 'Login failed. Please check your credentials and try again.' };
          }
          continue;
        }

        const data = await response.json();
        const token: string | undefined = data.jwt_token ?? data.token ?? data.jwt ?? data.data?.token;
        if (!token) {
          lastError = { message: 'Token not present in auth response' };
          continue;
        }
        this.setToken(token);
        return { jwt_token: token, token_type: data.token_type, iat: data.iat, expires_in: data.expires_in };
      } catch (err: any) {
        lastError = err;
      }
    }
    const message = (lastError && lastError.message) ? lastError.message : 'Login failed';
    throw new Error(message);
  },

  async register(username: string, email: string, password: string): Promise<UserProfile> {
    const routes = await getWPRoutes();
    let lastError: unknown;

    for (const endpoint of AUTH_REGISTER_ENDPOINTS) {
      const routePath = endpointPath(endpoint);
      if (!(routePath in routes)) {
        lastError = { message: `Route ${routePath} is not exposed by your WordPress REST API.` };
        continue;
      }

      const response = await fetch(resolveEndpoint(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Registration failed' }));
        lastError = error;
        continue;
      }

      return response.json();
    }

    const message = (lastError as { message?: string; code?: string } | undefined)?.message
      || (lastError as { message?: string; code?: string } | undefined)?.code
      || 'Registration is currently unavailable. Please contact support or enable a WordPress REST registration endpoint.';
    throw new Error(message);
  },

  async getCurrentUser(): Promise<UserProfile> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${WP_BASE_URL}/wp/v2/users/me`, {
      headers: bearerHeaders(token)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  },

  setToken(token: string) {
    localStorage.setItem('hm_wp_token', token);
  },

  getToken() {
    return localStorage.getItem('hm_wp_token');
  },

  logout() {
    localStorage.removeItem('hm_wp_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      for (const endpoint of AUTH_VALIDATE_ENDPOINTS) {
        const response = await fetch(resolveEndpoint(endpoint), {
          method: 'POST',
          headers: bearerHeaders(token)
        });
        if (response.ok) return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};
