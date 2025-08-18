import {
  useState,
  useEffect,
  type PropsWithChildren,
  useCallback,
} from "react";
import { supabaseClient } from "@/lib/supabase/supabase-client";
import type { Session, Subscription, User } from "@supabase/supabase-js";
import { AuthContext } from "./types";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subs: Subscription | null = null;

    const fetchSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabaseClient.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
        if (event === "SIGNED_OUT") {
          setError(null);
        }
      });
      subs = subscription;
    };

    fetchSession();

    return () => {
      subs?.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { error: signOutError } = await supabaseClient.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
    } else {
      setUser(null);
      setSession(null);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
