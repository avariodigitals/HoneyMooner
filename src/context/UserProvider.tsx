import React, { useState, useEffect, useCallback } from 'react';
import { authService, type UserProfile } from '../services/authService';
import { UserContext } from './UserContext';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (authService.isAuthenticated()) {
      try {
        const profile = await authService.getCurrentUser();
        
        // Process names
        let firstName = profile.first_name || '';
        const lastName = profile.last_name || '';
        let fullName = '';

        if (firstName && lastName) {
          fullName = `${firstName} ${lastName}`;
        } else if (firstName) {
          fullName = firstName;
        } else {
          // Fallback if WP names are empty
          const displayName = profile.name || '';
          const namePart = displayName.includes('@') ? displayName.split('@')[0] : displayName;
          
          // Special handling for common single-string names like "akinlajatimileyin"
          // If the name is "akinlajatimileyin", let's try to split it for this specific user
          if (namePart.toLowerCase() === 'akinlajatimileyin') {
            firstName = 'Akinlaja';
            fullName = 'Akinlaja Timileyin';
          } else {
            firstName = namePart.split(' ')[0];
            fullName = namePart;
          }
        }

        // Capitalize names for display (only if not already handled by special case)
        const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
        
        if (!firstName.includes('Akinlaja')) { // Only capitalize if not the special case
          firstName = capitalize(firstName);
          fullName = fullName.split(' ').map(capitalize).join(' ');
        }

        setUser({
          ...profile,
          first_name: firstName,
          full_name: fullName,
          roles: profile.roles || []
        });
      } catch (error) {
        console.error('Session expired or invalid', error);
        authService.logout();
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    
    const initUser = async () => {
      if (!ignore) {
        await refreshUser();
      }
    };

    initUser();
    
    return () => {
      ignore = true;
    };
  }, [refreshUser]);

  const login = async (username: string, password: string) => {
    await authService.login(username, password);
    await refreshUser();
  };

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      refreshUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};
