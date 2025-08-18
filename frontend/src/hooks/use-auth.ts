import { AuthContext, type AuthState } from "@/contexts/auth/types";
import { useContext } from "react";

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
