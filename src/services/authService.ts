const WP_BASE_URL = import.meta.env.VITE_WP_BASE_URL ?? 'https://concise.ng/honeymooner/wp-json';

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

const AUTH_TOKEN_ENDPOINTS = (
  import.meta.env.VITE_WP_AUTH_TOKEN_ENDPOINTS ??
  '/jwt-auth/v1/token,/api/v1/token'
).split(',').map((s: string) => s.trim()).filter(Boolean);

const AUTH_VALIDATE_ENDPOINTS = (
  import.meta.env.VITE_WP_AUTH_VALIDATE_ENDPOINTS ??
  '/jwt-auth/v1/token/validate,/api/v1/token/validate'
).split(',').map((s: string) => s.trim()).filter(Boolean);

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

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    let lastError: unknown;

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
          if (response.status === 404 || error?.code === 'rest_no_route') {
            lastError = { message: 'Login endpoint not found on WordPress. Install/configure an auth plugin (e.g. JWT) or provide a custom token endpoint.' };
          } else {
            lastError = error;
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
      } catch (err) {
        lastError = err;
      }
    }
    const message = (lastError as { message?: string } | undefined)?.message || 'Login failed';
    throw new Error(message);
  },

  async register(username: string, email: string, password: string): Promise<UserProfile> {
    const response = await fetch(`${WP_BASE_URL}/wp/v2/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.status === 404) {
      throw new Error('Registration endpoint not found. Please ensure the "WP REST API User Registration" plugin is installed and active on your WordPress site.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      const errorMessage = error.message || error.code || 'Registration failed';
      throw new Error(errorMessage);
    }

    return response.json();
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
