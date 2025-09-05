import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeQuery(table: string, options?: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = (supabase as any).from(table).select(options?.select || '*');
        
        if (options?.eq) {
          query = query.eq(options.eq[0], options.eq[1]);
        }
        if (options?.order) {
          query = query.order(options.order[0], options.order[1]);
        }
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error } = await query;
        if (error) throw error;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table]);

  return { data, loading, error };
}

export function useRealtimeStats() {
  const [stats, setStats] = useState({ datasets: 0, users: 0, applications: 0, outputs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const results = await Promise.all([
          (supabase as any).from('datasets').select('*', { count: 'exact', head: true }),
          (supabase as any).from('users').select('*', { count: 'exact', head: true }),
          (supabase as any).from('applications').select('*', { count: 'exact', head: true }),
          (supabase as any).from('research_outputs').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          datasets: results[0].count || 0,
          users: results[1].count || 0,
          applications: results[2].count || 0,
          outputs: results[3].count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}