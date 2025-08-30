import { useState, useEffect } from "react";
import { statsApi, type StatsData } from "@/lib/api/stats";

interface UseStatsReturn {
  stats: StatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStats = (): UseStatsReturn => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statsApi.getStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const refetch = async () => {
    await fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
