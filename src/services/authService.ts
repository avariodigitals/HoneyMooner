const WP_BASE_URL = 'https://concise.ng/honeymooner/wp-json';

export interface AuthResponse {
  token_type: string;
  iat: number;
  expires_in: number;
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

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${WP_BASE_URL}/api/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.jwt_token);
    return data;
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
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
      const response = await fetch(`${WP_BASE_URL}/api/v1/token/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};
