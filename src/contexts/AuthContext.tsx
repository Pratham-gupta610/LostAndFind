import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
  return data;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updatePhone: (phone: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await getProfile(user.id);
    setProfile(profileData);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id).then(setProfile);
      }
      setLoading(false);
    });
    // In this function, do NOT use any await calls. Use `.then()` instead to avoid deadlocks.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      // Validate college/university email format
      // Accept: .edu, @college., @university., @iiit, @iit, @nit, .ac.in, etc.
      const isCollegeEmail = 
        email.endsWith('.edu') || 
        email.includes('@college.') || 
        email.includes('@university.') ||
        email.includes('@iiit') ||
        email.includes('@iit') ||
        email.includes('@nit') ||
        email.endsWith('.ac.in') ||
        email.endsWith('.edu.in');
      
      if (!isCollegeEmail) {
        throw new Error('Please use a valid college or university email address');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      // Validate college/university email format
      // Accept: .edu, @college., @university., @iiit, @iit, @nit, .ac.in, etc.
      const isCollegeEmail = 
        email.endsWith('.edu') || 
        email.includes('@college.') || 
        email.includes('@university.') ||
        email.includes('@iiit') ||
        email.includes('@iit') ||
        email.includes('@nit') ||
        email.endsWith('.ac.in') ||
        email.endsWith('.edu.in');
      
      if (!isCollegeEmail) {
        throw new Error('Please use a valid college or university email address');
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePhone = async (phone: string) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({ phone, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      
      // Refresh profile after update
      await refreshProfile();
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signIn: signInWithEmail, 
      signUp: signUpWithEmail, 
      signOut, 
      refreshProfile,
      updatePhone 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}