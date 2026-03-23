import { useEffect, useState } from 'react';
import api from './api';

export const useContentByType = (type) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/content/${type}`);
        if (mounted) setContent(data.content || null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchContent();

    return () => {
      mounted = false;
    };
  }, [type]);

  return { content, loading };
};
