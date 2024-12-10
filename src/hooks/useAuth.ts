import { useCallback } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import * as authService from '../services/supabase/auth';
import { UserProfile } from '../types/finance';

export function useAuth() {
  const { setUserProfile } = useFinanceStore();

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const authData = await authService.signUp(email, password, profile);
    if (authData.user) {
      const userProfile = await authService.getCurrentUserProfile();
      if (userProfile) {
        setUserProfile(userProfile);
      }
    }
    return authData;
  }, [setUserProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const authData = await authService.signIn(email, password);
    if (authData.user) {
      const userProfile = await authService.getCurrentUserProfile();
      if (userProfile) {
        setUserProfile(userProfile);
      }
    }
    return authData;
  }, [setUserProfile]);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUserProfile(null);
  }, [setUserProfile]);

  const getCurrentUser = useCallback(async () => {
    const user = await authService.getCurrentUser();
    if (user) {
      const userProfile = await authService.getCurrentUserProfile();
      if (userProfile) {
        setUserProfile(userProfile);
      }
    }
    return user;
  }, [setUserProfile]);

  return {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
  };
}