import { useCallback, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'clientSlug';

export function useAuth() {
  const [clientSlug, setClientSlug] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem(LOCAL_STORAGE_KEY);
  });
  const [loading, setLoading] = useState(false);

  // On mount, check Supabase session and sync clientSlug if needed
  useEffect(() => {
    let isMounted = true;
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (session) {
        // Try to get clientSlug from user_metadata
        const user = session.user;
        let slug = user.user_metadata?.clientSlug;
        if (!slug) {
          // Optionally, fetch from a profile table if not in metadata
          // const { data: profile, error } = await supabase
          //   .from('profiles')
          //   .select('clientSlug')
          //   .eq('id', user.id)
          //   .single();
          // slug = profile?.clientSlug;
        }
        if (slug) {
          localStorage.setItem(LOCAL_STORAGE_KEY, slug);
          setClientSlug(slug);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setClientSlug(null);
          setIsLoggedIn(false);
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setClientSlug(null);
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
    // Get clientSlug from user_metadata
    const user = data.session.user;
    console.log("Logged-in user metadata:", user.user_metadata);
    let slug = user.user_metadata?.clientSlug;
    if (!slug) {
      // Optionally, fetch from a profile table if not in metadata
      // const { data: profile, error: profileError } = await supabase
      //   .from('profiles')
      //   .select('clientSlug')
      //   .eq('id', user.id)
      //   .single();
      // slug = profile?.clientSlug;
    }
    if (slug) {
      localStorage.setItem(LOCAL_STORAGE_KEY, slug);
      setClientSlug(slug);
      setIsLoggedIn(true);
      return { success: true };
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setClientSlug(null);
      setIsLoggedIn(false);
      return { success: false, message: 'No clientSlug found for this user.' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setClientSlug(null);
    setIsLoggedIn(false);
  }, []);

  return { isLoggedIn, clientSlug, login, logout, loading };
} 