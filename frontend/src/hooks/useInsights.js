import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { setInsights } from '../store/insightsSlice.js';
import { api } from '../lib/api.js';

export const useInsights = () => {
  const dispatch = useDispatch();
  const insights = useSelector((state) => state.insights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.insights.getDashboard();
      dispatch(setInsights(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryDistribution = async () => {
    try {
      const data = await api.insights.getCategories();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return {
    insights,
    loading,
    error,
    fetchInsights,
    fetchCategoryDistribution,
  };
};
