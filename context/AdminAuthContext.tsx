"use client";

import { api, ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface Admin {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let cachedAdmin: Admin | null | undefined;
let inflightAdmin: Promise<Admin | null> | null = null;

const fetchAdminOnce = async (): Promise<Admin | null> => {
  if (cachedAdmin !== undefined) {
    return cachedAdmin;
  }
  if (inflightAdmin) {
    return inflightAdmin;
  }

  inflightAdmin = api
    .getMe()
    .then((response) => {
      cachedAdmin = response.data ?? null;
      return cachedAdmin;
    })
    .finally(() => {
      inflightAdmin = null;
    });

  return inflightAdmin;
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const adminData = await fetchAdminOnce();
        if (adminData) {
          setAdmin(adminData);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401 || err.status === 403) {
            api.logout();
            cachedAdmin = null;
          } else if (err.status === 429) {
            setError("Too many requests. Please wait a moment and refresh.");
          } else {
            setError(err.message);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);

      try {
        const response = await api.login(email, password);
        if (response.data?.admin) {
          setAdmin(response.data.admin);
          cachedAdmin = response.data.admin;
          router.push("/admin");
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    api.logout();
    setAdmin(null);
    cachedAdmin = null;
    router.push("/admin/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
