import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

// ── Projects ──────────────────────────────────────────────────

export function useProjects(featured = false) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/projects${featured ? '?featured=true' : ''}`);
      setProjects(data);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [featured]);

  useEffect(() => { fetch(); }, [fetch]);

  return { projects, loading, error, refetch: fetch };
}

export function useAllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createProject = async (payload) => {
    const { data } = await api.post('/projects', payload);
    setProjects((p) => [data, ...p]);
    return data;
  };

  const updateProject = async (id, payload) => {
    const { data } = await api.put(`/projects/${id}`, payload);
    setProjects((p) => p.map((x) => (x._id === id ? data : x)));
    return data;
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects((p) => p.filter((x) => x._id !== id));
  };

  return { projects, loading, refetch: fetch, createProject, updateProject, deleteProject };
}

// ── Messages ──────────────────────────────────────────────────

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/messages');
      setMessages(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const markRead = async (id) => {
    await api.patch(`/messages/${id}/read`);
    setMessages((m) => m.map((x) => (x._id === id ? { ...x, read: true } : x)));
  };

  const deleteMessage = async (id) => {
    await api.delete(`/messages/${id}`);
    setMessages((m) => m.filter((x) => x._id !== id));
  };

  return { messages, loading, refetch: fetch, markRead, deleteMessage };
}
