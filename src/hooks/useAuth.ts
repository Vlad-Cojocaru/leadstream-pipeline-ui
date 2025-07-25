import { useCallback, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'clientName';

export function useAuth() {
  const [clientName, setClientName] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem(LOCAL_STORAGE_KEY);
  });
  const [loading, setLoading] = useState(false);

  // On mount, check Supabase session and sync clientName if needed
  useEffect(() => {
    let isMounted = true;
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (session) {
        // Try to get clientName from user_metadata
        const user = session.user;
        let name = user.user_metadata?.clientName;
        if (!name) {
          // Optionally, fetch from a profile table if not in metadata
          // const { data: profile, error } = await supabase
          //   .from('profiles')
          //   .select('clientName')
          //   .eq('id', user.id)
          //   .single();
          // name = profile?.clientName;
        }
        if (name) {
          localStorage.setItem(LOCAL_STORAGE_KEY, name);
          setClientName(name);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setClientName(null);
          setIsLoggedIn(false);
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setClientName(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    };
    getSession();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });
    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    console.log("Logging in with", email, password);
    console.log("Supabase client:", supabase);

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("Supabase response:", { data, error }); 
    setLoading(false);
    if (error || !data.session) {
      return { success: false, message: error?.message || 'Login failed.' };
    }
    // Get clientName from user_metadata
    const user = data.session.user;
    console.log("Logged-in user metadata:", user.user_metadata);
    let name = user.user_metadata?.clientName;
    if (!name) {
      // Optionally, fetch from a profile table if not in metadata
      // const { data: profile, error: profileError } = await supabase
      //   .from('profiles')
      //   .select('clientName')
      //   .eq('id', user.id)
      //   .single();
      // name = profile?.clientName;
    }
    if (name) {
      localStorage.setItem(LOCAL_STORAGE_KEY, name);
      setClientName(name);
      setIsLoggedIn(true);
      return { success: true };
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setClientName(null);
      setIsLoggedIn(false);
      return { success: false, message: 'No clientName found for this user.' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setClientName(null);
    setIsLoggedIn(false);
  }, []);

  return { isLoggedIn, clientName, login, logout, loading };
} 