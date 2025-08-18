import type { Session, User } from "@supabase/supabase-js";
import { createContext } from "react";

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);
