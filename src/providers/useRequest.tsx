import { useEffect, useState } from 'react';

interface RequestOptions<T> {
  url: string;
}

export const useRequest = <T,>({ url }: RequestOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data: T = await response.json();
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, error, loading, fetchData };
};
